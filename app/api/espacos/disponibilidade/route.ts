import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const espacoId = searchParams.get('espacoId');
    const dataReserva = searchParams.get('dataReserva');
    const horaInicio = searchParams.get('horaInicio');
    const horaFim = searchParams.get('horaFim');
    
    if (!espacoId || !dataReserva || !horaInicio || !horaFim) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios não fornecidos' },
        { status: 400 }
      );
    }
    
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
    
    const disponivel = Number((conflitos as any)[0].count) === 0;
    
    return NextResponse.json({ disponivel });
  } catch (error) {
    console.error('Erro ao verificar disponibilidade:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
