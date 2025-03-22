-- CreateTable
CREATE TABLE "Recibo" (
    "id" TEXT NOT NULL,
    "nomeServico" TEXT NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recibo_pkey" PRIMARY KEY ("id")
);
