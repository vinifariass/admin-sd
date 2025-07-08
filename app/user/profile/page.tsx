import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import UserProfileForm from "@/components/user/user-profile-form";
import { getUserById } from "@/lib/actions/user.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Settings, Home } from "lucide-react";
import { UserWithMoradores } from "@/types";

export const metadata: Metadata = {
    title: 'Meu Perfil - Admin SD',
    description: 'Gerencie suas informações pessoais e preferências',
};

export default async function UserProfilePage() {
    const session = await auth();
    
    if (!session?.user?.id) {
        redirect('/sign-in');
    }

    const user = await getUserById(session.user.id) as UserWithMoradores;
    
    if (!user) {
        redirect('/sign-in');
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Meu Perfil
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Gerencie suas informações pessoais e configurações
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 dark:from-blue-600 dark:via-blue-700 dark:to-blue-800 shadow-xl">
                        <div className="absolute inset-0 bg-black/10 dark:bg-white/5"></div>
                        <CardContent className="relative p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                        <Settings className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-100">Tipo de Usuário</p>
                                        <p className="text-xl font-bold text-white">{user.tipo}</p>
                                    </div>
                                </div>
                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full"></div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 dark:from-emerald-600 dark:via-emerald-700 dark:to-emerald-800 shadow-xl">
                        <div className="absolute inset-0 bg-black/10 dark:bg-white/5"></div>
                        <CardContent className="relative p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-emerald-100">Status</p>
                                        <p className="text-xl font-bold text-white">Ativo</p>
                                    </div>
                                </div>
                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full"></div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 dark:from-purple-600 dark:via-purple-700 dark:to-purple-800 shadow-xl">
                        <div className="absolute inset-0 bg-black/10 dark:bg-white/5"></div>
                        <CardContent className="relative p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                        <Home className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-purple-100">Apartamentos</p>
                                        <p className="text-xl font-bold text-white">{user.moradores?.length || 0}</p>
                                    </div>
                                </div>
                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full"></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Profile Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Settings className="w-5 h-5" />
                            <span>Informações Pessoais</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <UserProfileForm user={user} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
