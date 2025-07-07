-- CreateTable
CREATE TABLE "Visitante" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "telefone" TEXT,
    "email" TEXT,
    "apartamento" TEXT NOT NULL,
    "dataVisita" TIMESTAMP(3) NOT NULL,
    "horario" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AGENDADO',
    "observacoes" TEXT,
    "autorizado" BOOLEAN NOT NULL DEFAULT false,
    "autorizadoPor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visitante_pkey" PRIMARY KEY ("id")
);
