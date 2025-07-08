'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, FileText, Users, DollarSign, Package } from 'lucide-react';
import { toast } from 'sonner';

type TipoRelatorio = 'financeiro' | 'moradores' | 'encomendas' | 'boletos';

export default function RelatoriosPage() {
  const [tipoRelatorio, setTipoRelatorio] = useState<TipoRelatorio>('financeiro');
  const [ano, setAno] = useState(new Date().getFullYear().toString());
  const [mes, setMes] = useState<string>('all');
  const [gerando, setGerando] = useState(false);

  const gerarRelatorio = async () => {
    if (gerando) return; // Previne cliques múltiplos
    
    setGerando(true);
    let toastId: string | number | undefined;
    
    try {
      toastId = toast.loading('Gerando relatório PDF...', {
        description: 'Isso pode levar alguns segundos'
      });

      const response = await fetch('/api/relatorios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo: tipoRelatorio,
          ano: parseInt(ano),
          mes: mes && mes !== 'all' ? parseInt(mes) : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
        throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `relatorio-${tipoRelatorio}-${ano}${mes && mes !== 'all' ? `-${mes.padStart(2, '0')}` : ''}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Relatório gerado com sucesso!', {
        id: toastId,
        description: 'O download do PDF foi iniciado automaticamente.',
      });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório', {
        id: toastId,
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setGerando(false);
    }
  };

  const tiposRelatorio = [
    {
      value: 'financeiro' as TipoRelatorio,
      label: 'Relatório Financeiro',
      description: 'Gastos, boletos, receitas e despesas',
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      value: 'moradores' as TipoRelatorio,
      label: 'Relatório de Moradores',
      description: 'Lista completa, inadimplência e estatísticas',
      icon: Users,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      value: 'encomendas' as TipoRelatorio,
      label: 'Relatório de Encomendas',
      description: 'Entregas, assinaturas e transportadoras',
      icon: Package,
      color: 'from-purple-500 to-violet-600'
    },
    {
      value: 'boletos' as TipoRelatorio,
      label: 'Relatório de Boletos',
      description: 'Pagamentos, vencimentos e inadimplência',
      icon: FileText,
      color: 'from-orange-500 to-red-600'
    }
  ];

  const anos = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const meses = [
    { value: '1', label: 'Janeiro' },
    { value: '2', label: 'Fevereiro' },
    { value: '3', label: 'Março' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Maio' },
    { value: '6', label: 'Junho' },
    { value: '7', label: 'Julho' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Relatórios Automáticos</h1>
      </div>
      
      <div className="text-sm text-muted-foreground">
        Gere relatórios profissionais em PDF com dados completos do condomínio.
      </div>

      {/* Seleção do Tipo de Relatório */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {tiposRelatorio.map((tipo) => {
          const Icon = tipo.icon;
          return (
            <Card 
              key={tipo.value}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                tipoRelatorio === tipo.value 
                  ? `bg-gradient-to-br ${tipo.color} text-white shadow-xl` 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setTipoRelatorio(tipo.value)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${tipoRelatorio === tipo.value ? 'text-white' : 'text-muted-foreground'}`} />
                  <CardTitle className={`text-sm ${tipoRelatorio === tipo.value ? 'text-white' : ''}`}>
                    {tipo.label}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className={`text-xs ${
                  tipoRelatorio === tipo.value ? 'text-white/90' : 'text-muted-foreground'
                }`}>
                  {tipo.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Configurações do Relatório */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Configurações do Relatório
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ano</label>
              <Select value={ano} onValueChange={setAno}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  {anos.map((anoItem) => (
                    <SelectItem key={anoItem} value={anoItem.toString()}>
                      {anoItem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mês (opcional)</label>
              <Select value={mes} onValueChange={setMes}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os meses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os meses</SelectItem>
                  {meses.map((mesItem) => (
                    <SelectItem key={mesItem.value} value={mesItem.value}>
                      {mesItem.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ação</label>
              <Button 
                onClick={gerarRelatorio}
                disabled={gerando}
                className="w-full"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                {gerando ? 'Gerando...' : 'Gerar PDF'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prévia do Relatório */}
      <Card>
        <CardHeader>
          <CardTitle>Prévia do Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="mx-auto h-16 w-16 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">
              {tiposRelatorio.find(t => t.value === tipoRelatorio)?.label}
            </p>
            <p className="text-sm">
              Período: {ano}{mes && mes !== 'all' && ` - ${meses.find(m => m.value === mes)?.label}`}
            </p>
            <p className="text-xs mt-2 opacity-75">
              Clique em "Gerar PDF" para baixar o relatório completo
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
