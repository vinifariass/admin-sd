export type StatusReserva = 'PENDENTE' | 'APROVADA' | 'REJEITADA' | 'CANCELADA' | 'REALIZADA';

export interface EspacoComum {
  id: string;
  nome: string;
  descricao?: string;
  capacidade?: number;
  preco?: number;
  tempoMinimo?: number;
  tempoMaximo?: number;
  ativo: boolean;
  observacoes?: string;
  imagens: string[];
  equipamentos: string[];
  regras: string[];
  createdAt: Date;
  updatedAt: Date;
  reservas?: ReservaEspaco[];
}

export interface ReservaEspaco {
  id: string;
  espacoId: string;
  moradorId: string;
  dataReserva: Date;
  horaInicio: string;
  horaFim: string;
  valorTotal?: number;
  status: StatusReserva;
  observacoes?: string;
  convidados?: number;
  telefoneContato?: string;
  eventoPrincipal?: string;
  equipamentos: string[];
  servicosExtras: string[];
  aprovadoPor?: string;
  dataAprovacao?: Date;
  motivoCancelamento?: string;
  createdAt: Date;
  updatedAt: Date;
  espaco?: {
    nome: string;
    capacidade?: number;
    preco?: number;
  };
  morador?: {
    nome: string;
    apartamento: string;
    telefone?: string;
  };
}

export interface CreateEspacoData {
  nome: string;
  descricao?: string;
  capacidade?: number;
  preco?: number;
  tempoMinimo?: number;
  tempoMaximo?: number;
  observacoes?: string;
  equipamentos?: string[];
  regras?: string[];
  imagens?: string[];
}

export interface CreateReservaData {
  espacoId: string;
  moradorId: string;
  dataReserva: Date;
  horaInicio: string;
  horaFim: string;
  observacoes?: string;
  convidados?: number;
  telefoneContato?: string;
  eventoPrincipal?: string;
  equipamentos?: string[];
  servicosExtras?: string[];
}

export interface GetReservasParams {
  page?: number;
  limit?: number;
  status?: StatusReserva;
  moradorId?: string;
}

export interface ReservasResponse {
  reservas: ReservaEspaco[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Função para buscar espaços
export async function getEspacos(ativo?: boolean): Promise<EspacoComum[]> {
  const params = new URLSearchParams();
  if (ativo !== undefined) params.append('ativo', ativo.toString());
  
  const response = await fetch(`/api/espacos?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Erro ao buscar espaços');
  }
  
  return response.json();
}

// Função para criar novo espaço
export async function createEspaco(data: CreateEspacoData): Promise<EspacoComum> {
  const response = await fetch('/api/espacos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erro ao criar espaço');
  }
  
  return response.json();
}

// Função para buscar reservas
export async function getReservas(params: GetReservasParams = {}): Promise<ReservasResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.status) searchParams.append('status', params.status);
  if (params.moradorId) searchParams.append('moradorId', params.moradorId);
  
  const response = await fetch(`/api/espacos/reservas?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error('Erro ao buscar reservas');
  }
  
  return response.json();
}

// Função para criar nova reserva
export async function createReserva(data: CreateReservaData): Promise<ReservaEspaco> {
  const response = await fetch('/api/espacos/reservas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erro ao criar reserva');
  }
  
  return response.json();
}

// Função para atualizar status da reserva
export async function updateReservaStatus(
  id: string, 
  status: StatusReserva, 
  aprovadoPor?: string,
  motivoCancelamento?: string
): Promise<ReservaEspaco> {
  const response = await fetch(`/api/espacos/reservas/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status, aprovadoPor, motivoCancelamento }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erro ao atualizar reserva');
  }
  
  return response.json();
}

// Função para verificar disponibilidade
export async function verificarDisponibilidade(
  espacoId: string,
  dataReserva: Date,
  horaInicio: string,
  horaFim: string
): Promise<boolean> {
  const params = new URLSearchParams({
    espacoId,
    dataReserva: dataReserva.toISOString(),
    horaInicio,
    horaFim,
  });
  
  const response = await fetch(`/api/espacos/disponibilidade?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Erro ao verificar disponibilidade');
  }
  
  const data = await response.json();
  return data.disponivel;
}

// Função para calcular valor da reserva
export async function calcularValorReserva(
  espacoId: string,
  horaInicio: string,
  horaFim: string,
  servicosExtras?: string[]
): Promise<number> {
  const response = await fetch('/api/espacos/calcular-valor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      espacoId,
      horaInicio,
      horaFim,
      servicosExtras,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Erro ao calcular valor');
  }
  
  const data = await response.json();
  return data.valor;
}
