'use server'
import { z } from "zod";
import { insertFuncionarioSchema, insertMoradorSchema, updateFuncionarioSchema, updateMoradorSchema } from "../validator";
import { prisma } from '@/db/prisma';
import { revalidatePath } from "next/cache";
import { formatErrors, convertToPlainObject } from "../utils";
import { Prisma } from "@prisma/client";
import { PAGE_SIZE } from "../constants";


//Create a funcionario
export async function createFuncionario(data: z.infer<typeof insertFuncionarioSchema>) {
    try {
        const funcionario = insertFuncionarioSchema.parse(data);

        await prisma.funcionario.create({
            data: funcionario
        });

        revalidatePath('/funcionarios');

        return {
            success: true,
            message: "Funcionário criado com sucesso"
        }
    } catch (error) {

        return { success: false, message: formatErrors(error) }
    }
}

//Update a funcionario
export async function updateFuncionario(data: z.infer<typeof updateFuncionarioSchema> & { id: string }) {
    try {
        const funcionario = updateFuncionarioSchema.parse(data);

        await prisma.funcionario.update({
            where: {
                id: funcionario.id
            },
            data: funcionario
        });

        return {
            success: true,
            message: "Morador atualizado com sucesso"
        }
    } catch (error) {

        return { success: false, message: formatErrors(error) }
    }
}

type vagasDataType = {
    month: string;
    totalVagas: number;
}[]


export async function deleteFuncionario(id: string) {
    try {
        const funcionarioExists = await prisma.funcionario.findFirst({
            where: {
                id
            }
        });

        if (!funcionarioExists) throw new Error('Funcionário não encontrado');

        await prisma.funcionario.delete({
            where: {
                id
            }
        });

        revalidatePath('/admin/funcionarios');

        return {
            success: true,
            message: 'funcionario deletado com sucesso'
        }
    } catch (error) {
        return {
            success: false,
            message: formatErrors(error)
        }
    }
}

export async function getFuncionariosSummary() {
    const funcionariosCount = await prisma.funcionario.count();
    return {
        funcionariosCount
    }
}

export async function getFuncionarioById(funcionarioId: string) {

    const data = await prisma.funcionario.findFirst({
        where: {
            id: funcionarioId
        }
    });

    return convertToPlainObject(data);
}

export async function getAllFuncionarios({
    query,
    limit = PAGE_SIZE,
    page,
    category,
    price,
    rating,
    sort
}: {
    query: string,
    limit?: number,
    page: number,
    category?: string,
    price?: string,
    rating?: string,
    sort?: string
}
) {


    const data = await prisma.funcionario.findMany({

        orderBy: {
            createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit,
    });

    const dataCount = await prisma.funcionario.count();

    return {
        data,
        totalPages: Math.ceil(dataCount / limit)
    };
}
