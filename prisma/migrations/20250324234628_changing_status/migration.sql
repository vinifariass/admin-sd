/*
  Warnings:

  - The values [AGUARDANDO_RETIRADA,RETIRADO] on the enum `StatusPedido` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusPedido_new" AS ENUM ('ENTREGUE', 'DEVOLVIDO');
ALTER TABLE "encomendas" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "encomendas" ALTER COLUMN "status" TYPE "StatusPedido_new" USING ("status"::text::"StatusPedido_new");
ALTER TYPE "StatusPedido" RENAME TO "StatusPedido_old";
ALTER TYPE "StatusPedido_new" RENAME TO "StatusPedido";
DROP TYPE "StatusPedido_old";
ALTER TABLE "encomendas" ALTER COLUMN "status" SET DEFAULT 'ENTREGUE';
COMMIT;

-- AlterTable
ALTER TABLE "encomendas" ALTER COLUMN "status" SET DEFAULT 'ENTREGUE';
