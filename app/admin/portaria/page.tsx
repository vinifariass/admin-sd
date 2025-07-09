'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, QrCode, Shield, Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type TipoAcesso = 'VISITANTE' | 'PRESTADOR_SERVICO' | 'DELIVERY' | 'MORADOR' | 'FUNCIONARIO';
type StatusAcesso = 'AGENDADO' | 'APROVADO' | 'NEGADO' | 'EXPIRADO' | 'UTILIZADO' | 'CANCELADO';

interface AcessoPortaria {
    id: string;
    tipo: TipoAcesso;
    nomeVisitante?: string;
    cpfVisitante?: string;
    telefone?: string;
    apartamento: string;
    dataVisita: Date;
    horaInicio: string;
    horaFim?: string;
    observacoes?: string;
    status: StatusAcesso;
    qrCode?: string;
    codigoAcesso?: string;
    validoAte?: Date;
    createdAt: Date;
}

export default function PortariaDigitalPage() {
    const [activeTab, setActiveTab] = useState<'novo' | 'lista' | 'qr'>('novo');
    const [acessos, setAcessos] = useState<AcessoPortaria[]>([]);
    const [loading, setLoading] = useState(false);
    const [qrCodeModal, setQrCodeModal] = useState<{ open: boolean; acesso: AcessoPortaria | null }>({
        open: false,
        acesso: null
    });

    // Form state
    const [formData, setFormData] = useState({
        tipo: 'VISITANTE' as TipoAcesso,
        nomeVisitante: '',
        cpfVisitante: '',
        telefone: '',
        apartamento: '',
        dataVisita: new Date(),
        horaInicio: '',
        horaFim: '',
        observacoes: '',
    });

    const tiposAcesso = [
        { value: 'VISITANTE', label: 'Visitante', icon: Users, color: 'bg-blue-500' },
        { value: 'PRESTADOR_SERVICO', label: 'Prestador de Serviço', icon: Shield, color: 'bg-green-500' },
        { value: 'DELIVERY', label: 'Delivery', icon: Clock, color: 'bg-orange-500' },
        { value: 'FUNCIONARIO', label: 'Funcionário', icon: Shield, color: 'bg-purple-500' },
    ];

    const statusColors = {
        AGENDADO: 'bg-yellow-500',
        APROVADO: 'bg-green-500',
        NEGADO: 'bg-red-500',
        EXPIRADO: 'bg-gray-500',
        UTILIZADO: 'bg-blue-500',
        CANCELADO: 'bg-red-400',
    };

    // Buscar acessos quando a página carregar
    useEffect(() => {
        const fetchAcessos = async () => {
            try {
                const response = await fetch('/api/portaria');
                if (response.ok) {
                    const data = await response.json();
                    setAcessos(data.acessos || []);
                }
            } catch (error) {
                console.error('Erro ao buscar acessos:', error);
            }
        };

        fetchAcessos();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/portaria', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Erro ao criar acesso');

            const novoAcesso = await response.json();
            setAcessos(prev => [novoAcesso, ...prev]);

            toast.success('Acesso criado com sucesso!');

            // Abrir modal com QR Code
            setQrCodeModal({ open: true, acesso: novoAcesso });

            // Reset form
            setFormData({
                tipo: 'VISITANTE',
                nomeVisitante: '',
                cpfVisitante: '',
                telefone: '',
                apartamento: '',
                dataVisita: new Date(),
                horaInicio: '',
                horaFim: '',
                observacoes: '',
            });

            setActiveTab('lista');
        } catch (error) {
            toast.error('Erro ao criar acesso', {
                description: error instanceof Error ? error.message : 'Erro desconhecido',
            });
        } finally {
            setLoading(false);
        }
    };

    const gerarQRCode = (acesso: AcessoPortaria) => {
        const qrData = {
            id: acesso.id,
            tipo: acesso.tipo,
            nome: acesso.nomeVisitante,
            apartamento: acesso.apartamento,
            data: acesso.dataVisita,
            codigo: acesso.codigoAcesso,
        };

        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(qrData))}`;
    };

    const renderQrCodeModal = () => (
        <Dialog open={qrCodeModal.open} onOpenChange={(open) => setQrCodeModal({ open, acesso: null })}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>QR Code de Acesso</DialogTitle>
                </DialogHeader>
                {qrCodeModal.acesso && (
                    <div className="space-y-4">
                        <div className="text-center">
                            <div className="mb-4 p-4 bg-white rounded-lg inline-block">
                                <img
                                    src={qrCodeModal.acesso.qrCode}
                                    alt="QR Code"
                                    className="w-48 h-48 mx-auto"
                                />
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                                Código: <span className="font-mono font-bold">{qrCodeModal.acesso.codigoAcesso}</span>
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                                Visitante: <span className="font-semibold">{qrCodeModal.acesso.nomeVisitante}</span>
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                                Apartamento: <span className="font-semibold">{qrCodeModal.acesso.apartamento}</span>
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                                Data: <span className="font-semibold">{new Date(qrCodeModal.acesso.dataVisita).toLocaleDateString('pt-BR')}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                                Horário: <span className="font-semibold">{qrCodeModal.acesso.horaInicio} - {qrCodeModal.acesso.horaFim}</span>
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => window.print()}
                                variant="outline"
                                className="flex-1"
                            >
                                Imprimir
                            </Button>
                            <Button
                                onClick={() => {
                                    if (qrCodeModal.acesso?.codigoAcesso) {
                                        navigator.clipboard.writeText(qrCodeModal.acesso.codigoAcesso);
                                        toast.success('Código copiado!');
                                    }
                                }}
                                variant="outline"
                                className="flex-1"
                            >
                                Copiar Código
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Shield className="w-6 h-6" />
                <h1 className="text-2xl font-bold">Portaria Digital</h1>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
                <button
                    onClick={() => setActiveTab('novo')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'novo' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                        }`}
                >
                    Novo Acesso
                </button>
                <button
                    onClick={() => setActiveTab('lista')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'lista' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                        }`}
                >
                    Lista de Acessos
                </button>
                <button
                    onClick={() => setActiveTab('qr')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'qr' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                        }`}
                >
                    Scanner QR
                </button>
            </div>

            {/* Novo Acesso */}
            {activeTab === 'novo' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Criar Novo Acesso
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tipo">Tipo de Acesso</Label>
                                    <Select value={formData.tipo} onValueChange={(value: TipoAcesso) => setFormData({ ...formData, tipo: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tiposAcesso.map((tipo) => (
                                                <SelectItem key={tipo.value} value={tipo.value}>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-3 h-3 rounded-full ${tipo.color}`} />
                                                        {tipo.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="apartamento">Apartamento</Label>
                                    <Input
                                        id="apartamento"
                                        value={formData.apartamento}
                                        onChange={(e) => setFormData({ ...formData, apartamento: e.target.value })}
                                        placeholder="Ex: 101, 1502"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nomeVisitante">Nome do Visitante</Label>
                                    <Input
                                        id="nomeVisitante"
                                        value={formData.nomeVisitante}
                                        onChange={(e) => setFormData({ ...formData, nomeVisitante: e.target.value })}
                                        placeholder="Nome completo"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cpfVisitante">CPF</Label>
                                    <Input
                                        id="cpfVisitante"
                                        value={formData.cpfVisitante}
                                        onChange={(e) => setFormData({ ...formData, cpfVisitante: e.target.value })}
                                        placeholder="000.000.000-00"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="telefone">Telefone</Label>
                                    <Input
                                        id="telefone"
                                        value={formData.telefone}
                                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                        placeholder="(11) 99999-9999"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Data da Visita</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start text-left">
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {format(formData.dataVisita, 'PPP', { locale: ptBR })}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={formData.dataVisita}
                                                onSelect={(date) => date && setFormData({ ...formData, dataVisita: date })}
                                                locale={ptBR}
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
                                        onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="horaFim">Hora de Fim (opcional)</Label>
                                    <Input
                                        id="horaFim"
                                        type="time"
                                        value={formData.horaFim}
                                        onChange={(e) => setFormData({ ...formData, horaFim: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="observacoes">Observações</Label>
                                <Textarea
                                    id="observacoes"
                                    value={formData.observacoes}
                                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                                    placeholder="Informações adicionais..."
                                    rows={3}
                                />
                            </div>

                            <Button type="submit" disabled={loading} className="w-full">
                                <QrCode className="w-4 h-4 mr-2" />
                                {loading ? 'Criando...' : 'Gerar QR Code de Acesso'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Lista de Acessos */}
            {activeTab === 'lista' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Acessos Criados</h2>
                        <Badge variant="secondary">{acessos.length} acessos</Badge>
                    </div>

                    <div className="grid gap-4">
                        {acessos.length === 0 ? (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium mb-2">Nenhum acesso criado</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Crie o primeiro acesso para visitantes do condomínio.
                                    </p>
                                    <Button onClick={() => setActiveTab('novo')}>
                                        Criar Primeiro Acesso
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            acessos.map((acesso) => (
                                <Card key={acesso.id}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${statusColors[acesso.status]}`} />
                                                <div>
                                                    <h3 className="font-medium">{acesso.nomeVisitante}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {acesso.apartamento} • {acesso.dataVisita ? format(new Date(acesso.dataVisita), 'dd/MM/yyyy') : 'Data inválida'} às {acesso.horaInicio}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary">{acesso.tipo.replace('_', ' ')}</Badge>
                                                <Badge className={statusColors[acesso.status]}>
                                                    {acesso.status}
                                                </Badge>

                                                {acesso.qrCode && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setQrCodeModal({ open: true, acesso })}
                                                    >
                                                        <QrCode className="w-4 h-4 mr-2" />
                                                        Ver QR
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            )}


            {/* Scanner QR */}
            {activeTab === 'qr' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <QrCode className="w-5 h-5" />
                            Scanner de QR Code
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-12">
                        <QrCode className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">Scanner QR Code</h3>
                        <p className="text-muted-foreground mb-6">
                            Funcionalidade para porteiros escanearem QR codes de visitantes.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Validação automática</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-yellow-500" />
                                <span>Verificação de horário</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <XCircle className="w-4 h-4 text-red-500" />
                                <span>Bloqueio por expiração</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* QR Code Modal */}
            {renderQrCodeModal()}
        </div>
    );
}
