-- AlterTable
ALTER TABLE "Morador" ADD COLUMN     "usuarioId" UUID;

-- AddForeignKey
ALTER TABLE "Morador" ADD CONSTRAINT "Morador_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
