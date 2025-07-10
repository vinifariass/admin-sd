import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/db/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const acesso = await prisma.$queryRaw`
      SELECT 
        a.*,
        json_build_object(
          'nome', m.nome,
          'apartamento', m.apartamento,
          'telefone', m.telefone
        ) as morador
      FROM "acesso_portaria" a
      LEFT JOIN "moradores" m ON a."moradorId" = m.id
      WHERE a.id = ${id}
    `;
    
    const acessoResult = (acesso as any)[0];
    
    if (!acessoResult) {
      return NextResponse.json(
        { error: 'Acesso não encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(acessoResult);
  } catch (error) {
    console.error('Erro ao buscar acesso:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, observacoes, liberadoPor } = body;
    
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramIndex = 1;
    
    if (status) {
      updateFields.push(`status = $${paramIndex++}`);
      updateValues.push(status);
    }
    
    if (observacoes) {
      updateFields.push(`observacoes = $${paramIndex++}`);
      updateValues.push(observacoes);
    }
    
    if (liberadoPor) {
      updateFields.push(`"liberadoPor" = $${paramIndex++}`);
      updateValues.push(liberadoPor);
    }
    
    if (status === 'APROVADO') {
      updateFields.push(`"dataLiberacao" = $${paramIndex++}`);
      updateValues.push(new Date());
    }
    
    updateFields.push(`"updatedAt" = $${paramIndex++}`);
    updateValues.push(new Date());
    
    // Adicionar o ID no final
    updateValues.push(id);
    
    if (updateFields.length === 1) { // Apenas updatedAt
      return NextResponse.json(
        { error: 'Nenhum campo para atualizar' },
        { status: 400 }
      );
    }
    
    await prisma.$executeRaw`
      UPDATE "acesso_portaria" 
      SET ${updateFields.map((field, i) => `${field.replace(`$${i + 1}`, `'${updateValues[i]}'`)}`).join(', ')}
      WHERE id = '${id}'
    `;
    
    // Buscar dados atualizados
    const acessoAtualizado = await prisma.$queryRaw`
      SELECT 
        a.*,
        json_build_object(
          'nome', m.nome,
          'apartamento', m.apartamento,
          'telefone', m.telefone
        ) as morador
      FROM "acesso_portaria" a
      LEFT JOIN "moradores" m ON a."moradorId" = m.id
      WHERE a.id = ${id}
    `;
    
    return NextResponse.json((acessoAtualizado as any)[0]);
  } catch (error) {
    console.error('Erro ao atualizar acesso:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.$executeRaw`
      DELETE FROM "acesso_portaria" WHERE id = ${id}
    `;
    
    return NextResponse.json({ message: 'Acesso removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover acesso:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
