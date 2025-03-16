import { z } from "zod";

export const insertParkingSchema = z.object({
    apartamento: z.string().min(1, { message: "Apartamento é obrigatório" }),
    placa: z.string().min(1, { message: "Placa é obrigatória" }),
    carro: z.string().min(1, { message: "Carro é obrigatório" }),
    cor: z.string().min(1, { message: "Cor é obrigatória" }),
    username: z.string().min(2, { message: "Username deve ter pelo menos 2 caracteres" }),
});

export const updateParkingSchema = insertParkingSchema.extend({
    id: z.string().uuid({ message: "Estacionamento inválido" }),
});