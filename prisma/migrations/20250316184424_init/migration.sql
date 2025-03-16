-- CreateTable
CREATE TABLE "Parking" (
    "id" TEXT NOT NULL,
    "apartamento" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "carro" TEXT NOT NULL,
    "cor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Parking_pkey" PRIMARY KEY ("id")
);
