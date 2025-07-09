import { prisma } from './db/prisma';

async function testPrisma() {
  try {
    // Teste básico
    const users = await prisma.user.findMany();
    console.log('✅ Prisma está funcionando');
    
    // Teste dos novos modelos
    const espacos = await prisma.espacoComum.findMany();
    console.log('✅ Modelo EspacoComum está funcionando');
    
    const acessos = await prisma.acessoPortaria.findMany();
    console.log('✅ Modelo AcessoPortaria está funcionando');
    
    const reservas = await prisma.reservaEspaco.findMany();
    console.log('✅ Modelo ReservaEspaco está funcionando');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();
