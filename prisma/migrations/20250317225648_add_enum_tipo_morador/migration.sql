/*
  Warnings:

  - Added the required column `cpf` to the `Parking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `Parking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoMorador` to the `Parking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoMorador" AS ENUM ('Proprietario', 'Inquilino');

-- AlterTable
ALTER TABLE "Parking" ADD COLUMN     "cpf" TEXT NOT NULL,
ADD COLUMN     "nome" TEXT NOT NULL,
ADD COLUMN     "tipoMorador" "TipoMorador" NOT NULL;

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
