-- CreateTable
CREATE TABLE "Boleto" (
    "id" TEXT NOT NULL,
    "numeroBoleto" TEXT NOT NULL,
    "codigoBarras" TEXT NOT NULL,
    "apartamento" TEXT NOT NULL,
    "moradorId" TEXT,
    "valor" DOUBLE PRECISION NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "dataPagamento" TIMESTAMP(3),
    "pago" BOOLEAN NOT NULL DEFAULT false,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Boleto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Boleto_numeroBoleto_key" ON "Boleto"("numeroBoleto");

-- CreateIndex
CREATE UNIQUE INDEX "Boleto_codigoBarras_key" ON "Boleto"("codigoBarras");

-- AddForeignKey
ALTER TABLE "Boleto" ADD CONSTRAINT "Boleto_moradorId_fkey" FOREIGN KEY ("moradorId") REFERENCES "Morador"("id") ON DELETE SET NULL ON UPDATE CASCADE;
