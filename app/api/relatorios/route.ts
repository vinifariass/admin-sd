import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export async function GET() {
  return NextResponse.json({ 
    message: 'API de relatórios funcionando', 
    methods: ['POST'], 
    timestamp: new Date().toISOString() 
  });
}

export async function POST(request: NextRequest) {
  console.log('=== API RELATÓRIOS - POST CHAMADO ===');
  console.log('URL:', request.url);
  console.log('Method:', request.method);
  console.log('Headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    console.log('Iniciando geração de relatório...');
    
    const session = await auth();
    
    if (!session?.user || session.user.tipo !== 'ADMIN') {
      console.log('Acesso negado:', session?.user?.tipo);
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores podem gerar relatórios.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    console.log('Dados recebidos:', body);
    
    const { tipo, ano, mes } = body;

    if (!tipo || !ano) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios: tipo e ano' },
        { status: 400 }
      );
    }

    console.log('Gerando PDF...');
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    
    // Header
    pdf.setFontSize(20);
    pdf.text('RELATÓRIO DO CONDOMÍNIO', pageWidth / 2, 20, { align: 'center' });
    
    pdf.setFontSize(12);
    const periodo = mes ? `${mes.toString().padStart(2, '0')}/${ano}` : ano.toString();
    pdf.text(`Período: ${periodo}`, pageWidth / 2, 30, { align: 'center' });
    
    const dataGeracao = new Date().toLocaleString('pt-BR');
    pdf.text(`Gerado em: ${dataGeracao}`, pageWidth / 2, 40, { align: 'center' });
    pdf.text(`Por: ${session.user.name || 'Administrador'}`, pageWidth / 2, 50, { align: 'center' });

    const startDate = new Date(ano, mes ? mes - 1 : 0, 1);
    const endDate = mes 
      ? new Date(ano, mes, 0, 23, 59, 59) 
      : new Date(ano, 11, 31, 23, 59, 59);

    let yPosition = 70;

    if (tipo === 'financeiro') {
      // Relatório Financeiro com Tabela Profissional
      pdf.setFontSize(16);
      pdf.text('RELATÓRIO FINANCEIRO', 20, yPosition);
      yPosition += 20;

      try {
        // Buscar gastos
        console.log('Buscando gastos...');
        const gastos = await prisma.gasto.findMany({
          where: {
            data: { gte: startDate, lte: endDate },
          },
          orderBy: { data: 'desc' },
        });

        const totalGastos = gastos.reduce((acc: number, gasto: any) => acc + gasto.valor, 0);

        // Resumo Financeiro
        pdf.setFontSize(12);
        pdf.text('RESUMO FINANCEIRO:', 20, yPosition);
        yPosition += 10;
        pdf.text(`Total de Gastos: R$ ${totalGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, yPosition);
        yPosition += 10;
        pdf.text(`Quantidade de Gastos: ${gastos.length}`, 20, yPosition);
        yPosition += 20;

        // Tabela de gastos estilo Excel
        if (gastos.length > 0) {
          const tableData = gastos.map((gasto: any, index: number) => [
            (index + 1).toString(),
            new Date(gasto.data).toLocaleDateString('pt-BR'),
            // Limitar descrição a 40 caracteres
            (gasto.descricao || 'Sem descrição').length > 40 
              ? (gasto.descricao || 'Sem descrição').substring(0, 40) + '...'
              : (gasto.descricao || 'Sem descrição'),
            `R$ ${gasto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            gasto.categoria || 'Sem categoria',
            gasto.tipo || 'Geral'
          ]);

          autoTable(pdf, {
            head: [['#', 'Data', 'Descrição', 'Valor', 'Categoria', 'Tipo']],
            body: tableData,
            startY: yPosition,
            styles: {
              fontSize: 9,
              cellPadding: 3,
              lineColor: [200, 200, 200],
              lineWidth: 0.5,
              halign: 'center',
              overflow: 'linebreak',
            },
            headStyles: {
              fillColor: [41, 128, 185],
              textColor: [255, 255, 255],
              fontSize: 10,
              fontStyle: 'bold',
              halign: 'center',
            },
            alternateRowStyles: {
              fillColor: [245, 245, 245],
            },
            columnStyles: {
              0: { halign: 'center', cellWidth: 15 },
              1: { halign: 'center', cellWidth: 22 },
              2: { halign: 'left', cellWidth: 50, overflow: 'linebreak' },
              3: { halign: 'right', cellWidth: 25 },
              4: { halign: 'center', cellWidth: 25 },
              5: { halign: 'center', cellWidth: 20 },
            },
            theme: 'striped',
            margin: { left: 15, right: 15 },
            tableWidth: 'auto',
            pageBreak: 'auto',
          });

          // Adicionar linha de total
          const finalY = (pdf as any).lastAutoTable.finalY || yPosition + 50;
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`TOTAL GERAL: R$ ${totalGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, finalY + 15);
        } else {
          pdf.text('Nenhum gasto encontrado no período.', 20, yPosition);
        }
      } catch (dbError) {
        console.error('Erro ao buscar dados:', dbError);
        pdf.text('Erro ao carregar dados do banco.', 20, yPosition);
        yPosition += 10;
        pdf.text('Verifique a conexão com o banco de dados.', 20, yPosition);
      }

    } else if (tipo === 'moradores') {
      // Relatório de Moradores com Tabela Profissional
      pdf.setFontSize(16);
      pdf.text('RELATÓRIO DE MORADORES', 20, yPosition);
      yPosition += 20;

      try {
        const moradores = await prisma.morador.findMany({
          orderBy: { apartamento: 'asc' },
        });

        pdf.setFontSize(12);
        pdf.text(`Total de Moradores: ${moradores.length}`, 20, yPosition);
        yPosition += 20;

        if (moradores.length > 0) {
          const tableData = moradores.map((morador: any, index: number) => [
            (index + 1).toString(),
            morador.apartamento || 'N/A',
            // Limitar nome a 25 caracteres
            (morador.nome || 'Não informado').length > 25 
              ? (morador.nome || 'Não informado').substring(0, 25) + '...'
              : (morador.nome || 'Não informado'),
            morador.cpf || 'Não informado',
            // Limitar email a 30 caracteres
            (morador.email || 'Não informado').length > 30 
              ? (morador.email || 'Não informado').substring(0, 30) + '...'
              : (morador.email || 'Não informado'),
            morador.telefone || 'Não informado'
          ]);

          autoTable(pdf, {
            head: [['#', 'Apto', 'Nome', 'CPF', 'Email', 'Telefone']],
            body: tableData,
            startY: yPosition,
            styles: {
              fontSize: 9,
              cellPadding: 4,
              lineColor: [200, 200, 200],
              lineWidth: 0.5,
              halign: 'center',
            },
            headStyles: {
              fillColor: [52, 152, 219],
              textColor: [255, 255, 255],
              fontSize: 10,
              fontStyle: 'bold',
              halign: 'center',
            },
            alternateRowStyles: {
              fillColor: [245, 245, 245],
            },
            columnStyles: {
              0: { halign: 'center', cellWidth: 15 },
              1: { halign: 'center', cellWidth: 20 },
              2: { halign: 'left', cellWidth: 40, overflow: 'linebreak' },
              3: { halign: 'center', cellWidth: 30 },
              4: { halign: 'left', cellWidth: 45, overflow: 'linebreak' },
              5: { halign: 'center', cellWidth: 25 },
            },
            theme: 'striped',
            margin: { left: 15, right: 15 },
            tableWidth: 'auto',
            pageBreak: 'auto',
          });

          // Estatísticas adicionais
          const finalY = (pdf as any).lastAutoTable.finalY || yPosition + 50;
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`TOTAL DE MORADORES: ${moradores.length}`, 20, finalY + 15);
          
          const apartamentosOcupados = new Set(moradores.map((m: any) => m.apartamento)).size;
          pdf.setFont('helvetica', 'normal');
          pdf.text(`Apartamentos Ocupados: ${apartamentosOcupados}`, 20, finalY + 25);
        } else {
          pdf.text('Nenhum morador cadastrado.', 20, yPosition);
        }
      } catch (dbError) {
        console.error('Erro ao buscar moradores:', dbError);
        pdf.text('Erro ao carregar dados de moradores.', 20, yPosition);
      }

    } else if (tipo === 'encomendas') {
      // Relatório de Encomendas com Tabela Profissional
      pdf.setFontSize(16);
      pdf.text('RELATÓRIO DE ENCOMENDAS', 20, yPosition);
      yPosition += 20;

      try {
        const encomendas = await prisma.encomenda.findMany({
          where: {
            createdAt: { gte: startDate, lte: endDate },
          },
          include: { morador: true },
          orderBy: { createdAt: 'desc' },
        });

        const totalEncomendas = encomendas.length;
        const encomendasEntregues = encomendas.filter((e: any) => e.dataEntrega).length;
        const encomendasAssinadas = encomendas.filter((e: any) => e.assinado).length;

        pdf.setFontSize(12);
        pdf.text(`Total de Encomendas: ${totalEncomendas}`, 20, yPosition);
        yPosition += 10;
        pdf.text(`Encomendas Entregues: ${encomendasEntregues}`, 20, yPosition);
        yPosition += 10;
        pdf.text(`Encomendas Assinadas: ${encomendasAssinadas}`, 20, yPosition);
        yPosition += 20;

        if (encomendas.length > 0) {
          const tableData = encomendas.map((encomenda: any, index: number) => [
            (index + 1).toString(),
            new Date(encomenda.createdAt).toLocaleDateString('pt-BR'),
            encomenda.numeroPedido || 'N/A',
            // Limitar nome do morador a 20 caracteres
            (encomenda.morador?.nome || 'Não informado').length > 20 
              ? (encomenda.morador?.nome || 'Não informado').substring(0, 20) + '...'
              : (encomenda.morador?.nome || 'Não informado'),
            encomenda.morador?.apartamento || 'N/A',
            // Limitar transportadora a 15 caracteres
            (encomenda.transportadora || 'N/A').length > 15 
              ? (encomenda.transportadora || 'N/A').substring(0, 15) + '...'
              : (encomenda.transportadora || 'N/A'),
            encomenda.dataEntrega ? new Date(encomenda.dataEntrega).toLocaleDateString('pt-BR') : 'Pendente',
            encomenda.assinado ? 'Sim' : 'Não'
          ]);

          autoTable(pdf, {
            head: [['#', 'Data', 'Nº Pedido', 'Morador', 'Apto', 'Transportadora', 'Entrega', 'Assinado']],
            body: tableData,
            startY: yPosition,
            styles: {
              fontSize: 8,
              cellPadding: 3,
              lineColor: [200, 200, 200],
              lineWidth: 0.5,
              halign: 'center',
            },
            headStyles: {
              fillColor: [155, 89, 182],
              textColor: [255, 255, 255],
              fontSize: 9,
              fontStyle: 'bold',
              halign: 'center',
            },
            alternateRowStyles: {
              fillColor: [245, 245, 245],
            },
            columnStyles: {
              0: { halign: 'center', cellWidth: 12 },
              1: { halign: 'center', cellWidth: 20 },
              2: { halign: 'left', cellWidth: 20 },
              3: { halign: 'left', cellWidth: 30, overflow: 'linebreak' },
              4: { halign: 'center', cellWidth: 15 },
              5: { halign: 'left', cellWidth: 25, overflow: 'linebreak' },
              6: { halign: 'center', cellWidth: 20 },
              7: { halign: 'center', cellWidth: 15 },
            },
            theme: 'striped',
            margin: { left: 15, right: 15 },
            tableWidth: 'auto',
            pageBreak: 'auto',
          });

          // Estatísticas finais
          const finalY = (pdf as any).lastAutoTable.finalY || yPosition + 50;
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text('ESTATÍSTICAS:', 20, finalY + 15);
          
          pdf.setFont('helvetica', 'normal');
          pdf.text(`Taxa de Entrega: ${totalEncomendas > 0 ? ((encomendasEntregues / totalEncomendas) * 100).toFixed(1) : 0}%`, 20, finalY + 25);
          pdf.text(`Taxa de Assinatura: ${totalEncomendas > 0 ? ((encomendasAssinadas / totalEncomendas) * 100).toFixed(1) : 0}%`, 20, finalY + 35);
        } else {
          pdf.text('Nenhuma encomenda encontrada no período.', 20, yPosition);
        }
      } catch (dbError) {
        console.error('Erro ao buscar encomendas:', dbError);
        pdf.text('Erro ao carregar dados de encomendas.', 20, yPosition);
      }

    } else if (tipo === 'boletos') {
      // Relatório de Boletos com Tabela Profissional
      pdf.setFontSize(16);
      pdf.text('RELATÓRIO DE BOLETOS', 20, yPosition);
      yPosition += 20;

      try {
        // Buscar boletos (assumindo que existe uma tabela de boletos)
        const boletos = await prisma.boleto.findMany({
          where: {
            dataVencimento: { gte: startDate, lte: endDate },
          },
          include: { morador: true },
          orderBy: { dataVencimento: 'desc' },
        }).catch(() => []);

        if (boletos.length > 0) {
          const totalBoletos = boletos.length;
          const boletosPagos = boletos.filter((b: any) => b.pago).length;
          const totalValor = boletos.reduce((acc: number, boleto: any) => acc + (boleto.valor || 0), 0);
          const valorPago = boletos.filter((b: any) => b.pago).reduce((acc: number, boleto: any) => acc + (boleto.valor || 0), 0);

          pdf.setFontSize(12);
          pdf.text(`Total de Boletos: ${totalBoletos}`, 20, yPosition);
          yPosition += 10;
          pdf.text(`Boletos Pagos: ${boletosPagos}`, 20, yPosition);
          yPosition += 10;
          pdf.text(`Taxa de Pagamento: ${((boletosPagos / totalBoletos) * 100).toFixed(1)}%`, 20, yPosition);
          yPosition += 10;
          pdf.text(`Valor Total: R$ ${totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, yPosition);
          yPosition += 10;
          pdf.text(`Valor Pago: R$ ${valorPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, yPosition);
          yPosition += 20;

          const tableData = boletos.map((boleto: any, index: number) => [
            (index + 1).toString(),
            new Date(boleto.dataVencimento).toLocaleDateString('pt-BR'),
            // Limitar nome do morador a 25 caracteres
            (boleto.morador?.nome || 'N/A').length > 25 
              ? (boleto.morador?.nome || 'N/A').substring(0, 25) + '...'
              : (boleto.morador?.nome || 'N/A'),
            boleto.morador?.apartamento || boleto.apartamento || 'N/A',
            `R$ ${(boleto.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            boleto.pago ? 'Pago' : 'Pendente',
            boleto.dataPagamento ? new Date(boleto.dataPagamento).toLocaleDateString('pt-BR') : '-'
          ]);

          autoTable(pdf, {
            head: [['#', 'Vencimento', 'Morador', 'Apto', 'Valor', 'Status', 'Pagamento']],
            body: tableData,
            startY: yPosition,
            styles: {
              fontSize: 9,
              cellPadding: 4,
              lineColor: [200, 200, 200],
              lineWidth: 0.5,
              halign: 'center',
            },
            headStyles: {
              fillColor: [231, 76, 60],
              textColor: [255, 255, 255],
              fontSize: 10,
              fontStyle: 'bold',
              halign: 'center',
            },
            alternateRowStyles: {
              fillColor: [245, 245, 245],
            },
            columnStyles: {
              0: { halign: 'center', cellWidth: 15 },
              1: { halign: 'center', cellWidth: 25 },
              2: { halign: 'left', cellWidth: 40, overflow: 'linebreak' },
              3: { halign: 'center', cellWidth: 18 },
              4: { halign: 'right', cellWidth: 22 },
              5: { halign: 'center', cellWidth: 22 },
              6: { halign: 'center', cellWidth: 25 },
            },
            theme: 'striped',
            margin: { left: 15, right: 15 },
            tableWidth: 'auto',
            pageBreak: 'auto',
          });

          // Resumo final
          const finalY = (pdf as any).lastAutoTable.finalY || yPosition + 50;
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text('RESUMO FINANCEIRO:', 20, finalY + 15);
          
          pdf.setFont('helvetica', 'normal');
          pdf.text(`Valor a Receber: R$ ${(totalValor - valorPago).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, finalY + 25);
          pdf.text(`Taxa de Inadimplência: ${(((totalBoletos - boletosPagos) / totalBoletos) * 100).toFixed(1)}%`, 20, finalY + 35);
        } else {
          pdf.setFontSize(12);
          pdf.text('Nenhum boleto encontrado no período selecionado.', 20, yPosition);
          yPosition += 20;
          pdf.text('Possíveis motivos:', 20, yPosition);
          yPosition += 10;
          pdf.text('• Período sem emissão de boletos', 25, yPosition);
          yPosition += 10;
          pdf.text('• Tabela de boletos ainda não implementada', 25, yPosition);
          yPosition += 10;
          pdf.text('• Boletos são gerados em outro sistema', 25, yPosition);
        }
      } catch (dbError) {
        console.error('Erro ao buscar boletos:', dbError);
        pdf.setFontSize(12);
        pdf.text('Funcionalidade de boletos em desenvolvimento.', 20, yPosition);
        yPosition += 20;
        pdf.text('Em breve você poderá visualizar:', 20, yPosition);
        yPosition += 10;
        pdf.text('• Total de boletos emitidos', 25, yPosition);
        yPosition += 10;
        pdf.text('• Boletos pagos e pendentes', 25, yPosition);
        yPosition += 10;
        pdf.text('• Taxa de inadimplência', 25, yPosition);
        yPosition += 10;
        pdf.text('• Relatório detalhado por apartamento', 25, yPosition);
      }
    } else {
      pdf.setFontSize(16);
      pdf.text('TIPO DE RELATÓRIO INVÁLIDO', 20, yPosition);
      yPosition += 20;
      pdf.text(`Tipo solicitado: ${tipo}`, 20, yPosition);
    }

    console.log('PDF gerado com sucesso. Preparando resposta...');
    const pdfBuffer = pdf.output('arraybuffer');
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="relatorio-${tipo}-${periodo}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Erro detalhado ao gerar relatório:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
