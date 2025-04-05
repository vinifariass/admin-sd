'use server'
import { prisma } from "@/db/prisma";
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { convertToPlainObject, formatErrors } from "../utils";
import { updateServicoSchema } from "../validator";
import { z } from "zod";

export async function salvarRecibos(recibos: { nomeServico: string; dataVencimento: string }[]) {
    try {
        //Verificar data e nome do serviço, se for igual não salva
        const recibosExistentes = await prisma.recibo.findMany({
            where: {
                OR: recibos.map((recibo) => ({
                    nomeServico: recibo.nomeServico,
                    dataVencimento: new Date(`${recibo.dataVencimento}T00:00:00.000Z`),
                })),
            },
        });
        if (recibosExistentes.length > 0) {
            return {
                success: false,
                message: 'Recibos já existem no banco de dados'
            }
        }

        const recibosFormatados = recibos.map((r) => ({
            nomeServico: r.nomeServico,
            dataVencimento: new Date(`${r.dataVencimento}T00:00:00.000Z`),
        }));

        // Salva os recibos no banco de dados
        await prisma.recibo.createMany({
            data: recibosFormatados,
        });

        revalidatePath('/admin/recibos');
        return {
            success: true,
            message: 'Recibos salvos com sucesso'
        }
    } catch (error: any) {
        return (error)
    }
}

export async function getAllRecibos({
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


    const data = await prisma.recibo.findMany({

        orderBy: {
            createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit,
    });

    const dataCount = await prisma.recibo.count();

    return {
        data,
        totalPages: Math.ceil(dataCount / limit)
    };
}

export async function deleteRecibo(id: string) {
    try {

        await prisma.user.delete({
            where: {
                id
            }
        });

        revalidatePath('/admin/recibos');

        return {
            success: true,
            message: 'Recibo deletado com sucesso'
        }

    } catch (error) {
        return { success: false, message: formatErrors(error) };
    }
}

export async function getReciboById(reciboId: string) {

    const data = await prisma.recibo.findFirst({
        where: {
            id: reciboId
        }
    });

    return convertToPlainObject(data);
}

//Atualizar a parking
export async function updateServico(data: z.infer<typeof updateServicoSchema> & { id: string }) {
    try {
        const servico = updateServicoSchema.parse(data);

        await prisma.recibo.update({
            where: {
                id: servico.id
            },
            data: servico
        });

        return {
            success: true,
            message: "Serviço atualizado com sucesso"
        }
    } catch (error) {

        return { success: false, message: formatErrors(error) }
    }
}