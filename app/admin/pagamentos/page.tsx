'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Clock, DollarSign, Calendar, Plus, Filter, Users, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import { getAllPagamentos, getEstatisticasPagamentos, marcarPagoPagamento } from '@/lib/actions/pagamento.action';
import DeleteDialog from '@/components/shared/delete-dialog';
import { deletePagamento } from '@/lib/actions/pagamento.action';

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
  morador: {
    nome: string;
    apartamento: string;
    telefone?: string | null;
  };
}

interface Estatisticas {
  totalPagamentos: number;
  pagamentosPagos: number;
  pagamentosVencidos: number;
  pagamentosPendentes: number;
  taxaPagamento: number;
  valorTotal: number;
  valorRecebido: number;
  valorPendente: number;
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

export default function AdminPagamentosPage() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [estatisticas, setEstatisticas] = useState<Estatisticas>({
    totalPagamentos: 0,
    pagamentosPagos: 0,
    pagamentosVencidos: 0,
    pagamentosPendentes: 0,
    taxaPagamento: 0,
    valorTotal: 0,
    valorRecebido: 0,
    valorPendente: 0
  });
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    tipo: 'all',
    pago: 'all',
    mesReferencia: new Date().getMonth() + 1,
    anoReferencia: new Date().getFullYear()
  });

  useEffect(() => {
    carregarDados();
  }, [filtros]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Preparar filtros para a API
      const filtrosAPI: any = {
        mesReferencia: filtros.mesReferencia,
        anoReferencia: filtros.anoReferencia
      };
      
      if (filtros.tipo !== 'all') filtrosAPI.tipo = filtros.tipo;
      if (filtros.pago !== 'all') filtrosAPI.pago = filtros.pago === 'true';
      
      // Carregar pagamentos e estatísticas
      const [pagamentosResult, estatisticasResult] = await Promise.all([
        getAllPagamentos(filtrosAPI),
        getEstatisticasPagamentos(filtros.mesReferencia, filtros.anoReferencia)
      ]);
      
      setPagamentos(pagamentosResult.data || []);
      setEstatisticas(estatisticasResult);
    } catch (error) {
      toast.error('Erro ao carregar dados');
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
        carregarDados();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Erro ao atualizar pagamento');
    }
  };

  const anos = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

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
          <h1 className="text-3xl font-bold">Gestão de Pagamentos</h1>
          <p className="text-muted-foreground">Gerencie e acompanhe todos os pagamentos dos moradores</p>
        </div>
        <Button onClick={carregarDados} disabled={loading}>
          <Plus className="h-4 w-4 mr-2" />
          {loading ? 'Carregando...' : 'Atualizar Dados'}
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-sm font-medium">Mês</label>
              <Select 
                value={filtros.mesReferencia.toString()} 
                onValueChange={(value) => setFiltros({...filtros, mesReferencia: parseInt(value)})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mesesNomes.map((mes, index) => (
                    <SelectItem key={index + 1} value={(index + 1).toString()}>{mes}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Ano</label>
              <Select 
                value={filtros.anoReferencia.toString()} 
                onValueChange={(value) => setFiltros({...filtros, anoReferencia: parseInt(value)})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {anos.map(ano => (
                    <SelectItem key={ano} value={ano.toString()}>{ano}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Tipo</label>
              <Select value={filtros.tipo} onValueChange={(value) => setFiltros({...filtros, tipo: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {Object.entries(tiposNomes).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={filtros.pago} onValueChange={(value) => setFiltros({...filtros, pago: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Pagos</SelectItem>
                  <SelectItem value="false">Pendentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pagamentos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.totalPagamentos}</div>
            <p className="text-xs text-muted-foreground">
              {mesesNomes[filtros.mesReferencia - 1]} {filtros.anoReferencia}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Pagamento</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {estatisticas.taxaPagamento.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {estatisticas.pagamentosPagos} de {estatisticas.totalPagamentos} pagos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Recebido</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(estatisticas.valorRecebido)}
            </div>
            <p className="text-xs text-muted-foreground">
              de {formatCurrency(estatisticas.valorTotal)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Pendente</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(estatisticas.valorPendente)}
            </div>
            <p className="text-xs text-muted-foreground">
              {estatisticas.pagamentosVencidos} vencidos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Morador</TableHead>
                <TableHead>Apartamento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagamentos.map((pagamento) => {
                const isVencido = !pagamento.pago && new Date(pagamento.dataVencimento) < new Date();
                
                return (
                  <TableRow key={pagamento.id}>
                    <TableCell className="font-medium">{pagamento.morador.nome}</TableCell>
                    <TableCell>{pagamento.morador.apartamento}</TableCell>
                    <TableCell>
                      <Badge className={`${tiposCores[pagamento.tipo as keyof typeof tiposCores]} text-white`}>
                        {tiposNomes[pagamento.tipo as keyof typeof tiposNomes]}
                      </Badge>
                    </TableCell>
                    <TableCell>{pagamento.descricao}</TableCell>
                    <TableCell>{formatCurrency(pagamento.valor)}</TableCell>
                    <TableCell>{formatDate(pagamento.dataVencimento)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {pagamento.pago ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-green-600 text-sm">Pago</span>
                          </>
                        ) : isVencido ? (
                          <>
                            <XCircle className="h-4 w-4 text-red-600" />
                            <span className="text-red-600 text-sm">Vencido</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4 text-yellow-600" />
                            <span className="text-yellow-600 text-sm">Pendente</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {pagamento.pago ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => marcarComoPago(pagamento.id, false)}
                          >
                            Marcar como Não Pago
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => marcarComoPago(pagamento.id, true)}
                          >
                            Marcar como Pago
                          </Button>
                        )}
                        <DeleteDialog
                          id={pagamento.id}
                          action={deletePagamento}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {pagamentos.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum pagamento encontrado para os filtros selecionados.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
