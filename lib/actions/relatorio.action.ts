'use server';

import { auth } from '@/auth';
import { prisma } from '@/db/prisma';

export async function getRelatorioFinanceiro(ano: number, mes?: number) {
  const session = await auth();
  
  if (!session?.user || session.user.tipo !== 'ADMIN') {
    throw new Error('Acesso negado. Apenas administradores podem gerar relatórios.');
  }

  const startDate = new Date(ano, mes ? mes - 1 : 0, 1);
  const endDate = mes 
    ? new Date(ano, mes, 0, 23, 59, 59) 
    : new Date(ano, 11, 31, 23, 59, 59);

  // Buscar gastos do período
  const gastos = await prisma.gasto.findMany({
    where: {
      data: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      data: 'desc',
    },
  });

  // Buscar boletos do período
  const boletos = await prisma.boleto.findMany({
    where: {
      dataVencimento: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      morador: true,
    },
    orderBy: {
      dataVencimento: 'desc',
    },
  });

  // Calcular totais
  const totalGastos = gastos.reduce((acc, gasto) => acc + gasto.valor, 0);
  const totalBoletos = boletos.reduce((acc, boleto) => acc + boleto.valor, 0);
  const totalPago = boletos
    .filter(boleto => boleto.pago)
    .reduce((acc, boleto) => acc + boleto.valor, 0);
  const totalPendente = boletos
    .filter(boleto => !boleto.pago)
    .reduce((acc, boleto) => acc + boleto.valor, 0);

  // Agrupar gastos por data (já que não há categoria no schema)
  const gastosPorMes = gastos.reduce((acc, gasto) => {
    const mes = new Date(gasto.data).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    if (!acc[mes]) {
      acc[mes] = { total: 0, quantidade: 0 };
    }
    acc[mes].total += gasto.valor;
    acc[mes].quantidade += 1;
    return acc;
  }, {} as Record<string, { total: number; quantidade: number }>);

  return {
    periodo: mes ? `${mes.toString().padStart(2, '0')}/${ano}` : ano.toString(),
    resumo: {
      totalGastos,
      totalBoletos,
      totalPago,
      totalPendente,
      saldo: totalPago - totalGastos,
    },
    gastos,
    boletos,
    gastosPorMes,
    geradoEm: new Date(),
    geradoPor: session.user.name || 'Administrador',
  };
}

export async function getRelatorioMoradores() {
  const session = await auth();
  
  if (!session?.user || session.user.tipo !== 'ADMIN') {
    throw new Error('Acesso negado. Apenas administradores podem gerar relatórios.');
  }

  const moradores = await prisma.morador.findMany({
    include: {
      boletos: {
        where: {
          pago: false,
          dataVencimento: {
            lt: new Date(),
          },
        },
      },
      Encomenda: {
        where: {
          dataAssinatura: null,
        },
      },
    },
    orderBy: {
      apartamento: 'asc',
    },
  });

  const totalMoradores = moradores.length;
  const moradoresInadimplentes = moradores.filter(m => m.boletos.length > 0).length;
  const moradoresComEncomendas = moradores.filter(m => m.Encomenda.length > 0).length;

  const estatisticas = {
    totalMoradores,
    moradoresInadimplentes,
    moradoresComEncomendas,
    taxaInadimplencia: totalMoradores > 0 ? (moradoresInadimplentes / totalMoradores) * 100 : 0,
  };

  return {
    moradores,
    estatisticas,
    geradoEm: new Date(),
    geradoPor: session.user.name || 'Administrador',
  };
}

export async function getRelatorioEncomendas(ano: number, mes?: number) {
  const session = await auth();
  
  if (!session?.user || session.user.tipo !== 'ADMIN') {
    throw new Error('Acesso negado. Apenas administradores podem gerar relatórios.');
  }

  const startDate = new Date(ano, mes ? mes - 1 : 0, 1);
  const endDate = mes 
    ? new Date(ano, mes, 0, 23, 59, 59) 
    : new Date(ano, 11, 31, 23, 59, 59);

  const encomendas = await prisma.encomenda.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      morador: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const totalEncomendas = encomendas.length;
  const encomendasEntregues = encomendas.filter(e => e.dataEntrega).length;
  const encomendasAssinadas = encomendas.filter(e => e.dataAssinatura).length;
  const encomendasPendentes = totalEncomendas - encomendasEntregues;

  // Tempo médio de entrega (usando createdAt como referência)
  const encomendasComTempo = encomendas.filter(e => e.dataEntrega && e.createdAt);
  const tempoMedioEntrega = encomendasComTempo.length > 0
    ? encomendasComTempo.reduce((acc, e) => {
        const tempo = new Date(e.dataEntrega!).getTime() - new Date(e.createdAt).getTime();
        return acc + (tempo / (1000 * 60 * 60 * 24)); // em dias
      }, 0) / encomendasComTempo.length
    : 0;

  // Encomendas por status
  const encomendasPorStatus = encomendas.reduce((acc, encomenda) => {
    const status = encomenda.status || 'Não informado';
    if (!acc[status]) {
      acc[status] = 0;
    }
    acc[status]++;
    return acc;
  }, {} as Record<string, number>);

  return {
    periodo: mes ? `${mes.toString().padStart(2, '0')}/${ano}` : ano.toString(),
    encomendas,
    estatisticas: {
      totalEncomendas,
      encomendasEntregues,
      encomendasAssinadas,
      encomendasPendentes,
      tempoMedioEntrega: Math.round(tempoMedioEntrega * 10) / 10,
      taxaEntrega: totalEncomendas > 0 ? (encomendasEntregues / totalEncomendas) * 100 : 0,
    },
    encomendasPorStatus,
    geradoEm: new Date(),
    geradoPor: session.user.name || 'Administrador',
  };
}

export async function getRelatorioBoletos(ano: number, mes?: number) {
  const session = await auth();
  
  if (!session?.user || session.user.tipo !== 'ADMIN') {
    throw new Error('Acesso negado. Apenas administradores podem gerar relatórios.');
  }

  const startDate = new Date(ano, mes ? mes - 1 : 0, 1);
  const endDate = mes 
    ? new Date(ano, mes, 0, 23, 59, 59) 
    : new Date(ano, 11, 31, 23, 59, 59);

  const boletos = await prisma.boleto.findMany({
    where: {
      dataVencimento: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      morador: true,
    },
    orderBy: {
      dataVencimento: 'desc',
    },
  });

  const totalBoletos = boletos.length;
  const boletosPagos = boletos.filter(b => b.pago).length;
  const boletosVencidos = boletos.filter(b => !b.pago && new Date(b.dataVencimento) < new Date()).length;
  const boletosPendentes = boletos.filter(b => !b.pago && new Date(b.dataVencimento) >= new Date()).length;

  const valorTotal = boletos.reduce((acc, b) => acc + b.valor, 0);
  const valorPago = boletos.filter(b => b.pago).reduce((acc, b) => acc + b.valor, 0);
  const valorPendente = boletos.filter(b => !b.pago).reduce((acc, b) => acc + b.valor, 0);

  // Inadimplência por apartamento
  const inadimplenciaPorApto = boletos
    .filter(b => !b.pago && new Date(b.dataVencimento) < new Date())
    .reduce((acc, boleto) => {
      const apto = boleto.apartamento;
      if (!acc[apto]) {
        acc[apto] = { quantidade: 0, valor: 0, morador: boleto.morador?.nome || 'Não informado' };
      }
      acc[apto].quantidade++;
      acc[apto].valor += boleto.valor;
      return acc;
    }, {} as Record<string, { quantidade: number; valor: number; morador: string }>);

  return {
    periodo: mes ? `${mes.toString().padStart(2, '0')}/${ano}` : ano.toString(),
    boletos,
    estatisticas: {
      totalBoletos,
      boletosPagos,
      boletosVencidos,
      boletosPendentes,
      valorTotal,
      valorPago,
      valorPendente,
      taxaPagamento: totalBoletos > 0 ? (boletosPagos / totalBoletos) * 100 : 0,
      taxaInadimplencia: totalBoletos > 0 ? (boletosVencidos / totalBoletos) * 100 : 0,
    },
    inadimplenciaPorApto,
    geradoEm: new Date(),
    geradoPor: session.user.name || 'Administrador',
  };
}
