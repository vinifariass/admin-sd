import { insertServicoSchema, insertFuncionarioSchema, insertMoradorSchema, insertParkingSchema, insertGastoSchema, insertVisitanteSchema, insertNotificacaoSchema, insertBoletoSchema } from "@/lib/validator";
import { z } from "zod";
import { User } from "@prisma/client";

export type Parking = z.infer<typeof insertParkingSchema> & { id: string };
export type Morador = z.infer<typeof insertMoradorSchema> & { 
    id: string;
    createdAt: Date;
};
export type Funcionario = z.infer<typeof insertFuncionarioSchema> & { id: string };
export type Servico = z.infer<typeof insertServicoSchema> & { id: string };
export type Gasto = z.infer<typeof insertGastoSchema> & { id: string };
export type Visitante = z.infer<typeof insertVisitanteSchema> & { id: string };
export type Notificacao = z.infer<typeof insertNotificacaoSchema> & { id: string; createdAt: Date; updatedAt: Date; lida: boolean };
export type Boleto = z.infer<typeof insertBoletoSchema> & { id: string; createdAt: Date; updatedAt: Date };

// Tipo para usuário com moradores associados
export type UserWithMoradores = User & {
    moradores: {
        id: string;
        nome: string;
        apartamento: string;
        cpf: string;
    }[];
};