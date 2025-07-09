import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const moradorId = searchParams.get('moradorId');
    
    const skip = (page - 1) * limit;
    
    let whereClause = '';
    if (status) {
      whereClause += ` AND r.status = '${status}'`;
    }
    if (moradorId) {
      whereClause += ` AND r."moradorId" = '${moradorId}'`;
    }
    
    const reservas = await prisma.$queryRaw`
      SELECT 
        r.*,
        json_build_object(
          'nome', e.nome,
          'capacidade', e.capacidade,
          'preco', e.preco
        ) as espaco,
        json_build_object(
          'nome', m.nome,
          'apartamento', m.apartamento,
          'telefone', m.telefone
        ) as morador
      FROM "reservas_espacos" r
      LEFT JOIN "espacos_comuns" e ON r."espacoId" = e.id
      LEFT JOIN "moradores" m ON r."moradorId" = m.id
      WHERE 1=1 ${whereClause}
      ORDER BY r."dataReserva" DESC
      LIMIT ${limit} OFFSET ${skip}
    `;
    
    const totalResult = await prisma.$queryRaw`
      SELECT COUNT(*) as total 
      FROM "reservas_espacos" r
      WHERE 1=1 ${whereClause}
    `;
    
    const total = Number((totalResult as any)[0].total);
    
    return NextResponse.json({
      reservas,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar reservas:', error);
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
      espacoId,
      moradorId,
      dataReserva,
      horaInicio,
      horaFim,
      observacoes,
      convidados,
      telefoneContato,
      eventoPrincipal,
      equipamentos,
      servicosExtras
    } = body;
    
    // Validação básica
    if (!espacoId || !moradorId || !dataReserva || !horaInicio || !horaFim) {
      return NextResponse.json(
        { error: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      );
    }
    
    // Buscar dados do espaço para calcular valor
    const espacoResult = await prisma.$queryRaw`
      SELECT * FROM "espacos_comuns" WHERE id = ${espacoId}
    `;
    
    const espaco = (espacoResult as any)[0];
    
    if (!espaco) {
      return NextResponse.json(
        { error: 'Espaço não encontrado' },
        { status: 404 }
      );
    }
    
    // Calcular valor total
    const horaInicioNum = parseInt(horaInicio.split(':')[0]);
    const horaFimNum = parseInt(horaFim.split(':')[0]);
    const horas = horaFimNum - horaInicioNum;
    const valorTotal = (espaco.preco || 0) * horas;
    
    // Verificar conflitos de horário
    const conflitos = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM "reservas_espacos"
      WHERE "espacoId" = ${espacoId}
        AND "dataReserva" = ${new Date(dataReserva)}
        AND status IN ('PENDENTE', 'APROVADA')
        AND (
          ("horaInicio" <= ${horaInicio} AND "horaFim" > ${horaInicio})
          OR ("horaInicio" < ${horaFim} AND "horaFim" >= ${horaFim})
        )
    `;
    
    if (Number((conflitos as any)[0].count) > 0) {
      return NextResponse.json(
        { error: 'Horário já reservado para este espaço' },
        { status: 409 }
      );
    }
    
    // Criar reserva
    const reservaResult = await prisma.$queryRaw`
      INSERT INTO "reservas_espacos" (
        id, "espacoId", "moradorId", "dataReserva", "horaInicio", "horaFim",
        "valorTotal", observacoes, convidados, "telefoneContato", "eventoPrincipal",
        equipamentos, "servicosExtras", status, "createdAt", "updatedAt"
      ) VALUES (
        gen_random_uuid(),
        ${espacoId},
        ${moradorId},
        ${new Date(dataReserva)},
        ${horaInicio},
        ${horaFim},
        ${valorTotal},
        ${observacoes},
        ${convidados ? parseInt(convidados) : 0},
        ${telefoneContato},
        ${eventoPrincipal},
        ${JSON.stringify(equipamentos || [])},
        ${JSON.stringify(servicosExtras || [])},
        'PENDENTE'::"StatusReserva",
        NOW(),
        NOW()
      )
      RETURNING *
    `;
    
    const reserva = (reservaResult as any)[0];
    
    // Buscar dados completos para retorno
    const reservaCompleta = await prisma.$queryRaw`
      SELECT 
        r.*,
        json_build_object(
          'nome', e.nome,
          'capacidade', e.capacidade,
          'preco', e.preco
        ) as espaco,
        json_build_object(
          'nome', m.nome,
          'apartamento', m.apartamento,
          'telefone', m.telefone
        ) as morador
      FROM "reservas_espacos" r
      LEFT JOIN "espacos_comuns" e ON r."espacoId" = e.id
      LEFT JOIN "moradores" m ON r."moradorId" = m.id
      WHERE r.id = ${reserva.id}
    `;
    
    return NextResponse.json((reservaCompleta as any)[0], { status: 201 });
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
