import { z } from "zod";

export const insertParkingSchema = z.object({
    apartamento: z.string().min(1, { message: "Apartamento é obrigatório" }),
    placa: z.string().min(1, { message: "Placa é obrigatória" }),
    carro: z.string().min(1, { message: "Carro é obrigatório" }),
    cor: z.string().min(1, { message: "Cor é obrigatória" }),
});

export const updateParkingSchema = insertParkingSchema.extend({
    id: z.string().uuid({ message: "Estacionamento inválido" }),
});