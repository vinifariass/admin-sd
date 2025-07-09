import { prisma } from '@/db/prisma';

async function seedEspacosComuns() {
  console.log('Criando espaços comuns...');
  
  // Churrasco Gourmet
  await prisma.espacoComum.create({
    data: {
      nome: 'Churrasco Gourmet',
      descricao: 'Espaço com churrasqueira profissional, pia, geladeira e área coberta para até 50 pessoas.',
      capacidade: 50,
      preco: 200.00, // Valor fixo por dia
      tempoMinimo: 3,
      tempoMaximo: 8,
      observacoes: 'Não é permitido o uso de som alto após 22h. Limpeza obrigatória após o uso.',
      equipamentos: [
        'Churrasqueira profissional',
        'Pia com água quente',
        'Geladeira industrial',
        'Mesas e cadeiras',
        'Área coberta',
        'Iluminação LED',
        'Ventiladores'
      ],
      regras: [
        'Reserva mínima de 3 horas',
        'Limpeza obrigatória após uso',
        'Som permitido até 22h',
        'Proibido fumar na área coberta',
        'Máximo 50 pessoas',
        'Não é permitido pendurar decorações no teto'
      ],
      imagens: [
        '/images/espacos/churrasco-1.jpg',
        '/images/espacos/churrasco-2.jpg',
        '/images/espacos/churrasco-3.jpg'
      ]
    }
  });
  
  // Salão de Festas
  await prisma.espacoComum.create({
    data: {
      nome: 'Salão de Festas',
      descricao: 'Amplo salão climatizado com palco, sistema de som e iluminação para eventos especiais.',
      capacidade: 100,
      preco: 150.00, // Valor fixo por dia
      tempoMinimo: 4,
      tempoMaximo: 12,
      observacoes: 'Ideal para aniversários, casamentos e eventos corporativos. Sistema de som profissional incluído.',
      equipamentos: [
        'Sistema de som profissional',
        'Palco com iluminação',
        'Ar condicionado',
        'Mesas redondas (10 unidades)',
        'Cadeiras (100 unidades)',
        'Copa com geladeira',
        'Banheiros masculino e feminino',
        'Projetor multimídia'
      ],
      regras: [
        'Reserva mínima de 4 horas',
        'Limpeza obrigatória após uso',
        'Som permitido até 23h',
        'Proibido fumar no salão',
        'Máximo 100 pessoas',
        'Decoração deve ser retirada até 1h após o evento',
        'Não é permitido usar confetes ou glitter'
      ],
      imagens: [
        '/images/espacos/salao-1.jpg',
        '/images/espacos/salao-2.jpg',
        '/images/espacos/salao-3.jpg',
        '/images/espacos/salao-4.jpg'
      ]
    }
  });
  
  // Playground
  await prisma.espacoComum.create({
    data: {
      nome: 'Playground',
      descricao: 'Área infantil com brinquedos seguros e certificados para crianças de 2 a 12 anos.',
      capacidade: 30,
      preco: 0.00,
      tempoMinimo: 1,
      tempoMaximo: 4,
      observacoes: 'Uso gratuito. Crianças devem estar sempre acompanhadas de um responsável.',
      equipamentos: [
        'Escorregador',
        'Gangorra',
        'Balanços',
        'Casinha de boneca',
        'Sandbox',
        'Bancos para responsáveis',
        'Lixeiras',
        'Iluminação noturna'
      ],
      regras: [
        'Crianças devem estar acompanhadas',
        'Uso gratuito',
        'Horário de funcionamento: 6h às 20h',
        'Proibido animais',
        'Máximo 30 crianças',
        'Responsáveis devem supervisionar sempre'
      ],
      imagens: [
        '/images/espacos/playground-1.jpg',
        '/images/espacos/playground-2.jpg'
      ]
    }
  });
  
  // Quadra Poliesportiva
  await prisma.espacoComum.create({
    data: {
      nome: 'Quadra Poliesportiva',
      descricao: 'Quadra coberta para prática de futebol, vôlei, basquete e outros esportes.',
      capacidade: 20,
      preco: 50.00,
      tempoMinimo: 1,
      tempoMaximo: 3,
      observacoes: 'Aluguel de equipamentos esportivos disponível mediante taxa adicional.',
      equipamentos: [
        'Quadra coberta',
        'Iluminação LED',
        'Rede de vôlei',
        'Cestas de basquete',
        'Traves de futebol',
        'Vestiário masculino e feminino',
        'Arquibancada',
        'Bebedouro'
      ],
      regras: [
        'Uso de tênis obrigatório',
        'Proibido uso de chuteiras',
        'Máximo 20 pessoas',
        'Equipamentos devem ser devolvidos limpos',
        'Horário de funcionamento: 6h às 22h',
        'Reserva por período de 1 hora'
      ],
      imagens: [
        '/images/espacos/quadra-1.jpg',
        '/images/espacos/quadra-2.jpg'
      ]
    }
  });
  
  console.log('Espaços comuns criados com sucesso!');
}

export default seedEspacosComuns;
