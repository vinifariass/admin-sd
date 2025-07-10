import { deleteAllPagamentos } from './lib/actions/pagamento.action';

async function clearPayments() {
  console.log('🗑️ Deletando todos os pagamentos...');
  
  try {
    const result = await deleteAllPagamentos();
    
    if (result.success) {
      console.log('✅', result.message);
    } else {
      console.log('❌', result.message);
    }
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

clearPayments().finally(() => {
  console.log('🏁 Operação finalizada');
});
