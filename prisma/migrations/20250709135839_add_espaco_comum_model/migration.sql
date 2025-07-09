-- CreateEnum
CREATE TYPE "TipoAcesso" AS ENUM ('VISITANTE', 'PRESTADOR_SERVICO', 'DELIVERY', 'MORADOR', 'FUNCIONARIO');

-- CreateEnum
CREATE TYPE "StatusAcesso" AS ENUM ('AGENDADO', 'APROVADO', 'NEGADO', 'EXPIRADO', 'UTILIZADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "StatusReserva" AS ENUM ('PENDENTE', 'APROVADA', 'REJEITADA', 'CANCELADA', 'REALIZADA');

-- CreateTable
CREATE TABLE "acesso_portaria" (
    "id" TEXT NOT NULL,
    "tipo" "TipoAcesso" NOT NULL DEFAULT 'VISITANTE',
    "nomeVisitante" TEXT,
    "cpfVisitante" TEXT,
    "telefone" TEXT,
    "apartamento" TEXT NOT NULL,
    "moradorId" TEXT,
    "dataVisita" TIMESTAMP(3) NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFim" TEXT,
    "observacoes" TEXT,
    "status" "StatusAcesso" NOT NULL DEFAULT 'AGENDADO',
    "qrCode" TEXT,
    "codigoAcesso" TEXT,
    "liberadoPor" TEXT,
    "dataLiberacao" TIMESTAMP(3),
    "entradaEfetuada" BOOLEAN NOT NULL DEFAULT false,
    "horaEntrada" TIMESTAMP(3),
    "validoAte" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "acesso_portaria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "espacos_comuns" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "capacidade" INTEGER,
    "preco" DOUBLE PRECISION DEFAULT 0,
    "tempoMinimo" INTEGER DEFAULT 2,
    "tempoMaximo" INTEGER DEFAULT 8,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "observacoes" TEXT,
    "imagens" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "equipamentos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "regras" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "espacos_comuns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas_espacos" (
    "id" TEXT NOT NULL,
    "espacoId" TEXT NOT NULL,
    "moradorId" TEXT NOT NULL,
    "dataReserva" TIMESTAMP(3) NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFim" TEXT NOT NULL,
    "valorTotal" DOUBLE PRECISION DEFAULT 0,
    "status" "StatusReserva" NOT NULL DEFAULT 'PENDENTE',
    "observacoes" TEXT,
    "convidados" INTEGER DEFAULT 0,
    "telefoneContato" TEXT,
    "eventoPrincipal" TEXT,
    "equipamentos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "servicosExtras" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "aprovadoPor" TEXT,
    "dataAprovacao" TIMESTAMP(3),
    "motivoCancelamento" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservas_espacos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "acesso_portaria_qrCode_key" ON "acesso_portaria"("qrCode");

-- CreateIndex
CREATE UNIQUE INDEX "acesso_portaria_codigoAcesso_key" ON "acesso_portaria"("codigoAcesso");

-- AddForeignKey
ALTER TABLE "acesso_portaria" ADD CONSTRAINT "acesso_portaria_moradorId_fkey" FOREIGN KEY ("moradorId") REFERENCES "Morador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas_espacos" ADD CONSTRAINT "reservas_espacos_espacoId_fkey" FOREIGN KEY ("espacoId") REFERENCES "espacos_comuns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas_espacos" ADD CONSTRAINT "reservas_espacos_moradorId_fkey" FOREIGN KEY ("moradorId") REFERENCES "Morador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
