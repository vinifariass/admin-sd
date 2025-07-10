import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
// Update the import path below if the file is named differently or located elsewhere
import PagamentosClient from "@/components/user/pagamentos-client";

export const metadata: Metadata = {
  title: 'Meus Pagamentos - Admin SD',
  description: 'Acompanhe e gerencie seus pagamentos mensais',
};

interface Pagamento {
  id: string;
  tipo: string;
  descricao: string;
  valor: number;
  mesReferencia: number;
  anoReferencia: number;
  dataVencimento: string | Date;
  pago: boolean;
  dataPagamento?: string | Date | null;
  comprovante?: string | null;
  observacoes?: string | null;
}

interface PageProps {
  // Removendo dependência de parâmetros
}

const mesesNomes = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const tiposNomes = {
  ALUGUEL: 'Aluguel',
  CONDOMINIO: 'Condomínio',
  GAS: 'Gás',
  LUZ: 'Luz',
  AGUA: 'Água',
  INTERNET: 'Internet',
  OUTROS: 'Outros'
};

const tiposCores = {
  ALUGUEL: 'bg-blue-500',
  CONDOMINIO: 'bg-purple-500',
  GAS: 'bg-orange-500',
  LUZ: 'bg-yellow-500',
  AGUA: 'bg-cyan-500',
  INTERNET: 'bg-green-500',
  OUTROS: 'bg-gray-500'
};

const formatDate = (dateString: string | Date | null | undefined) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('pt-BR');
};

export default async function PagamentosPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  return <PagamentosClient moradorId={session.user.id} userName={session.user.name || 'Usuário'} />;
}
