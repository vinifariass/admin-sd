/*
  Warnings:

  - The primary key for the `Parking` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `carro` on the `Parking` table. All the data in the column will be lost.
  - The `id` column on the `Parking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `ParkingMoto` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `modelo` to the `Parking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `Parking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Parking" DROP CONSTRAINT "Parking_pkey",
DROP COLUMN "carro",
ADD COLUMN     "modelo" TEXT NOT NULL,
ADD COLUMN     "tipo" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Parking_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "ParkingMoto";
