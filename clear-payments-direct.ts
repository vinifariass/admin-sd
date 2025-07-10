import { prisma } from './db/prisma';

async function clearPayments() {
  console.log('🗑️ Deletando todos os pagamentos...');
  
  try {
    const result = await prisma.payment.deleteMany({});
    console.log(`✅ ${result.count} pagamentos foram deletados com sucesso`);
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

clearPayments().finally(() => {
  console.log('🏁 Operação finalizada');
});
