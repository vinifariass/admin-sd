import { prisma } from '@/db/prisma';

async function testPaymentSystem() {
  console.log('🔄 Testando sistema de pagamentos...');
  
  try {
    // Verificar se existem moradores
    const moradores = await prisma.morador.findMany({
      take: 5,
      select: {
        id: true,
        nome: true,
        apartamento: true
      }
    });
    
    console.log('👥 Moradores encontrados:', moradores.length);
    moradores.forEach(m => console.log(`  - ${m.nome} (Apt ${m.apartamento})`));
    
    // Verificar se existem pagamentos
    const pagamentos = await prisma.payment.findMany({
      take: 5,
      include: {
        morador: {
          select: {
            nome: true,
            apartamento: true
          }
        }
      }
    });
    
    console.log('💳 Pagamentos encontrados:', pagamentos.length);
    pagamentos.forEach(p => console.log(`  - ${p.descricao} - ${p.morador.nome} (${p.pago ? 'Pago' : 'Pendente'})`));
    
    // Verificar estatísticas
    const stats = await prisma.payment.aggregate({
      _count: true,
      _sum: {
        valor: true
      }
    });
    
    console.log('📊 Estatísticas:');
    console.log(`  - Total de pagamentos: ${stats._count}`);
    console.log(`  - Valor total: R$ ${stats._sum.valor || 0}`);
    
    console.log('✅ Sistema de pagamentos testado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao testar sistema:', error);
  }
}

// Executar teste
testPaymentSystem().finally(() => {
  console.log('🏁 Teste finalizado');
});
