import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/db/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { espacoId } = body;
    
    if (!espacoId) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios não fornecidos' },
        { status: 400 }
      );
    }
    
    // Buscar dados do espaço
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
    
    // Valor fixo por dia
    const valorTotal = espaco.preco || 0;
    
    return NextResponse.json({
      valorTotal,
      detalhes: {
        valorBase: valorTotal,
        observacoes: 'Valor fixo por dia de uso'
      }
    });
  } catch (error) {
    console.error('Erro ao calcular valor:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
