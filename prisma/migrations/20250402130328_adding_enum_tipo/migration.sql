/*
  Warnings:

  - Changed the type of `tipo` on the `Parking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TipoVeiculo" AS ENUM ('carro', 'moto');

-- AlterTable
ALTER TABLE "Parking" DROP COLUMN "tipo",
ADD COLUMN     "tipo" "TipoVeiculo" NOT NULL;
