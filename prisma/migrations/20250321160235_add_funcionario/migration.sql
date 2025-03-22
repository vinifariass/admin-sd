-- CreateEnum
CREATE TYPE "StatusFuncionario" AS ENUM ('ATIVO', 'INATIVO', 'AFASTADO');

-- CreateTable
CREATE TABLE "funcionarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "salario" DOUBLE PRECISION NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "dataAdmissao" TIMESTAMP(3),
    "dataDemissao" TIMESTAMP(3),
    "endereco" TEXT,
    "departamento" TEXT,
    "status" "StatusFuncionario" DEFAULT 'ATIVO',
    "foto" TEXT,
    "pis" TEXT,
    "rg" TEXT,
    "dataNascimento" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "funcionarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "funcionario_cpf_idx" ON "funcionarios"("cpf");
