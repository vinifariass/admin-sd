-- CreateEnum
CREATE TYPE "TipoVeiculo" AS ENUM ('CARRO', 'MOTO');

-- AlterTable
ALTER TABLE "Parking" ADD COLUMN     "moto" TEXT,
ADD COLUMN     "tipoVeiculo" "TipoVeiculo" NOT NULL DEFAULT 'CARRO',
ALTER COLUMN "carro" DROP NOT NULL;
