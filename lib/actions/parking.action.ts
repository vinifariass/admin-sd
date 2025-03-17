'use server'
import { z } from "zod";
import { insertParkingSchema, updateParkingSchema } from "../validator";
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
export async function createParking(data: z.infer<typeof insertParkingSchema>) {
    try {
        const parking = insertParkingSchema.parse(data);

        await prisma.parking.create({
            data: parking
        });

        revalidatePath('/parkings');

        return {
            success: true,
            message: "Estacionamento criado com sucesso"
        }
    } catch (error) {

        return { success: false, message: formatErrors(error) }
    }
}

//Update a parking
export async function updateParking(data: z.infer<typeof updateParkingSchema> & { id: string }) {
    try {
        const parking = updateParkingSchema.parse(data);

        await prisma.parking.update({
            where: {
                id: parking.id
            },
            data: parking
        });

        return {
            success: true,
            message: "Estacionamento atualizado com sucesso"
        }
    } catch (error) {

        return { success: false, message: formatErrors(error) }
    }
}

//Get all parkings
// Get sales data and order summary
export async function getParkingSummary() {
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
        parkingsCount
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

