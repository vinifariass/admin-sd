import { insertFuncionarioSchema, insertMoradorSchema, insertParkingSchema } from "@/lib/validator";
import { z } from "zod";

export type Parking = z.infer<typeof insertParkingSchema> & { id: string };
export type Morador = z.infer<typeof insertMoradorSchema> & { id: string };
export type Funcionario = z.infer<typeof insertFuncionarioSchema> & { id: string };