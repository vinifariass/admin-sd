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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Settings className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Tipo</p>
                                    <p className="font-semibold">{user.tipo}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <User className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                                    <p className="font-semibold text-green-600">Ativo</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Home className="w-5 h-5 text-purple-600" />
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Apartamentos</p>
                                    <p className="font-semibold">{user.moradores?.length || 0}</p>
                                </div>
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
