'use client'

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";

import { updateProfileSchema } from "@/lib/validator";
import { updateUserProfile } from "@/lib/actions/user.actions";
import { UserWithMoradores } from "@/types";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Shield, Home, Calendar } from "lucide-react";

type UserProfileFormProps = {
    user: UserWithMoradores;
}

const UserProfileForm = ({ user }: UserProfileFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof updateProfileSchema>>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: user.name || "",
            email: user.email || "",
        },
    });

    const onSubmit: SubmitHandler<z.infer<typeof updateProfileSchema>> = async (values) => {
        setIsLoading(true);
        
        try {
            const result = await updateUserProfile(user.id, values);
            
            if (result.success) {
                toast.success("Perfil atualizado com sucesso!");
                router.refresh();
            } else {
                toast.error(result.message || "Erro ao atualizar perfil");
            }
        } catch (error) {
            toast.error("Erro interno do servidor");
        } finally {
            setIsLoading(false);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'FUNCIONARIO':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'MORADOR':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Avatar className="w-16 h-16">
                    <AvatarFallback className="text-lg font-semibold">
                        {getInitials(user.name || 'US')}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {user.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getRoleColor(user.tipo)}>
                            <Shield className="w-3 h-3 mr-1" />
                            {user.tipo}
                        </Badge>
                        <Badge variant="outline">
                            <Calendar className="w-3 h-3 mr-1" />
                            Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Apartamentos Associados */}
            {user.moradores && user.moradores.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Home className="w-5 h-5" />
                            <span>Apartamentos Associados</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {user.moradores.map((morador: any) => (
                                <div key={morador.id} className="p-4 border rounded-lg">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Home className="w-4 h-4 text-blue-600" />
                                        <span className="font-semibold">Apt {morador.apartamento}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {morador.nome}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        CPF: {morador.cpf}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <Separator />

            {/* Profile Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center space-x-2">
                                        <User className="w-4 h-4" />
                                        <span>Nome Completo</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Digite seu nome completo" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center space-x-2">
                                        <Mail className="w-4 h-4" />
                                        <span>E-mail</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="email" 
                                            placeholder="Digite seu e-mail" 
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default UserProfileForm;
