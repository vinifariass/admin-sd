/*
  Warnings:

  - The `tipo` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Tipo" AS ENUM ('ADMIN', 'FUNCIONARIO', 'MORADOR');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "tipo",
ADD COLUMN     "tipo" "Tipo" NOT NULL DEFAULT 'MORADOR';

-- DropEnum
DROP TYPE "Role";
