'use server'
import { z } from "zod";
import { insertVisitanteSchema, updateVisitanteSchema } from "../validator";
import { prisma } from '@/db/prisma';
import { revalidatePath } from "next/cache";
import { formatErrors, convertToPlainObject, convertNullToEmptyString, convertEmptyStringToNull } from "../utils";
import { PAGE_SIZE } from "../constants";
import { Prisma } from "@prisma/client";

// Criar visitante
export async function createVisitante(data: z.infer<typeof insertVisitanteSchema>) {
    try {
        const visitante = insertVisitanteSchema.parse(data);
        
        // Converter strings vazias para null para compatibilidade com banco
        const visitanteData = convertEmptyStringToNull(visitante, ['telefone', 'email', 'observacoes', 'autorizadoPor']);

        await prisma.visitante.create({
            data: visitanteData
        });

        revalidatePath('/admin/visitantes');

        return {
            success: true,
            message: "Visitante criado com sucesso"
        }
    } catch (error) {
        return { success: false, message: formatErrors(error) }
    }
}

// Atualizar visitante
export async function updateVisitante(data: z.infer<typeof updateVisitanteSchema> & { id: string }) {
    try {
        const visitante = updateVisitanteSchema.parse(data);
        
        // Converter strings vazias para null para compatibilidade com banco
        const visitanteData = convertEmptyStringToNull(visitante, ['telefone', 'email', 'observacoes', 'autorizadoPor']);

        await prisma.visitante.update({
            where: {
                id: visitante.id
            },
            data: visitanteData
        });

        revalidatePath('/admin/visitantes');

        return {
            success: true,
            message: "Visitante atualizado com sucesso"
        }
    } catch (error) {
        return { success: false, message: formatErrors(error) }
    }
}


// Buscar todos os visitantes com paginação e filtros
export async function getAllVisitantes({
    query,
    page,
    status,
}: {
    query: string;
    page: number;
    status?: string;
}) {
    try {
        // Criação do filtro de busca baseado na query
        const queryFilter = query
            ? {
                  OR: [
                      { nome: { contains: query, mode: Prisma.QueryMode.insensitive } },
                      { cpf: { contains: query, mode: Prisma.QueryMode.insensitive } },
                      { apartamento: { contains: query, mode: Prisma.QueryMode.insensitive } },
                      { email: { contains: query, mode: Prisma.QueryMode.insensitive } },
                  ],
              }
            : {};

        // Filtro de status, apenas se presente
        const statusFilter = status ? { status } : {};

        // Mesclando os filtros
        const where: Prisma.VisitanteWhereInput = {
            ...queryFilter,
            ...statusFilter,
        };

        // Buscando os visitantes com os filtros aplicados
        const visitantes = await prisma.visitante.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: PAGE_SIZE,
            skip: (page - 1) * PAGE_SIZE,
        });

        // Contando o total de visitantes
        const totalVisitantes = await prisma.visitante.count({ where });

        return {
            data: visitantes,
            totalPages: Math.ceil(totalVisitantes / PAGE_SIZE),
        };
    } catch (error) {
        return { data: [], totalPages: 0 };
    }
}



// Deletar visitante
export async function deleteVisitante(id: string) {
    try {
        const visitanteExists = await prisma.visitante.findFirst({
            where: { id }
        });

        if (!visitanteExists) throw new Error('Visitante não encontrado');

        await prisma.visitante.delete({
            where: { id }
        });

        revalidatePath('/admin/visitantes');

        return {
            success: true,
            message: 'Visitante deletado com sucesso'
        }
    } catch (error) {
        return {
            success: false,
            message: formatErrors(error)
        }
    }
}

// Buscar visitante por ID
export async function getVisitanteById(visitanteId: string) {
    try {
        const data = await prisma.visitante.findFirst({
            where: { id: visitanteId }
        });

        return convertToPlainObject(data);
    } catch (error) {
        return null;
    }
}

// Resumo dos visitantes
export async function getVisitantesSummary() {
    try {
        const visitantesCount = await prisma.visitante.count();
        const visitantesAgendados = await prisma.visitante.count({
            where: { status: 'AGENDADO' }
        });
        const visitantesAutorizados = await prisma.visitante.count({
            where: { autorizado: true }
        });

        return {
            visitantesCount,
            visitantesAgendados,
            visitantesAutorizados
        }
    } catch (error) {
        return {
            visitantesCount: 0,
            visitantesAgendados: 0,
            visitantesAutorizados: 0
        }
    }
}

// Autorizar visitante
export async function autorizarVisitante(id: string, autorizadoPor: string) {
    try {
        await prisma.visitante.update({
            where: { id },
            data: {
                autorizado: true,
                autorizadoPor,
                status: 'AUTORIZADO'
            }
        });

        revalidatePath('/admin/visitantes');

        return {
            success: true,
            message: 'Visitante autorizado com sucesso'
        }
    } catch (error) {
        return {
            success: false,
            message: formatErrors(error)
        }
    }
}
