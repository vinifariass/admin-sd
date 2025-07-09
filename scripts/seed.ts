import { prisma } from '@/db/prisma';

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');
    
    // Limpar dados existentes
    await prisma.$executeRaw`DELETE FROM "reservas_espacos"`;
    await prisma.$executeRaw`DELETE FROM "espacos_comuns"`;
    await prisma.$executeRaw`DELETE FROM "acesso_portaria"`;
    
    // Criar espaços comuns
    const espacos = await prisma.$executeRaw`
      INSERT INTO "espacos_comuns" (
        id, nome, descricao, capacidade, preco, "tempoMinimo", "tempoMaximo", 
        ativo, observacoes, equipamentos, regras, imagens, "createdAt", "updatedAt"
      ) VALUES 
      (
        gen_random_uuid(),
        'Churrasco Gourmet',
        'Espaço com churrasqueira profissional, pia, geladeira e área coberta para até 50 pessoas.',
        50,
        80.00,
        3,
        8,
        true,
        'Não é permitido o uso de som alto após 22h. Limpeza obrigatória após o uso.',
        '{"Churrasqueira profissional", "Pia com água quente", "Geladeira industrial", "Mesas e cadeiras", "Área coberta", "Iluminação LED", "Ventiladores"}',
        '{"Reserva mínima de 3 horas", "Limpeza obrigatória após uso", "Som permitido até 22h", "Proibido fumar na área coberta", "Máximo 50 pessoas", "Não é permitido pendurar decorações no teto"}',
        '{"/images/espacos/churrasco-1.jpg", "/images/espacos/churrasco-2.jpg", "/images/espacos/churrasco-3.jpg"}',
        NOW(),
        NOW()
      ),
      (
        gen_random_uuid(),
        'Salão de Festas',
        'Amplo salão climatizado com palco, sistema de som e iluminação para eventos especiais.',
        100,
        150.00,
        4,
        12,
        true,
        'Ideal para aniversários, casamentos e eventos corporativos. Sistema de som profissional incluído.',
        '{"Sistema de som profissional", "Palco com iluminação", "Ar condicionado", "Mesas redondas (10 unidades)", "Cadeiras (100 unidades)", "Copa com geladeira", "Banheiros masculino e feminino", "Projetor multimídia"}',
        '{"Reserva mínima de 4 horas", "Limpeza obrigatória após uso", "Som permitido até 23h", "Proibido fumar no salão", "Máximo 100 pessoas", "Decoração deve ser retirada até 1h após o evento", "Não é permitido usar confetes ou glitter"}',
        '{"/images/espacos/salao-1.jpg", "/images/espacos/salao-2.jpg", "/images/espacos/salao-3.jpg", "/images/espacos/salao-4.jpg"}',
        NOW(),
        NOW()
      ),
      (
        gen_random_uuid(),
        'Playground',
        'Área infantil com brinquedos seguros e certificados para crianças de 2 a 12 anos.',
        30,
        0.00,
        1,
        4,
        true,
        'Uso gratuito. Crianças devem estar sempre acompanhadas de um responsável.',
        '{"Escorregador", "Gangorra", "Balanços", "Casinha de boneca", "Sandbox", "Bancos para responsáveis", "Lixeiras", "Iluminação noturna"}',
        '{"Crianças devem estar acompanhadas", "Uso gratuito", "Horário de funcionamento: 6h às 20h", "Proibido animais", "Máximo 30 crianças", "Responsáveis devem supervisionar sempre"}',
        '{"/images/espacos/playground-1.jpg", "/images/espacos/playground-2.jpg"}',
        NOW(),
        NOW()
      ),
      (
        gen_random_uuid(),
        'Quadra Poliesportiva',
        'Quadra coberta para prática de futebol, vôlei, basquete e outros esportes.',
        20,
        50.00,
        1,
        3,
        true,
        'Aluguel de equipamentos esportivos disponível mediante taxa adicional.',
        '{"Quadra coberta", "Iluminação LED", "Rede de vôlei", "Cestas de basquete", "Traves de futebol", "Vestiário masculino e feminino", "Arquibancada", "Bebedouro"}',
        '{"Uso de tênis obrigatório", "Proibido uso de chuteiras", "Máximo 20 pessoas", "Equipamentos devem ser devolvidos limpos", "Horário de funcionamento: 6h às 22h", "Reserva por período de 1 hora"}',
        '{"/images/espacos/quadra-1.jpg", "/images/espacos/quadra-2.jpg"}',
        NOW(),
        NOW()
      )
    `;
    
    console.log('✅ Espaços comuns criados com sucesso!');
    
    // Criar alguns acessos de exemplo
    await prisma.$executeRaw`
      INSERT INTO "acesso_portaria" (
        id, tipo, "nomeVisitante", "cpfVisitante", telefone, apartamento, 
        "dataVisita", "horaInicio", "horaFim", status, "codigoAcesso", 
        "validoAte", "createdAt", "updatedAt"
      ) VALUES 
      (
        gen_random_uuid(),
        'VISITANTE',
        'João Silva',
        '123.456.789-00',
        '(11) 99999-9999',
        '101',
        '2025-01-10',
        '14:00',
        '18:00',
        'AGENDADO',
        'ABC123',
        '2025-01-10 23:59:59',
        NOW(),
        NOW()
      ),
      (
        gen_random_uuid(),
        'DELIVERY',
        'Maria Santos',
        '987.654.321-00',
        '(11) 88888-8888',
        '205',
        '2025-01-09',
        '19:00',
        '19:30',
        'APROVADO',
        'DEF456',
        '2025-01-09 23:59:59',
        NOW(),
        NOW()
      )
    `;
    
    console.log('✅ Acessos de exemplo criados com sucesso!');
    
    console.log('🎉 Seed completado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
