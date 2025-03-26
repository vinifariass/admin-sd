'use server'
import { z } from "zod";
import { insertAgendamentoSchema, updateAgendamentoSchema } from "../validator";
import { prisma } from '@/db/prisma';
import { revalidatePath } from "next/cache";
import { formatErrors, convertToPlainObject } from "../utils";
import { Agendamento, Prisma } from "@prisma/client";
import { PAGE_SIZE } from "../constants";

export async function getParkingById(parkingId: string) {

    const data = await prisma.parking.findFirst({
        where: {
            id: parkingId
        }
    });

    return convertToPlainObject(data);
}


//Create a parking
export async function createAgendamento(data: z.infer<typeof insertAgendamentoSchema>) {
    try {
        const agendamento = insertAgendamentoSchema.parse(data);

        await prisma.agendamento.create({
            data: agendamento
        });

        revalidatePath('/agendamentos');

        return {
            success: true,
            message: "Agendamento criado com sucesso"
        }
    } catch (error) {

        return { success: false, message: formatErrors(error) }
    }
}

//Update a parking
export async function updateAgendamento(data: z.infer<typeof updateAgendamentoSchema> & { id: string }) {
    try {
        const agendamento = updateAgendamentoSchema.parse(data);

        await prisma.agendamento.update({
            where: {
                id: agendamento.id
            },
            data: agendamento
        });

        return {
            success: true,
            message: "Agendamento atualizado com sucesso"
        }
    } catch (error) {

        return { success: false, message: formatErrors(error) }
    }
}

type vagasDataType = {
    month: string;
    totalVagas: number;
}[]

// Get all products
export async function getAllAgendamentos({
    query,
    limit = PAGE_SIZE,
    page,
    vaga,
}: {
    query?: string,
    limit?: number,
    page: number,
    vaga?: string,
}
) {




    const skip = (page - 1) * limit;

    const queryFilter: Prisma.AgendamentoWhereInput =
        query && query !== 'all'
            ? {
                nome: {
                    contains: query,
                    mode: 'insensitive',
                } as Prisma.StringFilter,
            }
            : {};

    const data = await prisma.agendamento.findMany({
        where: {
            ...queryFilter
        },
        orderBy: {
            createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit,
    });


    const dataCount = await prisma.agendamento.count();

    return {
        data,
        totalPages: Math.ceil(dataCount / limit)
    };
}

export async function deleteAgendamento(id: string) {
    try {
        const agendamentoExists = await prisma.agendamento.findFirst({
            where: {
                id
            }
        });

        if (!agendamentoExists) throw new Error('Agendamento not found');

        await prisma.agendamento.delete({
            where: {
                id
            }
        });

        revalidatePath('/admin/agendamentos');

        return {
            success: true,
            message: 'Agendamento deleted successfully'
        }
    } catch (error) {
        return {
            success: false,
            message: formatErrors(error)
        }
    }
}


export async function getAllMoradores({
    query,
    limit = PAGE_SIZE,
    page,
    morador,
}: {
    query: string,
    limit?: number,
    page: number,
    morador?: string,
}
) {


    const data = await prisma.morador.findMany({

        orderBy: {
            createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit,
    });

    const dataCount = await prisma.morador.count();

    return {
        data,
        totalPages: Math.ceil(dataCount / limit)
    };
}

export async function getAgendamentos() {
    const agendamentos = await prisma.agendamento.findMany();
    return agendamentos;
}