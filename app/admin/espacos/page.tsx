'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, MapPin, Users, Clock, DollarSign, ChefHat, Music, Camera, Utensils } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import React from 'react';

type StatusReserva = 'PENDENTE' | 'APROVADA' | 'REJEITADA' | 'CANCELADA' | 'REALIZADA';

interface EspacoComum {
  id: string;
  nome: string;
  descricao?: string;
  capacidade?: number;
  preco?: number;
  tempoMinimo?: number;
  tempoMaximo?: number;
  ativo: boolean;
  equipamentos: string[];
  regras: string[];
  imagens: string[];
}

interface ReservaEspaco {
  id: string;
  espacoId: string;
  espaco: EspacoComum;
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
  createdAt: Date;
}

export default function AgendaEspacosPage() {
  const [activeTab, setActiveTab] = useState<'espacos' | 'reservar' | 'minhas'>('espacos');
  const [espacos] = useState<EspacoComum[]>([
    {
      id: '1',
      nome: 'Churrasco Gourmet',
      descricao: 'Área de churrasco completa com forno a lenha, churrasqueira profissional e mesa para 20 pessoas.',
      capacidade: 20,
      preco: 200, // Valor fixo por dia
      tempoMinimo: 4,
      tempoMaximo: 8,
      ativo: true,
      equipamentos: ['Churrasqueira', 'Forno a lenha', 'Mesa grande', 'Bancos', 'Pia', 'Geladeira'],
      regras: ['Limpeza obrigatória após uso', 'Não ultrapassar horário', 'Máximo 20 pessoas'],
      imagens: ['/images/churrasco1.jpg', '/images/churrasco2.jpg']
    },
    {
      id: '2',
      nome: 'Salão de Festas',
      descricao: 'Salão climatizado para eventos com som ambiente, iluminação especial e cozinha americana.',
      capacidade: 50,
      preco: 150, // Valor fixo por dia
      tempoMinimo: 4,
      tempoMaximo: 12,
      ativo: true,
      equipamentos: ['Som ambiente', 'Iluminação LED', 'Cozinha americana', 'Mesas', 'Cadeiras', 'Ar condicionado'],
      regras: ['Som até 22h', 'Limpeza obrigatória', 'Não permitido bebidas alcoólicas em excesso'],
      imagens: ['/images/salao1.jpg', '/images/salao2.jpg']
    }
  ]);
  
  const [reservas, setReservas] = useState<ReservaEspaco[]>([]);
  const [loading, setLoading] = useState(false);
  const [espacoSelecionado, setEspacoSelecionado] = useState<string>('');
  
  // Form state
  const [formData, setFormData] = useState({
    espacoId: '',
    dataReserva: new Date(),
    horaInicio: '',
    horaFim: '',
    observacoes: '',
    convidados: 1,
    telefoneContato: '',
    eventoPrincipal: '',
    equipamentos: [] as string[],
    servicosExtras: [] as string[],
  });

  const tiposEvento = [
    'Aniversário',
    'Casamento',
    'Formatura',
    'Confraternização',
    'Reunião Familiar',
    'Chá de Bebê',
    'Chá de Panela',
    'Outro'
  ];

  const servicosExtras = [
    'Decoração básica',
    'Serviço de limpeza extra',
    'Garçom',
    'DJ/Som profissional',
    'Fotógrafo',
    'Buffet'
  ];

  const statusColors = {
    PENDENTE: 'bg-yellow-500',
    APROVADA: 'bg-green-500',
    REJEITADA: 'bg-red-500',
    CANCELADA: 'bg-red-400',
    REALIZADA: 'bg-blue-500',
  };

  const getIconForEspaco = (nome: string) => {
    if (nome.toLowerCase().includes('churrasco')) return ChefHat;
    if (nome.toLowerCase().includes('salão')) return Music;
    return MapPin;
  };

  const calcularValorTotal = (espacoId: string, horaInicio: string, horaFim: string, servicosExtras: string[]) => {
    const espaco = espacos.find(e => e.id === espacoId);
    if (!espaco || !horaInicio || !horaFim) return 0;

    const inicio = parseInt(horaInicio.split(':')[0]);
    const fim = parseInt(horaFim.split(':')[0]);
    const horas = fim - inicio;
    
    // Valor fixo por dia
    const valorBase = espaco.preco || 0;
    const valorServicos = servicosExtras.length * 50; // R$ 50 por serviço extra
    
    return valorBase + valorServicos;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const valorTotal = calcularValorTotal(formData.espacoId, formData.horaInicio, formData.horaFim, formData.servicosExtras);
      
      const novaReserva: ReservaEspaco = {
        id: Date.now().toString(),
        espacoId: formData.espacoId,
        espaco: espacos.find(e => e.id === formData.espacoId)!,
        dataReserva: formData.dataReserva,
        horaInicio: formData.horaInicio,
        horaFim: formData.horaFim,
        valorTotal,
        status: 'PENDENTE',
        observacoes: formData.observacoes,
        convidados: formData.convidados,
        telefoneContato: formData.telefoneContato,
        eventoPrincipal: formData.eventoPrincipal,
        equipamentos: formData.equipamentos,
        servicosExtras: formData.servicosExtras,
        createdAt: new Date(),
      };

      setReservas(prev => [novaReserva, ...prev]);
      
      toast.success('Reserva realizada com sucesso!');

      // Reset form
      setFormData({
        espacoId: '',
        dataReserva: new Date(),
        horaInicio: '',
        horaFim: '',
        observacoes: '',
        convidados: 1,
        telefoneContato: '',
        eventoPrincipal: '',
        equipamentos: [],
        servicosExtras: [],
      });

      setActiveTab('minhas');
    } catch (error) {
      toast.error('Erro ao fazer reserva', {
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setLoading(false);
    }
  };

  const valorEstimado = calcularValorTotal(formData.espacoId, formData.horaInicio, formData.horaFim, formData.servicosExtras);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MapPin className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Agenda de Espaços Comuns</h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('espacos')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'espacos' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
          }`}
        >
          Espaços Disponíveis
        </button>
        <button
          onClick={() => setActiveTab('reservar')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'reservar' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
          }`}
        >
          Fazer Reserva
        </button>
        <button
          onClick={() => setActiveTab('minhas')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'minhas' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
          }`}
        >
          Minhas Reservas
        </button>
      </div>

      {/* Espaços Disponíveis */}
      {activeTab === 'espacos' && (
        <div className="grid gap-6 md:grid-cols-2">
          {espacos.map((espaco) => {
            const Icon = getIconForEspaco(espaco.nome);
            return (
              <Card key={espaco.id} className="overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-6 h-6" />
                      <h3 className="text-xl font-bold">{espaco.nome}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{espaco.capacidade} pessoas</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>R$ {espaco.preco}/dia</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">{espaco.descricao}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Equipamentos Inclusos</h4>
                      <div className="flex flex-wrap gap-2">
                        {espaco.equipamentos.map((eq, index) => (
                          <Badge key={index} variant="secondary">{eq}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Regras</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {espaco.regras.map((regra, index) => (
                          <li key={index}>• {regra}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        Tempo: {espaco.tempoMinimo}h - {espaco.tempoMaximo}h
                      </div>
                      <Button 
                        onClick={() => {
                          setFormData({...formData, espacoId: espaco.id});
                          setActiveTab('reservar');
                        }}
                      >
                        Reservar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Fazer Reserva */}
      {activeTab === 'reservar' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Fazer Nova Reserva
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="espacoId">Espaço</Label>
                  <Select value={formData.espacoId} onValueChange={(value) => setFormData({...formData, espacoId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um espaço" />
                    </SelectTrigger>
                    <SelectContent>
                      {espacos.map((espaco) => (
                        <SelectItem key={espaco.id} value={espaco.id}>
                          <div className="flex items-center gap-2">
                            {React.createElement(getIconForEspaco(espaco.nome), { className: "w-4 h-4" })}
                            {espaco.nome} - R$ {espaco.preco}/dia
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Data da Reserva</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(formData.dataReserva, 'PPP', { locale: ptBR })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.dataReserva}
                        onSelect={(date) => date && setFormData({...formData, dataReserva: date})}
                        locale={ptBR}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horaInicio">Hora de Início</Label>
                  <Input
                    id="horaInicio"
                    type="time"
                    value={formData.horaInicio}
                    onChange={(e) => setFormData({...formData, horaInicio: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horaFim">Hora de Fim</Label>
                  <Input
                    id="horaFim"
                    type="time"
                    value={formData.horaFim}
                    onChange={(e) => setFormData({...formData, horaFim: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="convidados">Número de Convidados</Label>
                  <Input
                    id="convidados"
                    type="number"
                    min="1"
                    value={formData.convidados}
                    onChange={(e) => setFormData({...formData, convidados: parseInt(e.target.value)})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefoneContato">Telefone de Contato</Label>
                  <Input
                    id="telefoneContato"
                    value={formData.telefoneContato}
                    onChange={(e) => setFormData({...formData, telefoneContato: e.target.value})}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventoPrincipal">Tipo de Evento</Label>
                  <Select value={formData.eventoPrincipal} onValueChange={(value) => setFormData({...formData, eventoPrincipal: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposEvento.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Serviços Extras</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {servicosExtras.map((servico) => (
                      <div key={servico} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={servico}
                          checked={formData.servicosExtras.includes(servico)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({...formData, servicosExtras: [...formData.servicosExtras, servico]});
                            } else {
                              setFormData({...formData, servicosExtras: formData.servicosExtras.filter(s => s !== servico)});
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor={servico} className="text-sm">{servico}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                  placeholder="Informações adicionais sobre o evento..."
                  rows={3}
                />
              </div>

              {valorEstimado > 0 && (
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Valor Estimado:</span>
                    <span className="text-lg font-bold text-green-600">R$ {valorEstimado.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    *Valor sujeito à aprovação da administração
                  </p>
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {loading ? 'Enviando...' : 'Solicitar Reserva'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Minhas Reservas */}
      {activeTab === 'minhas' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Minhas Reservas</h2>
            <Badge variant="secondary">{reservas.length} reservas</Badge>
          </div>

          <div className="grid gap-4">
            {reservas.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma reserva encontrada</h3>
                  <p className="text-muted-foreground mb-4">
                    Faça sua primeira reserva de espaço comum.
                  </p>
                  <Button onClick={() => setActiveTab('reservar')}>
                    Fazer Primeira Reserva
                  </Button>
                </CardContent>
              </Card>
            ) : (
              reservas.map((reserva) => {
                const Icon = getIconForEspaco(reserva.espaco.nome);
                return (
                  <Card key={reserva.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="w-8 h-8 text-muted-foreground" />
                          <div>
                            <h3 className="font-medium">{reserva.espaco.nome}</h3>
                            <p className="text-sm text-muted-foreground">
                              {format(reserva.dataReserva, 'dd/MM/yyyy')} • {reserva.horaInicio} às {reserva.horaFim}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {reserva.eventoPrincipal} • {reserva.convidados} convidados
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-medium">R$ {reserva.valorTotal?.toFixed(2)}</p>
                            <Badge className={statusColors[reserva.status]}>
                              {reserva.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {reserva.servicosExtras.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm font-medium mb-2">Serviços Extras:</p>
                          <div className="flex flex-wrap gap-1">
                            {reserva.servicosExtras.map((servico, index) => (
                              <Badge key={index} variant="outline">{servico}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
