import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Check, AlertTriangle, Info, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: 'Notificações - Admin SD',
    description: 'Suas notificações e atualizações do sistema',
};

export default async function UserNotificationsPage() {
    const session = await auth();
    
    if (!session?.user?.id) {
        redirect('/sign-in');
    }

    // Mock data para demonstração
    const notifications = [
        {
            id: 1,
            title: "Novo boleto disponível",
            message: "Seu boleto de condomínio para dezembro/2024 está disponível",
            type: "INFO",
            read: false,
            createdAt: "2024-12-15T10:30:00Z"
        },
        {
            id: 2,
            title: "Manutenção programada",
            message: "Haverá manutenção no elevador dia 20/12 das 8h às 12h",
            type: "AVISO",
            read: false,
            createdAt: "2024-12-14T14:20:00Z"
        },
        {
            id: 3,
            title: "Visitante autorizado",
            message: "Visitante João Silva foi autorizado para hoje às 15h",
            type: "INFO",
            read: true,
            createdAt: "2024-12-13T09:15:00Z"
        },
        {
            id: 4,
            title: "Assembleia extraordinária",
            message: "Assembleia marcada para dia 30/12 às 19h no salão de festas",
            type: "URGENTE",
            read: true,
            createdAt: "2024-12-10T16:45:00Z"
        }
    ];

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'URGENTE':
                return <AlertTriangle className="w-5 h-5 text-red-600" />;
            case 'AVISO':
                return <Zap className="w-5 h-5 text-yellow-600" />;
            case 'INFO':
            default:
                return <Info className="w-5 h-5 text-blue-600" />;
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'URGENTE':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'AVISO':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'INFO':
            default:
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <Bell className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Notificações
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {unreadCount > 0 
                                    ? `Você tem ${unreadCount} notificação${unreadCount > 1 ? 'ões' : ''} não lida${unreadCount > 1 ? 's' : ''}`
                                    : 'Todas as notificações foram lidas'
                                }
                            </p>
                        </div>
                    </div>
                    
                    {unreadCount > 0 && (
                        <Button variant="outline" size="sm">
                            <Check className="w-4 h-4 mr-2" />
                            Marcar todas como lidas
                        </Button>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Bell className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                                    <p className="font-semibold">{notifications.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full" />
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Não lidas</p>
                                    <p className="font-semibold text-red-600">{unreadCount}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Check className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Lidas</p>
                                    <p className="font-semibold text-green-600">{notifications.length - unreadCount}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Notifications List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Suas Notificações</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {notifications.length > 0 ? (
                            <div className="space-y-4">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 border rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                                            !notification.read 
                                                ? 'border-primary bg-primary/5' 
                                                : 'border-gray-200 dark:border-gray-700'
                                        }`}
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                                        {notification.title}
                                                    </h3>
                                                    <div className="flex items-center space-x-2">
                                                        <Badge className={getNotificationColor(notification.type)}>
                                                            {notification.type}
                                                        </Badge>
                                                        {!notification.read && (
                                                            <div className="w-2 h-2 bg-primary rounded-full" />
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <p className="text-gray-600 dark:text-gray-400 mb-2">
                                                    {notification.message}
                                                </p>
                                                
                                                <p className="text-xs text-gray-500">
                                                    {formatDate(notification.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    Nenhuma notificação
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Você não tem notificações no momento
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
