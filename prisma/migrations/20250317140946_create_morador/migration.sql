-- CreateTable
CREATE TABLE "Morador" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "apartamento" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "dataLocacao" TIMESTAMP(3) NOT NULL,
    "dataSaida" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Morador_pkey" PRIMARY KEY ("id")
);
