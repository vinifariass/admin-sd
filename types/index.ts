import { insertServicoSchema, insertFuncionarioSchema, insertMoradorSchema, insertParkingSchema, insertGastoSchema } from "@/lib/validator";
import { z } from "zod";

export type Parking = z.infer<typeof insertParkingSchema> & { id: string };
export type Morador = z.infer<typeof insertMoradorSchema> & { id: string };
export type Funcionario = z.infer<typeof insertFuncionarioSchema> & { id: string };
export type Servico = z.infer<typeof insertServicoSchema> & { id: string };
export type Gasto = z.infer<typeof insertGastoSchema> & { id: string };