import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/db/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ativo = searchParams.get('ativo');
    
    let whereClause = '';
    if (ativo !== null) {
      whereClause = ` WHERE ativo = ${ativo === 'true'}`;
    }
    
    const espacos = await prisma.$queryRaw`
      SELECT 
        e.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', r.id,
              'dataReserva', r."dataReserva",
              'horaInicio', r."horaInicio",
              'horaFim', r."horaFim",
              'status', r.status
            )
          ) FILTER (WHERE r.id IS NOT NULL),
          '[]'
        ) as reservas
      FROM "espacos_comuns" e
      LEFT JOIN "reservas_espacos" r ON e.id = r."espacoId"
      ${whereClause ? Prisma.raw(whereClause) : Prisma.empty}
      GROUP BY e.id
      ORDER BY e.nome ASC
    `;
    
    return NextResponse.json(espacos);
  } catch (error) {
    console.error('Erro ao buscar espaços:', error);
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
      nome,
      descricao,
      capacidade,
      preco,
      tempoMinimo,
      tempoMaximo,
      observacoes,
      equipamentos,
      regras,
      imagens
    } = body;
    
    // Validação básica
    if (!nome) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }
    
    const espaco = await prisma.$queryRaw`
      INSERT INTO "espacos_comuns" (
        id, nome, descricao, capacidade, preco, "tempoMinimo", "tempoMaximo",
        observacoes, equipamentos, regras, imagens, "createdAt", "updatedAt"
      ) VALUES (
        gen_random_uuid(),
        ${nome},
        ${descricao},
        ${capacidade ? parseInt(capacidade) : null},
        ${preco ? parseFloat(preco) : 0},
        ${tempoMinimo ? parseInt(tempoMinimo) : 2},
        ${tempoMaximo ? parseInt(tempoMaximo) : 8},
        ${observacoes},
        ${JSON.stringify(equipamentos || [])},
        ${JSON.stringify(regras || [])},
        ${JSON.stringify(imagens || [])},
        NOW(),
        NOW()
      )
      RETURNING *
    `;
    
    return NextResponse.json(espaco, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar espaço:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
