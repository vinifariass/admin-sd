import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/db/prisma';
import { Prisma } from '@prisma/client';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, aprovadoPor, motivoCancelamento } = body;
    
    // Construir query de atualização dinamicamente
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramIndex = 1;
    
    if (status) {
      updateFields.push(`status = $${paramIndex++}`);
      updateValues.push(status);
    }
    
    if (aprovadoPor) {
      updateFields.push(`"aprovadoPor" = $${paramIndex++}`);
      updateValues.push(aprovadoPor);
    }
    
    if (motivoCancelamento) {
      updateFields.push(`"motivoCancelamento" = $${paramIndex++}`);
      updateValues.push(motivoCancelamento);
    }
    
    if (status === 'APROVADA') {
      updateFields.push(`"dataAprovacao" = $${paramIndex++}`);
      updateValues.push(new Date());
    }
    
    updateFields.push(`"updatedAt" = $${paramIndex++}`);
    updateValues.push(new Date());
    
    // Adicionar o ID no final
    updateValues.push(id);
    
    const reserva = await prisma.$queryRaw`
      UPDATE "reservas_espacos" 
      SET ${Prisma.raw(updateFields.join(', '))}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    // Buscar dados relacionados
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
      WHERE r.id = ${id}
    `;
    
    return NextResponse.json((reservaCompleta as any)[0]);
  } catch (error) {
    console.error('Erro ao atualizar reserva:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
