'use server'
import { z } from "zod";
import { insertNotificacaoSchema, updateNotificacaoSchema, enviarNotificacaoSchema } from "../validator";
import { prisma } from '@/db/prisma';
import { revalidatePath } from "next/cache";
import { formatErrors, convertToPlainObject } from "../utils";
import { PAGE_SIZE } from "../constants";

// Criar notificação
export async function createNotificacao(data: z.infer<typeof insertNotificacaoSchema>) {
    try {
        const notificacao = insertNotificacaoSchema.parse(data);

        await prisma.notificacao.create({
            data: notificacao
        });

        revalidatePath('/admin/notificacoes');

        return {
            success: true,
            message: "Notificação criada com sucesso"
        }
    } catch (error) {
        return { success: false, message: formatErrors(error) }
    }
}

// Enviar notificação para múltiplos destinatários
export async function enviarNotificacao(data: z.infer<typeof enviarNotificacaoSchema>, remetente: string) {
    try {
        const { titulo, mensagem, tipo, destinatarios } = enviarNotificacaoSchema.parse(data);

        // Criar uma notificação para cada destinatário
        const notificacoes = destinatarios.map(destinatario => ({
            titulo,
            mensagem,
            tipo,
            remetente,
            destinatario,
        }));

        await prisma.notificacao.createMany({
            data: notificacoes
        });

        revalidatePath('/admin');
        revalidatePath('/admin/overview');

        return {
            success: true,
            message: `Notificação enviada para ${destinatarios.length} destinatário(s)`
        }
    } catch (error) {
        return { success: false, message: formatErrors(error) }
    }
}

// Marcar notificação como lida
export async function marcarComoLida(id: string) {
    try {
        await prisma.notificacao.update({
            where: { id },
            data: { lida: true }
        });

        revalidatePath('/admin');
        revalidatePath('/admin/overview');

        return {
            success: true,
            message: "Notificação marcada como lida"
        }
    } catch (error) {
        return { success: false, message: formatErrors(error) }
    }
}

// Marcar todas as notificações como lidas para um usuário
export async function marcarTodasComoLidas(destinatario: string) {
    try {
        await prisma.notificacao.updateMany({
            where: { 
                destinatario,
                lida: false 
            },
            data: { lida: true }
        });

        revalidatePath('/admin');
        revalidatePath('/admin/overview');

        return {
            success: true,
            message: "Todas as notificações foram marcadas como lidas"
        }
    } catch (error) {
        return { success: false, message: formatErrors(error) }
    }
}

// Buscar notificações de um usuário
export async function getNotificacoesByUser(destinatario: string, page: number = 1) {
    try {
        const notificacoes = await prisma.notificacao.findMany({
            where: { destinatario },
            orderBy: { createdAt: 'desc' },
            take: PAGE_SIZE,
            skip: (page - 1) * PAGE_SIZE,
        });

        const totalNotificacoes = await prisma.notificacao.count({
            where: { destinatario }
        });

        return {
            data: notificacoes,
            totalPages: Math.ceil(totalNotificacoes / PAGE_SIZE),
        };
    } catch (error) {
        return { data: [], totalPages: 0 };
    }
}

// Contar notificações não lidas de um usuário
export async function countNotificacaoesNaoLidas(destinatario: string) {
    try {
        const count = await prisma.notificacao.count({
            where: { 
                destinatario,
                lida: false 
            }
        });

        return count;
    } catch (error) {
        return 0;
    }
}

// Buscar todas as notificações (admin)
export async function getAllNotificacoes(page: number = 1) {
    try {
        const notificacoes = await prisma.notificacao.findMany({
            orderBy: { createdAt: 'desc' },
            take: PAGE_SIZE,
            skip: (page - 1) * PAGE_SIZE,
        });

        const totalNotificacoes = await prisma.notificacao.count();

        return {
            data: notificacoes,
            totalPages: Math.ceil(totalNotificacoes / PAGE_SIZE),
        };
    } catch (error) {
        return { data: [], totalPages: 0 };
    }
}

// Deletar notificação
export async function deleteNotificacao(id: string) {
    try {
        await prisma.notificacao.delete({
            where: { id }
        });

        revalidatePath('/admin/notificacoes');

        return {
            success: true,
            message: "Notificação deletada com sucesso"
        }
    } catch (error) {
        return { success: false, message: formatErrors(error) }
    }
}

// Buscar notificação por ID
export async function getNotificacaoById(id: string) {
    try {
        const notificacao = await prisma.notificacao.findFirst({
            where: { id }
        });

        return convertToPlainObject(notificacao);
    } catch (error) {
        return null;
    }
}

// Buscar notificações recentes (últimas 5)
export async function getNotificacoesRecentes(destinatario: string) {
    try {
        const notificacoes = await prisma.notificacao.findMany({
            where: { destinatario },
            orderBy: { createdAt: 'desc' },
            take: 5,
        });

        return notificacoes;
    } catch (error) {
        return [];
    }
}
