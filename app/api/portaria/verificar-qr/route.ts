import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const codigo = searchParams.get('codigo');
    
    if (!codigo) {
      return NextResponse.json(
        { error: 'Código é obrigatório' },
        { status: 400 }
      );
    }
    
    const acessoResult = await prisma.$queryRaw`
      SELECT 
        a.*,
        json_build_object(
          'nome', m.nome,
          'apartamento', m.apartamento,
          'telefone', m.telefone
        ) as morador
      FROM "acesso_portaria" a
      LEFT JOIN "moradores" m ON a."moradorId" = m.id
      WHERE a."codigoAcesso" = ${codigo}
    `;
    
    const acesso = (acessoResult as any)[0];
    
    if (!acesso) {
      return NextResponse.json(
        { error: 'Código não encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar se o acesso ainda é válido
    const agora = new Date();
    if (acesso.validoAte && new Date(acesso.validoAte) < agora) {
      await prisma.$executeRaw`
        UPDATE "acesso_portaria" SET status = 'EXPIRADO', "updatedAt" = ${agora} WHERE id = ${acesso.id}
      `;
      
      return NextResponse.json(
        { error: 'Código expirado' },
        { status: 410 }
      );
    }
    
    return NextResponse.json(acesso);
  } catch (error) {
    console.error('Erro ao verificar QR Code:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
