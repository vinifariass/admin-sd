CREATE TABLE "TelegramSession" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'IDLE',
    "data" JSONB NOT NULL DEFAULT '{}',
    "lastUpdateId" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TelegramSession_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TelegramSession_chatId_key" ON "TelegramSession"("chatId");
