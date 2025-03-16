import { insertParkingSchema } from "@/lib/validator";
import { z } from "zod";

export type Parking = z.infer<typeof insertParkingSchema> & { id: string };