'use client'

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Send, Users, X, Bell, AlertTriangle, Info } from "lucide-react";
import { toast } from "sonner";
import { getAllMoradores } from "@/lib/actions/morador.action";
import { enviarNotificacao } from "@/lib/actions/notificacao.action";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Morador {
    id: string;
    nome: string;
    apartamento: string;
    email?: string;
}

interface EnviarNotificacaoProps {
    remetente: string;
    remetenteNome: string;
}

export default function EnviarNotificacao({ remetente, remetenteNome }: EnviarNotificacaoProps) {
    const [moradores, setMoradores] = useState<Morador[]>([]);
    const [selectedMoradores, setSelectedMoradores] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        titulo: '',
        mensagem: '',
        tipo: 'INFO' as 'INFO' | 'AVISO' | 'URGENTE'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showMoradores, setShowMoradores] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Carregar moradores
    useEffect(() => {
        carregarMoradores();
    }, []);

    const carregarMoradores = async () => {
        try {
            const result = await getAllMoradores();
            setMoradores(result || []);
        } catch (error) {
            console.error('Erro ao carregar moradores:', error);
            toast.error('Erro ao carregar moradores');
        }
    };

    // Filtrar moradores por busca
    const moradoresFiltrados = moradores.filter(morador =>
        morador.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        morador.apartamento.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Selecionar/deselecionar morador
    const toggleMorador = (moradorId: string) => {
        setSelectedMoradores(prev => 
            prev.includes(moradorId) 
                ? prev.filter(id => id !== moradorId)
                : [...prev, moradorId]
        );
    };

    // Selecionar todos os moradores
    const selecionarTodos = () => {
        if (selectedMoradores.length === moradores.length) {
            setSelectedMoradores([]);
        } else {
            setSelectedMoradores(moradores.map(m => m.id));
        }
    };

    // Remover morador selecionado
    const removerMorador = (moradorId: string) => {
        setSelectedMoradores(prev => prev.filter(id => id !== moradorId));
    };

    // Enviar notificação
    const handleEnviar = async () => {
        if (!formData.titulo.trim()) {
            toast.error('Título é obrigatório');
            return;
        }

        if (!formData.mensagem.trim()) {
            toast.error('Mensagem é obrigatória');
            return;
        }

        if (selectedMoradores.length === 0) {
            toast.error('Selecione pelo menos um destinatário');
            return;
        }

        setIsLoading(true);

        try {
            const result = await enviarNotificacao({
                titulo: formData.titulo,
                mensagem: formData.mensagem,
                tipo: formData.tipo,
                destinatarios: selectedMoradores
            }, remetente);

            if (result.success) {
                toast.success(result.message);
                // Limpar formulário
                setFormData({ titulo: '', mensagem: '', tipo: 'INFO' });
                setSelectedMoradores([]);
                setShowMoradores(false);
                
                // Forçar atualização das notificações em toda a aplicação
                window.dispatchEvent(new CustomEvent('notificacao-enviada'));
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Erro ao enviar notificação');
        } finally {
            setIsLoading(false);
        }
    };

    // Obter ícone do tipo
    const getTipoIcon = (tipo: string) => {
        switch (tipo) {
            case 'URGENTE':
                return <AlertTriangle className="h-4 w-4 text-red-500" />;
            case 'AVISO':
                return <Bell className="h-4 w-4 text-yellow-500" />;
            case 'INFO':
            default:
                return <Info className="h-4 w-4 text-blue-500" />;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Enviar Notificação
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Título */}
                <div>
                    <Label htmlFor="titulo">Título</Label>
                    <Input
                        id="titulo"
                        placeholder="Digite o título da notificação"
                        value={formData.titulo}
                        onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                    />
                </div>

                {/* Tipo */}
                <div>
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select value={formData.tipo} onValueChange={(value: 'INFO' | 'AVISO' | 'URGENTE') => setFormData(prev => ({ ...prev, tipo: value }))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="INFO">
                                <div className="flex items-center gap-2">
                                    <Info className="h-4 w-4 text-blue-500" />
                                    Informação
                                </div>
                            </SelectItem>
                            <SelectItem value="AVISO">
                                <div className="flex items-center gap-2">
                                    <Bell className="h-4 w-4 text-yellow-500" />
                                    Aviso
                                </div>
                            </SelectItem>
                            <SelectItem value="URGENTE">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-red-500" />
                                    Urgente
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Mensagem */}
                <div>
                    <Label htmlFor="mensagem">Mensagem</Label>
                    <Textarea
                        id="mensagem"
                        placeholder="Digite a mensagem da notificação"
                        value={formData.mensagem}
                        onChange={(e) => setFormData(prev => ({ ...prev, mensagem: e.target.value }))}
                        rows={4}
                    />
                </div>

                {/* Destinatários */}
                <div>
                    <Label>Destinatários</Label>
                    <div className="space-y-3">
                        {/* Botão para mostrar/ocultar lista */}
                        <Button
                            variant="outline"
                            onClick={() => setShowMoradores(!showMoradores)}
                            className="w-full justify-between"
                        >
                            <span className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                {selectedMoradores.length > 0 
                                    ? `${selectedMoradores.length} morador(es) selecionado(s)`
                                    : 'Selecionar destinatários'
                                }
                            </span>
                            {selectedMoradores.length > 0 && (
                                <Badge variant="secondary">{selectedMoradores.length}</Badge>
                            )}
                        </Button>

                        {/* Lista de moradores selecionados */}
                        {selectedMoradores.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {selectedMoradores.map(moradorId => {
                                    const morador = moradores.find(m => m.id === moradorId);
                                    return morador ? (
                                        <Badge key={moradorId} variant="secondary" className="flex items-center gap-1">
                                            {morador.nome} ({morador.apartamento})
                                            <button
                                                onClick={() => removerMorador(moradorId)}
                                                className="ml-1 hover:text-red-500"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ) : null;
                                })}
                            </div>
                        )}

                        {/* Lista de moradores */}
                        {showMoradores && (
                            <Card className="border-2 border-dashed">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">Selecionar Moradores</h4>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={selecionarTodos}
                                        >
                                            {selectedMoradores.length === moradores.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                                        </Button>
                                    </div>
                                    <Input
                                        placeholder="Buscar morador ou apartamento..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-64">
                                        <div className="space-y-2">
                                            {moradoresFiltrados.map(morador => (
                                                <div
                                                    key={morador.id}
                                                    className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded"
                                                >
                                                    <Checkbox
                                                        id={morador.id}
                                                        checked={selectedMoradores.includes(morador.id)}
                                                        onCheckedChange={() => toggleMorador(morador.id)}
                                                    />
                                                    <label
                                                        htmlFor={morador.id}
                                                        className="flex-1 cursor-pointer"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium">{morador.nome}</span>
                                                            <Badge variant="outline">{morador.apartamento}</Badge>
                                                        </div>
                                                        {morador.email && (
                                                            <p className="text-sm text-muted-foreground">{morador.email}</p>
                                                        )}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Preview da notificação */}
                {(formData.titulo || formData.mensagem) && (
                    <div>
                        <Label>Preview</Label>
                        <Card className="border-2 border-dashed bg-muted/20">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    {getTipoIcon(formData.tipo)}
                                    <div className="flex-1">
                                        <h4 className="font-medium">{formData.titulo || 'Título'}</h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {formData.mensagem || 'Mensagem'}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            De: {remetenteNome} • Agora
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Botão de envio */}
                <Button
                    onClick={handleEnviar}
                    disabled={isLoading || !formData.titulo || !formData.mensagem || selectedMoradores.length === 0}
                    className="w-full"
                >
                    {isLoading ? (
                        <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Enviando...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" />
                            Enviar Notificação
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
