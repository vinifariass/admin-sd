CREATE TABLE "Condominio" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telegramChatId" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Condominio_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Condominio_nome_key" ON "Condominio"("nome");

INSERT INTO "Condominio" ("id", "nome", "telegramChatId", "updatedAt")
VALUES (gen_random_uuid()::text, 'Condomínio padrão', 'CONFIGURE_CHAT_ID', CURRENT_TIMESTAMP);

ALTER TABLE "Recibo" ADD COLUMN "condominioId" TEXT;

UPDATE "Recibo"
SET "condominioId" = (SELECT "id" FROM "Condominio" WHERE "nome" = 'Condomínio padrão');

ALTER TABLE "Recibo" ALTER COLUMN "condominioId" SET NOT NULL;

CREATE INDEX "Recibo_condominioId_dataVencimento_idx" ON "Recibo"("condominioId", "dataVencimento");

ALTER TABLE "Recibo" ADD CONSTRAINT "Recibo_condominioId_fkey"
FOREIGN KEY ("condominioId") REFERENCES "Condominio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
