import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/db/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const acessoResult = await prisma.$queryRaw`
      SELECT * FROM "acesso_portaria" WHERE id = ${id}
    `;
    
    const acesso = (acessoResult as any)[0];
    
    if (!acesso) {
      return NextResponse.json(
        { error: 'Acesso não encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar se o acesso pode ser usado
    if (acesso.status !== 'APROVADO') {
      return NextResponse.json(
        { error: 'Acesso não aprovado' },
        { status: 403 }
      );
    }
    
    if (acesso.entradaEfetuada) {
      return NextResponse.json(
        { error: 'Entrada já registrada' },
        { status: 409 }
      );
    }
    
    // Verificar se ainda está no prazo
    const agora = new Date();
    if (acesso.validoAte && new Date(acesso.validoAte) < agora) {
      return NextResponse.json(
        { error: 'Acesso expirado' },
        { status: 410 }
      );
    }
    
    // Registrar a entrada
    await prisma.$executeRaw`
      UPDATE "acesso_portaria" 
      SET "entradaEfetuada" = true, "horaEntrada" = ${agora}, status = 'UTILIZADO', "updatedAt" = ${agora}
      WHERE id = ${id}
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
    console.error('Erro ao registrar entrada:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
