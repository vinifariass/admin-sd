'use server'

import { z } from "zod";
import { prisma } from "@/db/prisma";
import { updateProfileSchema } from "@/lib/validator";
import { formatErrors, convertToPlainObject } from "@/lib/utils";
import { revalidatePath } from "next/cache";

// Buscar usuário por ID com moradores associados
export async function getUserById(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                moradores: {
                    select: {
                        id: true,
                        nome: true,
                        cpf: true,
                        apartamento: true,
                        email: true,
                        telefone: true,
                        createdAt: true,
                    }
                }
            }
        });

        if (!user) {
            return null;
        }

        return convertToPlainObject(user);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        return null;
    }
}

// Atualizar perfil do usuário
export async function updateUserProfile(userId: string, data: z.infer<typeof updateProfileSchema>) {
    try {
        const validatedData = updateProfileSchema.parse(data);

        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                name: validatedData.name,
                email: validatedData.email,
            }
        });

        revalidatePath('/user/profile');
        revalidatePath('/admin/users');

        return {
            success: true,
            message: "Perfil atualizado com sucesso",
            data: convertToPlainObject(updatedUser)
        };
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        return {
            success: false,
            message: formatErrors(error)
        };
    }
}

// Buscar estatísticas do usuário
export async function getUserStats(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                moradores: {
                    select: {
                        id: true,
                        apartamento: true,
                    }
                }
            }
        });

        if (!user) {
            return {
                success: false,
                message: "Usuário não encontrado"
            };
        }

        // Contar apartamentos únicos
        const apartamentosUnicos = [...new Set(user.moradores.map(m => m.apartamento))];

        return {
            success: true,
            data: {
                totalMoradores: user.moradores.length,
                totalApartamentos: apartamentosUnicos.length,
                apartamentos: apartamentosUnicos,
                tipo: user.tipo,
                dataCriacao: user.createdAt
            }
        };
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        return {
            success: false,
            message: formatErrors(error)
        };
    }
}

// Buscar histórico de atividades do usuário (placeholder para futuro)
export async function getUserActivity(userId: string) {
    try {
        // Placeholder para implementar no futuro
        // Pode incluir logs de acesso, alterações feitas, etc.
        
        return {
            success: true,
            data: {
                activities: [],
                message: "Histórico de atividades será implementado em breve"
            }
        };
    } catch (error) {
        console.error('Erro ao buscar atividades:', error);
        return {
            success: false,
            message: formatErrors(error)
        };
    }
}
