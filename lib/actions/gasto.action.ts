'use server'
import { z } from "zod";
import { insertFuncionarioSchema, insertGastoSchema, insertMoradorSchema, updateFuncionarioSchema, updateGastoSchema, updateMoradorSchema } from "../validator";
import { prisma } from '@/db/prisma';
import { revalidatePath } from "next/cache";
import { formatErrors, convertToPlainObject } from "../utils";
import { Prisma } from "@prisma/client";
import { PAGE_SIZE } from "../constants";


//Criar a funcionario
export async function createGasto(data: z.infer<typeof insertGastoSchema>) {
    try {
        const gasto = insertGastoSchema.parse(data);
        await prisma.gasto.create({
            data: gasto
        });


        return {
            success: true,
            message: "Gastos criado com sucesso"
        }
    } catch (error) {
        return { success: false, message: formatErrors(error) }
    }
}

//Atualizar a funcionario
export async function updateGasto(data: z.infer<typeof updateGastoSchema> & { id: string }) {
    try {
        const gasto = updateGastoSchema.parse(data);

        await prisma.gasto.update({
            where: {
                id: gasto.id
            },
            data: gasto
        });

        return {
            success: true,
            message: "Gastos atualizado com sucesso"
        }
    } catch (error) {

        return { success: false, message: formatErrors(error) }
    }
}

type vagasDataType = {
    month: string;
    totalGastos: number;
}[]


export async function deleteGasto(id: string) {
    try {

        await prisma.gasto.delete({
            where: {
                id
            }
        });

        revalidatePath('/admin/gatos');

        return {
            success: true,
            message: 'Gasto deletado com sucesso'
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

export async function getGastoById(gastoId: string) {

    const data = await prisma.gasto.findFirst({
        where: {
            id: gastoId
        }
    });

    return convertToPlainObject(data);
}

export async function getAllGastos({
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


    const data = await prisma.gasto.findMany({

        orderBy: {
            createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit,
    });

    const dataCount = await prisma.gasto.count();

    return {
        data,
        totalPages: Math.ceil(dataCount / limit)
    };
}


type gastosDataType = {
    month: string;
    totalGastos: number;
}[]

export async function getGastos() {

    //Get monthly sales
    const gastoDataRaw = await prisma.$queryRaw<
        Array<{ month: string; totalGastos: Prisma.Decimal }>
    >`SELECT to_char("createdAt", 'YYYY-MM') as "month", SUM("valor") as "totalGastos"
  FROM "Gasto"
  GROUP BY to_char("createdAt", 'YYYY-MM')
  ORDER BY to_char("createdAt", 'YYYY-MM') ASC`;

    const gastosData: gastosDataType = gastoDataRaw.map((entry) => ({
        month: entry.month,
        totalGastos: Number(entry.totalGastos),
    }))

    const gastos = await prisma.gasto.findMany();

    const current = gastosData[gastosData.length - 1]?.totalGastos || 0;
    const previous = gastosData[gastosData.length - 2]?.totalGastos || 0;
    const variation = previous === 0 ? 100 : ((current - previous) / previous) * 100;

    return {
        gastosData,
        gastos,
        variation
    }
}
