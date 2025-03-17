'use server'
import { z } from "zod";
import { insertMoradorSchema, updateMoradorSchema } from "../validator";
import { prisma } from '@/db/prisma';
import { revalidatePath } from "next/cache";
import { formatErrors, convertToPlainObject } from "../utils";
import { Prisma } from "@prisma/client";
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
export async function createMorador(data: z.infer<typeof insertMoradorSchema>) {
    try {
        const parking = insertMoradorSchema.parse(data);

        await prisma.morador.create({
            data: parking
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

//Update a morador
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
export async function getAllParkings({
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


    const data = await prisma.parking.findMany({

        orderBy: {
            createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit,
    });

    const dataCount = await prisma.parking.count();

    return {
        data,
        totalPages: Math.ceil(dataCount / limit)
    };
}

export async function deleteParking(id: string) {
    try {
        const parkingExists = await prisma.parking.findFirst({
            where: {
                id
            }
        });

        if (!parkingExists) throw new Error('Parking not found');

        await prisma.parking.delete({
            where: {
                id
            }
        });

        revalidatePath('/admin/parkings');

        return {
            success: true,
            message: 'Parking deleted successfully'
        }
    } catch (error) {
        return {
            success: false,
            message: formatErrors(error)
        }
    }
}

