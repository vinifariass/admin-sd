import { z } from "zod";

const isValidCPF: (cpf: string) => boolean = (cpf: string): boolean => {
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
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
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
    dataLocacao: z.date().or(z.string().datetime()),
    email: z.string().email("E-mail inválido").nullable().optional(),
    telefone: z.string().nullable().optional(),
    dataSaida: z.date().or(z.string().datetime()).nullable().optional(),
});

export const updateMoradorSchema = insertMoradorSchema.extend({
    id: z.string().uuid({ message: "Morador inválido" }),
});

export const insertFuncionarioSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    cpf: z.string().min(11, "CPF deve ter 11 dígitos").max(14, "CPF inválido"),
    cargo: z.string().min(1, "Cargo é obrigatório"),
    salario: z.number().positive("O salário deve ser um número positivo"),
    email: z.string().email("E-mail inválido").nullable().optional(),
    telefone: z.string().nullable().optional(),
    dataAdmissao: z.date().or(z.string().datetime()).nullable().optional(),
    dataDemissao: z.date().or(z.string().datetime()).nullable().optional(),
    endereco: z.string().nullable().optional(),
    departamento: z.string().nullable().optional(),
    status: z.enum(["ATIVO", "INATIVO", "AFASTADO"]).default("ATIVO").nullable().optional(),
    pis: z.string().nullable().optional(),
    dataNascimento: z.date().or(z.string().datetime()).nullable().optional(),
    rg: z.string().nullable().optional(),
});
export const updateFuncionarioSchema = insertFuncionarioSchema.extend({
    id: z.string().uuid({ message: "Funcionário inválido" }),
});

//Schema for signing up a user
export const singUpFormSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirmação de senha deve ter pelo menos 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ['confirmPassword']
});

export const insertEncomendaSchema = z.object({
    numeroPedido: z.string().min(1, { message: "Número do pedido é obrigatório" }),
    moradorId: z.string().min(1, { message: "Selecione um morador" }),
    status: z.enum(["DEVOLVIDO", "ENTREGUE"]).optional(),
    assinadoPor: z.string().nullable().optional(),
    assinado: z.boolean().optional(),
});

export const updateEncomendaSchema = insertEncomendaSchema.extend({
    id: z.string().uuid({ message: "Encomenda inválida" }),
});

export const insertAgendamentoSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    apartamento: z.string().min(1, { message: "Apartamento é obrigatório" }),
    status: z.string(),
    horario: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato inválido de horário (HH:mm)"),
    tipo: z.string().min(1, "Tipo é obrigatório"),
    descricao: z.string().min(1, "Descrição é obrigatória"),
});

export const updateAgendamentoSchema = insertAgendamentoSchema.extend({
    id: z.string().uuid({ message: "Agendamento inválido" }),
});

export const updateProfileSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().min(3, 'Email must be at least 3 characters'),
})

//Schema to update users
export const updateUserSchema = updateProfileSchema.extend({
    id: z.string().min(1, 'ID é obrigatório'),
    tipo: z.enum(['MORADOR', 'ADMIN', 'FUNCIONARIO']),
})
