-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'FUNCIONARIO', 'MORADOR');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "tipo" "Role" NOT NULL DEFAULT 'MORADOR';
