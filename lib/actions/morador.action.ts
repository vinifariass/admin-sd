'use server'
import { z } from "zod";
import { insertMoradorSchema, updateMoradorSchema } from "../validator";
import { prisma } from '@/db/prisma';
import { revalidatePath } from "next/cache";
import { formatErrors, convertToPlainObject } from "../utils";
import { Prisma } from "@prisma/client";
import { PAGE_SIZE } from "../constants";


//Create a parking
export async function createMorador(data: z.infer<typeof insertMoradorSchema>) {
    try {
        const morador = insertMoradorSchema.parse(data);

        await prisma.morador.create({
            data: morador
        });

        revalidatePath('/moradores');

        return {
            success: true,
            message: "Morador criado com sucesso"
        }
    } catch (error) {

        return { success: false, message: formatErrors(error) }
    }
}

//Atualizar a morador
export async function updateMorador(data: z.infer<typeof updateMoradorSchema> & { id: string }) {
    try {
        const morador = updateMoradorSchema.parse(data);

        await prisma.morador.update({
            where: {
                id: morador.id
            },
            data: morador
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
export async function getAllMoradores() {


    try {
        const moradores = await prisma.morador.findMany({

            select: { id: true, nome: true },
        });
        return moradores;
    } catch (error) {
        return (formatErrors(error));
    }
}

export async function deleteMorador(id: string) {
    try {
        const moradorExists = await prisma.morador.findFirst({
            where: {
                id
            }
        });

        if (!moradorExists) throw new Error('Morador não encontrado');

        await prisma.morador.delete({
            where: {
                id
            }
        });

        revalidatePath('/admin/moradores');

        return {
            success: true,
            message: 'Morador deletado com sucesso'
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

export async function getMoradorById(moradorId: string) {

    const data = await prisma.morador.findFirst({
        where: {
            id: moradorId
        }
    });


    return convertToPlainObject(data);
}

export async function getMoradorNameById(moradorId: string): Promise<string | null> {
    try {
        const morador = await prisma.morador.findFirst({
            where: {
                id: moradorId
            },
            select: {
                nome: true
            }
        });
        return morador?.nome || null;
    } catch (error) {
        throw formatErrors(error);

    }
}


