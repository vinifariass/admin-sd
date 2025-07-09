import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/db/prisma';
import { Prisma } from '@prisma/client';
import QRCode from 'qrcode';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const apartamento = searchParams.get('apartamento');
    
    const skip = (page - 1) * limit;
    
    let whereClause = '';
    if (status) {
      whereClause += ` AND status = '${status}'`;
    }
    if (apartamento) {
      whereClause += ` AND apartamento = '${apartamento}'`;
    }
    
    const acessos = await prisma.$queryRaw`
      SELECT 
        a.id,
        a.tipo,
        a."nomeVisitante",
        a."cpfVisitante",
        a.telefone,
        a.apartamento,
        a."moradorId",
        a."dataVisita",
        a."horaInicio",
        a."horaFim",
        a.observacoes,
        a.status,
        a."qrCode",
        a."codigoAcesso",
        a."validoAte",
        a."createdAt",
        a."updatedAt",
        m.nome as morador_nome,
        m.apartamento as morador_apartamento,
        m.telefone as morador_telefone
      FROM "acesso_portaria" a
      LEFT JOIN "moradores" m ON a."moradorId" = m.id
      WHERE 1=1 ${whereClause ? Prisma.raw(whereClause) : Prisma.empty}
      ORDER BY a."createdAt" DESC
      LIMIT ${limit} OFFSET ${skip}
    `;
    
    // Converter datas para o formato correto
    const acessosFormatados = (acessos as any[]).map(acesso => ({
      ...acesso,
      dataVisita: new Date(acesso.dataVisita).toISOString(),
      validoAte: acesso.validoAte ? new Date(acesso.validoAte).toISOString() : null,
      createdAt: new Date(acesso.createdAt).toISOString(),
      updatedAt: new Date(acesso.updatedAt).toISOString()
    }));
    
    const totalResult = await prisma.$queryRaw`
      SELECT COUNT(*) as total FROM "acesso_portaria" a
      WHERE 1=1 ${whereClause ? Prisma.raw(whereClause) : Prisma.empty}
    `;
    
    const total = Number((totalResult as any)[0].total);
    
    return NextResponse.json({
      acessos: acessosFormatados,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar acessos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tipo,
      nomeVisitante,
      cpfVisitante,
      telefone,
      apartamento,
      dataVisita,
      horaInicio,
      horaFim,
      observacoes,
      moradorId,
      validoAte
    } = body;
    
    // Validação básica
    if (!tipo || !apartamento || !dataVisita || !horaInicio) {
      return NextResponse.json(
        { error: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      );
    }
    
    // Gerar código de acesso único
    const codigoAcesso = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Criar dados mais compactos para o QR Code (apenas o código de acesso)
    const qrCodeData = codigoAcesso;
    
    // Gerar QR Code real com configurações para menor tamanho
    const qrCodeString = await QRCode.toDataURL(qrCodeData, {
      errorCorrectionLevel: 'L', // Menor correção de erro = menor tamanho
      type: 'image/png',
      margin: 0, // Sem margem
      scale: 4, // Escala menor
      width: 150, // Tamanho fixo pequeno
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    const validoAteDate = validoAte ? new Date(validoAte) : new Date(Date.now() + 24 * 60 * 60 * 1000);
      const acesso = await prisma.$queryRaw`
      INSERT INTO "acesso_portaria" (
        id, tipo, "nomeVisitante", "cpfVisitante", telefone, apartamento,
        "moradorId", "dataVisita", "horaInicio", "horaFim", observacoes,
        status, "qrCode", "codigoAcesso", "validoAte", "createdAt", "updatedAt"
      ) VALUES (
        gen_random_uuid(),
        ${tipo}::"TipoAcesso",
        ${nomeVisitante},
        ${cpfVisitante},
        ${telefone},
        ${apartamento},
        ${moradorId},
        ${new Date(dataVisita)},
        ${horaInicio},
        ${horaFim},
        ${observacoes},
        'AGENDADO'::"StatusAcesso",
        ${qrCodeString},
        ${codigoAcesso},
        ${validoAteDate},
        NOW(),
        NOW()
      )
      RETURNING *
    `;
    
    // Formatar as datas do resultado
    const acessoFormatado = {
      ...(acesso as any[])[0],
      dataVisita: new Date((acesso as any[])[0].dataVisita).toISOString(),
      validoAte: (acesso as any[])[0].validoAte ? new Date((acesso as any[])[0].validoAte).toISOString() : null,
      createdAt: new Date((acesso as any[])[0].createdAt).toISOString(),
      updatedAt: new Date((acesso as any[])[0].updatedAt).toISOString()
    };

    return NextResponse.json(acessoFormatado, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar acesso:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
