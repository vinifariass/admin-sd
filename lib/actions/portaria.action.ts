export type TipoAcesso = 'VISITANTE' | 'PRESTADOR_SERVICO' | 'DELIVERY' | 'MORADOR' | 'FUNCIONARIO';
export type StatusAcesso = 'AGENDADO' | 'APROVADO' | 'NEGADO' | 'EXPIRADO' | 'UTILIZADO' | 'CANCELADO';

export interface AcessoPortaria {
  id: string;
  tipo: TipoAcesso;
  nomeVisitante?: string;
  cpfVisitante?: string;
  telefone?: string;
  apartamento: string;
  moradorId?: string;
  dataVisita: Date;
  horaInicio: string;
  horaFim?: string;
  observacoes?: string;
  status: StatusAcesso;
  qrCode?: string;
  codigoAcesso?: string;
  liberadoPor?: string;
  dataLiberacao?: Date;
  entradaEfetuada: boolean;
  horaEntrada?: Date;
  validoAte?: Date;
  createdAt: Date;
  updatedAt: Date;
  morador?: {
    nome: string;
    apartamento: string;
    telefone?: string;
  };
}

export interface CreateAcessoData {
  tipo: TipoAcesso;
  nomeVisitante?: string;
  cpfVisitante?: string;
  telefone?: string;
  apartamento: string;
  moradorId?: string;
  dataVisita: Date;
  horaInicio: string;
  horaFim?: string;
  observacoes?: string;
  validoAte?: Date;
}

export interface UpdateAcessoData {
  status?: StatusAcesso;
  observacoes?: string;
  liberadoPor?: string;
}

export interface GetAcessosParams {
  page?: number;
  limit?: number;
  status?: StatusAcesso;
  apartamento?: string;
}

export interface AcessosResponse {
  acessos: AcessoPortaria[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Função para buscar acessos
export async function getAcessos(params: GetAcessosParams = {}): Promise<AcessosResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.status) searchParams.append('status', params.status);
  if (params.apartamento) searchParams.append('apartamento', params.apartamento);
  
  const response = await fetch(`/api/portaria?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error('Erro ao buscar acessos');
  }
  
  return response.json();
}

// Função para criar novo acesso
export async function createAcesso(data: CreateAcessoData): Promise<AcessoPortaria> {
  const response = await fetch('/api/portaria', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erro ao criar acesso');
  }
  
  return response.json();
}

// Função para buscar acesso por ID
export async function getAcessoById(id: string): Promise<AcessoPortaria> {
  const response = await fetch(`/api/portaria/${id}`);
  
  if (!response.ok) {
    throw new Error('Erro ao buscar acesso');
  }
  
  return response.json();
}

// Função para atualizar acesso
export async function updateAcesso(id: string, data: UpdateAcessoData): Promise<AcessoPortaria> {
  const response = await fetch(`/api/portaria/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erro ao atualizar acesso');
  }
  
  return response.json();
}

// Função para deletar acesso
export async function deleteAcesso(id: string): Promise<void> {
  const response = await fetch(`/api/portaria/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erro ao deletar acesso');
  }
}

// Função para verificar QR Code
export async function verificarQRCode(codigoAcesso: string): Promise<AcessoPortaria | null> {
  try {
    const response = await fetch(`/api/portaria/verificar-qr?codigo=${codigoAcesso}`);
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error('Erro ao verificar QR Code');
    }
    
    return response.json();
  } catch (error) {
    console.error('Erro ao verificar QR Code:', error);
    return null;
  }
}

// Função para registrar entrada
export async function registrarEntrada(id: string): Promise<AcessoPortaria> {
  const response = await fetch(`/api/portaria/${id}/entrada`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erro ao registrar entrada');
  }
  
  return response.json();
}
