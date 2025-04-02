/*
  Warnings:

  - The primary key for the `Parking` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Parking" DROP CONSTRAINT "Parking_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Parking_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Parking_id_seq";
