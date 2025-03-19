import { z } from "zod";

const isValidCPF = (cpf: string) => {
    cpf = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let sum = 0, remainder;

    for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;

    return remainder === parseInt(cpf[10]);
};

export const signInFormSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});

export const insertParkingSchema = z.object({
    apartamento: z.string().min(1, { message: "Apartamento é obrigatório" }),
    placa: z.string().min(1, { message: "Placa é obrigatória" }),
    carro: z.string().min(1, { message: "Carro é obrigatório" }),
    cor: z.string().min(1, { message: "Cor é obrigatória" }),
    tipoMorador: z.enum(["Proprietario", "Inquilino"], { message: "Escolha uma opção válida" }),
    nome: z.string().min(1, { message: "Nome é obrigatório" }),
    cpf: z.string()
        .min(11, { message: "CPF deve ter 11 dígitos" })
        .max(14, { message: "CPF deve ter no máximo 14 caracteres" })
        .refine(isValidCPF, { message: "CPF inválido" }),
});

export const updateParkingSchema = insertParkingSchema.extend({
    id: z.string().uuid({ message: "Estacionamento inválido" }),
});

//Morador
export const insertMoradorSchema = z.object({
    nome: z.string().min(1, { message: "Nome é obrigatório" }),
    cpf: z.string()
        .min(11, { message: "CPF deve ter 11 dígitos" })
        .max(14, { message: "CPF deve ter no máximo 14 caracteres" })
        .refine(isValidCPF, { message: "CPF inválido" }),
    apartamento: z.string().min(1, { message: "Apartamento é obrigatório" }),
    dataLocacao: z.string().min(1, { message: "Data de locação é obrigatória" }),
    email: z.string().email().optional(),
    telefone: z.string().optional(),
    dataSaida: z.string().optional(),
});

export const updateMoradorSchema = insertMoradorSchema.extend({
    id: z.string().uuid({ message: "Estacionamento inválido" }),
});

