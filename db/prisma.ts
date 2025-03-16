import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

// Configurar WebSocket para funcionar corretamente no Neon Serverless
import { neonConfig, Pool } from "@neondatabase/serverless";
neonConfig.webSocketConstructor = ws;

// Criar a conexão com o banco de dados
const connectionString = process.env.DATABASE_URL!;

const pool = new Pool({ connectionString });

// Instanciar o Prisma Adapter usando o Neon Pool
const adapter = new PrismaNeon(pool);

export const prisma = new PrismaClient();