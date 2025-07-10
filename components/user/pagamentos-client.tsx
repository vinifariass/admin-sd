'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, Clock, DollarSign, Calendar, FileText, Receipt } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import { getPagamentosByMorador, marcarPagoPagamento } from '@/lib/actions/pagamento.action';
import PagamentoForm from '@/components/user/pagamento-form';

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

interface PagamentosClientProps {
  moradorId: string;
  userName: string;
}

export default function PagamentosClient({ moradorId, userName }: PagamentosClientProps) {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroAno, setFiltroAno] = useState<string>(new Date().getFullYear().toString());
  const [filtroMes, setFiltroMes] = useState<string>('all');

  useEffect(() => {
    if (moradorId) {
      carregarPagamentos();
    }
  }, [moradorId, filtroAno, filtroMes]);

  const carregarPagamentos = async () => {
    if (!moradorId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const result = await getPagamentosByMorador(moradorId);
      
      let pagamentosFiltrados = result.data || [];
      
      // Aplicar filtros
      if (filtroAno !== 'all') {
        pagamentosFiltrados = pagamentosFiltrados.filter(p => p.anoReferencia === parseInt(filtroAno));
      }
      
      if (filtroMes !== 'all') {
        pagamentosFiltrados = pagamentosFiltrados.filter(p => p.mesReferencia === parseInt(filtroMes));
      }
      
      setPagamentos(pagamentosFiltrados);
    } catch (error) {
      toast.error('Erro ao carregar pagamentos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const marcarComoPago = async (pagamentoId: string, pago: boolean) => {
    try {
      const result = await marcarPagoPagamento({
        id: pagamentoId,
        pago,
        dataPagamento: pago ? new Date() : undefined
      });

      if (result.success) {
        toast.success(result.message);
        carregarPagamentos();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Erro ao atualizar pagamento');
    }
  };

  const pagamentosPorMes = pagamentos.reduce((acc, pagamento) => {
    const chave = `${pagamento.anoReferencia}-${pagamento.mesReferencia}`;
    if (!acc[chave]) {
      acc[chave] = [];
    }
    acc[chave].push(pagamento);
    return acc;
  }, {} as Record<string, Pagamento[]>);

  const calcularEstatisticas = () => {
    const total = pagamentos.length;
    const pagos = pagamentos.filter(p => p.pago).length;
    const vencidos = pagamentos.filter(p => !p.pago && new Date(p.dataVencimento) < new Date()).length;
    const valorTotal = pagamentos.reduce((acc, p) => acc + p.valor, 0);
    const valorPago = pagamentos.filter(p => p.pago).reduce((acc, p) => acc + p.valor, 0);

    return { total, pagos, vencidos, pendentes: total - pagos, valorTotal, valorPago, valorPendente: valorTotal - valorPago };
  };

  const estatisticas = calcularEstatisticas();
  const anos = Array.from(new Set(pagamentos.map(p => p.anoReferencia))).sort((a, b) => b - a);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meus Pagamentos</h1>
          <p className="text-muted-foreground">Acompanhe e gerencie seus pagamentos mensais</p>
        </div>
        <div className="flex items-center gap-4">
          <PagamentoForm 
            moradorId={moradorId} 
            onSuccess={carregarPagamentos}
          />
          <Select value={filtroAno} onValueChange={setFiltroAno}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {anos.map(ano => (
                <SelectItem key={ano} value={ano.toString()}>{ano}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filtroMes} onValueChange={setFiltroMes}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {mesesNomes.map((mes, index) => (
                <SelectItem key={index + 1} value={(index + 1).toString()}>{mes}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pagamentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos em Dia</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{estatisticas.pagos}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos Vencidos</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{estatisticas.vencidos}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Pendente</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(estatisticas.valorPendente)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Pagamentos por Mês */}
      <div className="space-y-6">
        {Object.entries(pagamentosPorMes)
          .sort((a, b) => b[0].localeCompare(a[0]))
          .map(([chave, pagamentosMes]) => {
            const [ano, mes] = chave.split('-');
            const mesNome = mesesNomes[parseInt(mes) - 1];
            
            return (
              <Card key={chave}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {mesNome} {ano}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {pagamentosMes.map((pagamento) => {
                      const isVencido = !pagamento.pago && new Date(pagamento.dataVencimento) < new Date();
                      
                      return (
                        <Card key={pagamento.id} className={`${isVencido ? 'border-red-200' : ''}`}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <Badge 
                                className={`${tiposCores[pagamento.tipo as keyof typeof tiposCores]} text-white`}
                              >
                                {tiposNomes[pagamento.tipo as keyof typeof tiposNomes]}
                              </Badge>
                              <div className="flex items-center gap-2">
                                {pagamento.pago ? (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : isVencido ? (
                                  <XCircle className="h-5 w-5 text-red-600" />
                                ) : (
                                  <Clock className="h-5 w-5 text-yellow-600" />
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <p className="font-medium">{pagamento.descricao}</p>
                              <p className="text-lg font-bold">{formatCurrency(pagamento.valor)}</p>
                              <p className="text-sm text-muted-foreground">
                                Vencimento: {formatDate(pagamento.dataVencimento)}
                              </p>
                              {pagamento.pago && pagamento.dataPagamento && (
                                <p className="text-sm text-green-600">
                                  Pago em: {formatDate(pagamento.dataPagamento)}
                                </p>
                              )}
                              
                              <div className="pt-2">
                                {pagamento.pago ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => marcarComoPago(pagamento.id, false)}
                                    className="w-full"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Marcar como Não Pago
                                  </Button>
                                ) : (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => marcarComoPago(pagamento.id, true)}
                                    className="w-full"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Marcar como Pago
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {pagamentos.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Receipt className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhum pagamento encontrado</h3>
            <p className="text-muted-foreground">
              Não há pagamentos cadastrados para os filtros selecionados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
