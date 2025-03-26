-- CreateTable
CREATE TABLE "Agendamento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "apartamento" TEXT NOT NULL,
    "horario" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agendamento_pkey" PRIMARY KEY ("id")
);
