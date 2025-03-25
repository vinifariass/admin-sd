-- CreateEnum
CREATE TYPE "StatusPedido" AS ENUM ('AGUARDANDO_RETIRADA', 'RETIRADO', 'DEVOLVIDO');

-- CreateTable
CREATE TABLE "encomendas" (
    "id" TEXT NOT NULL,
    "numeroPedido" TEXT NOT NULL,
    "moradorId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataEntrega" TIMESTAMP(3),
    "status" "StatusPedido" NOT NULL DEFAULT 'AGUARDANDO_RETIRADA',
    "assinado" BOOLEAN NOT NULL DEFAULT false,
    "assinadoPor" TEXT,
    "dataAssinatura" TIMESTAMP(3),

    CONSTRAINT "encomendas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "encomendas_numeroPedido_key" ON "encomendas"("numeroPedido");

-- AddForeignKey
ALTER TABLE "encomendas" ADD CONSTRAINT "encomendas_moradorId_fkey" FOREIGN KEY ("moradorId") REFERENCES "Morador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
