'use client'

import { useState, useEffect } from "react";
import { Bell, X, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { 
    countNotificacaoesNaoLidas, 
    getNotificacoesRecentes, 
    marcarComoLida, 
    marcarTodasComoLidas 
} from "@/lib/actions/notificacao.action";

interface NotificacaoSino {
    id: string;
    titulo: string;
    mensagem: string;
    tipo: string;
    lida: boolean;
    createdAt: Date;
}

interface NotificationBellProps {
    userId: string;
}

export default function NotificationBell({ userId }: NotificationBellProps) {
    const [notificacoes, setNotificacoes] = useState<NotificacaoSino[]>([]);
    const [naoLidas, setNaoLidas] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Carregar notificações
    const carregarNotificacoes = async () => {
        try {
            const [recentes, count] = await Promise.all([
                getNotificacoesRecentes(userId),
                countNotificacaoesNaoLidas(userId)
            ]);
            
            setNotificacoes(recentes);
            setNaoLidas(count);
        } catch (error) {
            console.error('Erro ao carregar notificações:', error);
        }
    };

    // Carregar notificações quando o componente montar
    useEffect(() => {
        carregarNotificacoes();
        
        // Atualizar a cada 10 segundos para notificações em tempo real
        const interval = setInterval(carregarNotificacoes, 10000);
        
        // Ouvir evento de nova notificação
        const handleNovaNotificacao = () => {
            carregarNotificacoes();
        };
        
        window.addEventListener('notificacao-enviada', handleNovaNotificacao);
        
        return () => {
            clearInterval(interval);
            window.removeEventListener('notificacao-enviada', handleNovaNotificacao);
        };
    }, [userId]);

    // Marcar notificação como lida
    const handleMarcarLida = async (id: string) => {
        try {
            setIsLoading(true);
            const result = await marcarComoLida(id);
            
            if (result.success) {
                setNotificacoes(prev => 
                    prev.map(notif => 
                        notif.id === id ? { ...notif, lida: true } : notif
                    )
                );
                setNaoLidas(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            toast.error("Erro ao marcar como lida");
        } finally {
            setIsLoading(false);
        }
    };

    // Marcar todas como lidas
    const handleMarcarTodasLidas = async () => {
        try {
            setIsLoading(true);
            const result = await marcarTodasComoLidas(userId);
            
            if (result.success) {
                setNotificacoes(prev => 
                    prev.map(notif => ({ ...notif, lida: true }))
                );
                setNaoLidas(0);
                toast.success("Todas as notificações foram marcadas como lidas");
            }
        } catch (error) {
            toast.error("Erro ao marcar todas como lidas");
        } finally {
            setIsLoading(false);
        }
    };

    // Função para obter a cor do tipo de notificação
    const getTipoColor = (tipo: string) => {
        switch (tipo) {
            case 'URGENTE':
                return 'text-red-600 dark:text-red-400';
            case 'AVISO':
                return 'text-yellow-600 dark:text-yellow-400';
            case 'INFO':
            default:
                return 'text-blue-600 dark:text-blue-400';
        }
    };

    // Função para obter o ícone do tipo
    const getTipoIcon = (tipo: string) => {
        switch (tipo) {
            case 'URGENTE':
                return '🚨';
            case 'AVISO':
                return '⚠️';
            case 'INFO':
            default:
                return 'ℹ️';
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="relative p-2 h-10 w-10"
                >
                    <Bell className="h-5 w-5" />
                    {naoLidas > 0 && (
                        <Badge 
                            variant="destructive" 
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-[20px]"
                        >
                            {naoLidas > 99 ? '99+' : naoLidas}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Notificações</CardTitle>
                            <div className="flex items-center gap-2">
                                {naoLidas > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleMarcarTodasLidas}
                                        disabled={isLoading}
                                        className="h-8 px-2 text-xs"
                                    >
                                        <CheckCheck className="h-4 w-4 mr-1" />
                                        Marcar todas
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsOpen(false)}
                                    className="h-8 w-8 p-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        {naoLidas > 0 ? (
                            <p className="text-sm text-muted-foreground">
                                {naoLidas} não lida{naoLidas > 1 ? 's' : ''}
                            </p>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Todas as notificações foram lidas
                            </p>
                        )}
                    </CardHeader>
                    <CardContent className="p-0">
                        <ScrollArea className="h-[400px]">
                            {notificacoes.length === 0 ? (
                                <div className="p-6 text-center text-muted-foreground">
                                    <Bell className="h-16 w-16 mx-auto mb-3 opacity-30" />
                                    <p className="font-medium">Não há notificações</p>
                                    <p className="text-sm mt-1">Você está em dia com todas as suas notificações!</p>
                                </div>
                            ) : (
                                <div className="space-y-0">
                                    {notificacoes.map((notificacao, index) => (
                                        <div key={notificacao.id}>
                                            <div
                                                className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                                                    !notificacao.lida ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                                                }`}
                                                onClick={() => {
                                                    if (!notificacao.lida) {
                                                        handleMarcarLida(notificacao.id);
                                                    }
                                                }}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 mt-1">
                                                        <span className="text-lg">
                                                            {getTipoIcon(notificacao.tipo)}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className={`font-medium text-sm truncate ${
                                                                !notificacao.lida ? 'text-foreground' : 'text-muted-foreground'
                                                            }`}>
                                                                {notificacao.titulo}
                                                            </p>
                                                            <div className="flex items-center gap-2">
                                                                {!notificacao.lida && (
                                                                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                                                )}
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleMarcarLida(notificacao.id);
                                                                    }}
                                                                    disabled={notificacao.lida || isLoading}
                                                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <Check className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                            {notificacao.mensagem}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mt-2">
                                                            {formatDistanceToNow(new Date(notificacao.createdAt), {
                                                                addSuffix: true,
                                                                locale: ptBR
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            {index < notificacoes.length - 1 && <Separator />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                        {notificacoes.length > 0 && (
                            <>
                                <Separator />
                                <div className="p-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-center text-xs"
                                        onClick={() => {
                                            setIsOpen(false);
                                            // Aqui você pode redirecionar para uma página de notificações completa
                                        }}
                                    >
                                        Ver todas as notificações
                                    </Button>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </PopoverContent>
        </Popover>
    );
}
