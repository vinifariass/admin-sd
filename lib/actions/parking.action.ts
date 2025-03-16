'use server'
import { z } from "zod";
import { insertParkingSchema, updateParkingSchema } from "../validator";
import { prisma } from '@/db/prisma';
import { revalidatePath } from "next/cache";
import { formatErrors } from "../utils";
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

        revalidatePath('/parkings');

        return {
            success: true,
            message: "Estacionamento atualizado com sucesso"
        }
    } catch (error) {

        return { success: false, message: formatErrors(error) }
    }
}