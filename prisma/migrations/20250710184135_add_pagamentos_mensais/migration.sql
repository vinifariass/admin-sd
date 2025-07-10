-- CreateEnum
CREATE TYPE "TipoPagamento" AS ENUM ('ALUGUEL', 'GAS', 'LUZ', 'AGUA', 'INTERNET', 'CONDOMINIO', 'OUTROS');

-- CreateTable
CREATE TABLE "pagamentos_mensais" (
    "id" TEXT NOT NULL,
    "moradorId" TEXT NOT NULL,
    "tipo" "TipoPagamento" NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "mesReferencia" INTEGER NOT NULL,
    "anoReferencia" INTEGER NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "pago" BOOLEAN NOT NULL DEFAULT false,
    "dataPagamento" TIMESTAMP(3),
    "comprovante" TEXT,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagamentos_mensais_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pagamentos_mensais_moradorId_tipo_mesReferencia_anoReferenc_key" ON "pagamentos_mensais"("moradorId", "tipo", "mesReferencia", "anoReferencia");

-- AddForeignKey
ALTER TABLE "pagamentos_mensais" ADD CONSTRAINT "pagamentos_mensais_moradorId_fkey" FOREIGN KEY ("moradorId") REFERENCES "Morador"("id") ON DELETE CASCADE ON UPDATE CASCADE;
