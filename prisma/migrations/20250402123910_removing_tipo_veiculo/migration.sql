/*
  Warnings:

  - You are about to drop the column `moto` on the `Parking` table. All the data in the column will be lost.
  - You are about to drop the column `tipoVeiculo` on the `Parking` table. All the data in the column will be lost.
  - Made the column `carro` on table `Parking` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Parking" DROP COLUMN "moto",
DROP COLUMN "tipoVeiculo",
ALTER COLUMN "carro" SET NOT NULL;

-- DropEnum
DROP TYPE "TipoVeiculo";

-- CreateTable
CREATE TABLE "ParkingMoto" (
    "id" TEXT NOT NULL,
    "apartamento" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "moto" TEXT NOT NULL,
    "cor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cpf" TEXT NOT NULL,
    "tipoMorador" "TipoMorador" NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "ParkingMoto_pkey" PRIMARY KEY ("id")
);
