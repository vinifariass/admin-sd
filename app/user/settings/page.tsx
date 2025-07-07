import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Shield, Bell, Palette, Database } from "lucide-react";
import UserSettingsForm from "@/components/user/user-settings-form";

export const metadata: Metadata = {
    title: 'Configurações - Admin SD',
    description: 'Configure suas preferências e configurações do sistema',
};

export default async function UserSettingsPage() {
    const session = await auth();
    
    if (!session?.user?.id) {
        redirect('/sign-in');
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Settings className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Configurações
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Gerencie suas preferências e configurações do sistema
                        </p>
                    </div>
                </div>

                {/* Settings Sections */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Preferences */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Palette className="w-5 h-5" />
                                <span>Preferências de Interface</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <UserSettingsForm />
                        </CardContent>
                    </Card>

                    {/* Privacy & Security */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Shield className="w-5 h-5" />
                                <span>Privacidade e Segurança</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <h3 className="font-medium">Alterar Senha</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Atualize sua senha para manter sua conta segura
                                        </p>
                                    </div>
                                    <div className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                                        Em breve
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <h3 className="font-medium">Autenticação em Duas Etapas</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Adicione uma camada extra de segurança
                                        </p>
                                    </div>
                                    <div className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                                        Em breve
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Bell className="w-5 h-5" />
                                <span>Notificações</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <h3 className="font-medium">Notificações por Email</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Receba atualizações importantes por email
                                        </p>
                                    </div>
                                    <div className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                                        Configurar
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <h3 className="font-medium">Notificações Push</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Receba notificações em tempo real
                                        </p>
                                    </div>
                                    <div className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                                        Em breve
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data & Privacy */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Database className="w-5 h-5" />
                                <span>Dados e Privacidade</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <h3 className="font-medium">Exportar Dados</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Baixe uma cópia dos seus dados
                                        </p>
                                    </div>
                                    <div className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                                        Em breve
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <h3 className="font-medium">Excluir Conta</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Exclua permanentemente sua conta e dados
                                        </p>
                                    </div>
                                    <div className="text-sm text-red-600 hover:text-red-700 cursor-pointer">
                                        Em breve
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
