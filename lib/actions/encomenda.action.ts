'use server'
import { z } from "zod";
import { insertEncomendaSchema, updateEncomendaSchema } from "../validator";
import { prisma } from '@/db/prisma';
import { revalidatePath } from "next/cache";
import { formatErrors, convertToPlainObject } from "../utils";
import { Prisma } from "@prisma/client";
import { PAGE_SIZE } from "../constants";

export async function getEncomendaById(encomendaId: string) {

    const data = await prisma.encomenda.findFirst({
        where: {
            id: encomendaId
        }
    });

    return convertToPlainObject(data);
}


//Criar a parking
export async function createEncomenda(data: z.infer<typeof insertEncomendaSchema>) {
    try {
        const encomenda = insertEncomendaSchema.parse(data);

        await prisma.encomenda.create({
            data: encomenda
        });

        revalidatePath('/encomendas');

        return {
            success: true,
            message: "Encomenda criado com sucesso"
        }
    } catch (error) {

        return { success: false, message: formatErrors(error) }
    }
}

export async function updateEncomenda(data: z.infer<typeof updateEncomendaSchema> & { id: string }) {
    try {
        const encomenda = updateEncomendaSchema.parse(data);

        await prisma.encomenda.update({
            where: {
                id: encomenda.id
            },
            data: encomenda
        });

        return {
            success: true,
            message: "Encomenda atualizado com sucesso"
        }
    } catch (error) {

        return { success: false, message: formatErrors(error) }
    }
}

type vagasDataType = {
    month: string;
    totalVagas: number;
}[]

//Get all parkings
// Get sales data and order summary
export async function getParkingSummary() {

    //Get monthly sales
    const vagasDataRaw = await prisma.$queryRaw<
        Array<{ month: string; totalVagas: Prisma.Decimal }>
    >`SELECT to_char("createdAt", 'MM/YY') as "month", count("id") as "totalVagas"
    FROM "Parking" GROUP BY to_char("createdAt", 'MM/YY')`;

    const vagasData: vagasDataType = vagasDataRaw.map((entry) => ({
        month: entry.month,
        totalVagas: Number(entry.totalVagas),
    }))
    // Get latest sales
    const latestVagas = await prisma.parking.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
    })

    /*  const ordersCount = await prisma.order.count();
     const productsCount = await prisma.product.count();
     const usersCount = await prisma.user.count();
 
     // Calculate the total sales
     const totalSales = await prisma.order.aggregate({
         _sum: {
             totalPrice: true
         }
     });

     
 
     // Get monthly sales
     const salesDataRaw = await prisma.$queryRaw<
         Array<{ month: string; totalSales: Prisma.Decimal }>
     >`SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales"
    FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')`;
 
     const salesData: SalesDataType = salesDataRaw.map((entry) => ({
         month: entry.month,
         totalSales: Number(entry.totalSales),
     }))
     // Get latest sales
     const latestSales = await prisma.order.findMany({
         orderBy: { createdAt: 'desc' },
         take: 6,
         include: {
             user: {
                 select: { name: true }
             }
         }
     })
 
     return {
         ordersCount,
         productsCount,
         usersCount,
         totalSales,
         latestSales,
         salesData
     } */

    const parkingsCount = await prisma.parking.count();

    return {
        parkingsCount,
        latestVagas,
        vagasData
    }
}

// Get all products
export async function getAllEncomendas({
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


    const data = await prisma.encomenda.findMany({

        orderBy: {
            createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit,
    });

    const dataCount = await prisma.encomenda.count();

    return {
        data,
        totalPages: Math.ceil(dataCount / limit)
    };
}

export async function deleteEncomenda(id: string) {
    try {
        const encomendaExists = await prisma.encomenda.findFirst({
            where: {
                id
            }
        });

        if (!encomendaExists) throw new Error('Encomenda não encontrado');

        await prisma.encomenda.delete({
            where: {
                id
            }
        });

        revalidatePath('/admin/encomendas');

        return {
            success: true,
            message: 'Encomenda deletado com sucesso'
        }
    } catch (error) {
        return {
            success: false,
            message: formatErrors(error)
        }
    }
}

export async function getMoradoresSummary() {
    const moradoresCount = await prisma.morador.count();
    return {
        moradoresCount
    }
}

// Get latest encomendas for dashboard
export async function getLatestEncomendas(limit: number = 5) {
    try {
        const encomendas = await prisma.encomenda.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: limit,
            include: {
                morador: {
                    select: {
                        nome: true
                    }
                }
            }
        });

        return encomendas;
    } catch (error) {
        console.error('Error fetching latest encomendas:', error);
        return [];
    }
}

// Get encomendas summary for dashboard
export async function getEncomendasSummary() {
    try {
        const encomendasCount = await prisma.encomenda.count();
        const encomendasEntregues = await prisma.encomenda.count({
            where: {
                dataEntrega: {
                    not: null
                }
            }
        });
        const encomendasAssinadas = await prisma.encomenda.count({
            where: {
                dataAssinatura: {
                    not: null
                }
            }
        });

        return {
            encomendasCount,
            encomendasEntregues,
            encomendasAssinadas
        };
    } catch (error) {
        console.error('Error fetching encomendas summary:', error);
        return {
            encomendasCount: 0,
            encomendasEntregues: 0,
            encomendasAssinadas: 0
        };
    }
}



