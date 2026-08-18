import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { sendTelegramMessage } from "@/lib/telegram/telegram-message";

type SessionData = { condominioId?: string; condominioIds?: string[]; serviceName?: string };

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "telegram-webhook",
    message: "Webhook online. O Telegram envia atualizações via POST.",
  });
}

const help = `🤖 *Tutorial do bot*

/novo_condominio - cadastrar condomínio nesta conversa
/novo_servico ou /novoservico - cadastrar serviço e data de vencimento
/listar - listar serviços cadastrados
/importar - instruções para importar planilha
/cancelar - cancelar o cadastro atual
/ajuda - mostrar este tutorial

Também é possível importar vários serviços pela planilha na área administrativa.`;

function adminChatIds() {
  return (process.env.TELEGRAM_ADMIN_CHAT_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

function parseDate(text: string) {
  const match = text.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/) || text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!match) return null;

  const [year, month, day] = match[1].length === 4
    ? [Number(match[1]), Number(match[2]), Number(match[3])]
    : [Number(match[3]), Number(match[2]), Number(match[1])];
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : null;
}

async function setSession(chatId: string, state: string, data: SessionData, lastUpdateId?: number) {
  await prisma.telegramSession.upsert({
    where: { chatId },
    create: { chatId, state, data, lastUpdateId },
    update: { state, data, ...(lastUpdateId === undefined ? {} : { lastUpdateId }) },
  });
}

async function reply(chatId: string, text: string) {
  await sendTelegramMessage(text, chatId);
}

export async function POST(request: NextRequest) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret && request.headers.get("x-telegram-bot-api-secret-token") !== secret) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  try {
    const update = await request.json();
    const message = update?.message;
    const chatId = message?.chat?.id == null ? "" : String(message.chat.id);
    const text = typeof message?.text === "string" ? message.text.trim() : "";
    if (!chatId || !text) return NextResponse.json({ success: true });

    const current = await prisma.telegramSession.findUnique({ where: { chatId } });
    if (current?.lastUpdateId != null && Number(update.update_id) <= current.lastUpdateId) {
      return NextResponse.json({ success: true, duplicate: true });
    }

    const admin = adminChatIds().includes(chatId);
    const linkedCondo = await prisma.condominio.findFirst({ where: { telegramChatId: chatId, ativo: true } });
    const authorized = admin || Boolean(linkedCondo);
    const state = current?.state || "IDLE";
    const data = (current?.data || {}) as SessionData;
    const commandToken = text.toLowerCase().split(/\s+/)[0];
    const command = commandToken === "/novoservico" ? "/novo_servico"
      : commandToken === "/novocondominio" ? "/novo_condominio"
      : commandToken;

    if (command === "/start" || command === "/ajuda" || command === "/help") {
      await reply(chatId, help);
      await setSession(chatId, "IDLE", {}, update.update_id);
      return NextResponse.json({ success: true });
    }

    if (command === "/cancelar") {
      await reply(chatId, "Cadastro cancelado. Use /ajuda para ver os comandos.");
      await setSession(chatId, "IDLE", {}, update.update_id);
      return NextResponse.json({ success: true });
    }

    if (!authorized) {
      await reply(chatId, "Este chat ainda não está autorizado. Um administrador precisa cadastrar este Chat ID no sistema.");
      await setSession(chatId, "IDLE", {}, update.update_id);
      return NextResponse.json({ success: true });
    }

    if (command === "/novo_condominio") {
      if (!admin) { await reply(chatId, "Somente um Chat ID de administrador pode cadastrar condomínios."); return NextResponse.json({ success: true }); }
      await reply(chatId, "Digite o nome do condomínio:");
      await setSession(chatId, "NEW_CONDO_NAME", {}, update.update_id);
      return NextResponse.json({ success: true });
    }

    if (command === "/novo_servico") {
      const condos = admin
        ? await prisma.condominio.findMany({ where: { ativo: true }, orderBy: { nome: "asc" } })
        : linkedCondo ? [linkedCondo] : [];
      if (condos.length === 0) { await reply(chatId, "Nenhum condomínio disponível. Use /novo_condominio primeiro."); return NextResponse.json({ success: true }); }
      const inline = text.slice(commandToken.length).trim();
      const inlineMatch = inline.match(/^(.+?)\s+(\d{1,2}[\/-]\d{1,2}[\/-]\d{4}|\d{4}-\d{1,2}-\d{1,2})$/);
      if (inlineMatch && condos.length === 1) {
        const serviceName = inlineMatch[1].trim();
        const date = parseDate(inlineMatch[2]);
        if (!date) { await reply(chatId, "Data inválida. Use DD/MM/AAAA, por exemplo 25/12/2026."); return NextResponse.json({ success: true }); }
        const existing = await prisma.recibo.findFirst({ where: { condominioId: condos[0].id, nomeServico: serviceName, dataVencimento: date } });
        if (existing) await reply(chatId, "Esse serviço já está cadastrado para essa data.");
        else {
          await prisma.recibo.create({ data: { condominioId: condos[0].id, nomeServico: serviceName, dataVencimento: date } });
          await reply(chatId, `✅ Serviço *${serviceName}* cadastrado para ${date.toLocaleDateString("pt-BR")}.`);
        }
        await setSession(chatId, "IDLE", {}, update.update_id);
        return NextResponse.json({ success: true });
      }
      if (condos.length === 1) {
        await reply(chatId, `Condomínio: *${condos[0].nome}*\nDigite o nome do serviço e depois a data.\nExemplo: Limpeza da piscina\nDepois: 25/12/2026`);
        await setSession(chatId, "SERVICE_NAME", { condominioId: condos[0].id }, update.update_id);
      } else {
        await reply(chatId, `Escolha o condomínio digitando o número:\n${condos.map((c, i) => `${i + 1}. ${c.nome}`).join("\n")}`);
        await setSession(chatId, "SELECT_CONDO", { condominioIds: condos.map((c) => c.id) }, update.update_id);
      }
      return NextResponse.json({ success: true });
    }

    if (command === "/listar") {
      const condos = admin ? await prisma.condominio.findMany({ where: { ativo: true } }) : linkedCondo ? [linkedCondo] : [];
      const lines: string[] = [];
      for (const condo of condos) {
        const services = await prisma.recibo.findMany({ where: { condominioId: condo.id }, orderBy: { dataVencimento: "asc" }, take: 20 });
        lines.push(`🏢 *${condo.nome}*\n${services.length ? services.map((s) => `• ${s.nomeServico} — ${s.dataVencimento.toLocaleDateString("pt-BR")}`).join("\n") : "Nenhum serviço cadastrado."}`);
      }
      await reply(chatId, lines.join("\n\n") || "Nenhum condomínio cadastrado.");
      await setSession(chatId, "IDLE", {}, update.update_id);
      return NextResponse.json({ success: true });
    }

    if (command === "/importar") {
      await reply(chatId, "📄 Para importar vários serviços: acesse a área administrativa, abra Serviços > Criar Serviços, selecione o condomínio e envie um arquivo .xlsx ou .xls com as colunas Serviço e Data.");
      await setSession(chatId, "IDLE", {}, update.update_id);
      return NextResponse.json({ success: true });
    }

    if (state === "NEW_CONDO_NAME") {
      const name = text.trim();
      if (!name) { await reply(chatId, "Digite um nome válido ou use /cancelar."); return NextResponse.json({ success: true }); }
      const total = await prisma.condominio.count();
      if (total >= 10) { await reply(chatId, "O limite de 10 condomínios foi atingido."); await setSession(chatId, "IDLE", {}, update.update_id); return NextResponse.json({ success: true }); }
      const condo = await prisma.condominio.create({ data: { nome: name, telegramChatId: chatId } });
      await reply(chatId, `✅ Condomínio *${condo.nome}* cadastrado nesta conversa.\nUse /novo_servico para adicionar um serviço.`);
      await setSession(chatId, "IDLE", {}, update.update_id);
      return NextResponse.json({ success: true });
    }

    if (state === "SELECT_CONDO") {
      const index = Number(text) - 1;
      const condoId = data.condominioIds?.[index];
      if (!condoId) { await reply(chatId, "Número inválido. Escolha um dos números da lista ou use /cancelar."); return NextResponse.json({ success: true }); }
      await reply(chatId, "Digite o nome do serviço:");
      await setSession(chatId, "SERVICE_NAME", { condominioId: condoId }, update.update_id);
      return NextResponse.json({ success: true });
    }

    if (state === "SERVICE_NAME" && data.condominioId) {
      await reply(chatId, "Digite a data de vencimento no formato DD/MM/AAAA:");
      await setSession(chatId, "SERVICE_DATE", { condominioId: data.condominioId, serviceName: text }, update.update_id);
      return NextResponse.json({ success: true });
    }

    if (state === "SERVICE_DATE" && data.condominioId && data.serviceName) {
      const date = parseDate(text);
      if (!date) { await reply(chatId, "Data inválida. Use DD/MM/AAAA, por exemplo 25/12/2026."); return NextResponse.json({ success: true }); }
      const serviceName = data.serviceName;
      const existing = await prisma.recibo.findFirst({ where: { condominioId: data.condominioId, nomeServico: serviceName, dataVencimento: date } });
      if (existing) { await reply(chatId, "Esse serviço já está cadastrado para essa data."); }
      else { await prisma.recibo.create({ data: { condominioId: data.condominioId, nomeServico: serviceName, dataVencimento: date } }); await reply(chatId, `✅ Serviço *${serviceName}* cadastrado para ${date.toLocaleDateString("pt-BR")}.`); }
      await setSession(chatId, "IDLE", {}, update.update_id);
      return NextResponse.json({ success: true });
    }

    await reply(chatId, "Não entendi. Use /ajuda para ver o tutorial.");
    await setSession(chatId, "IDLE", {}, update.update_id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro no webhook do Telegram:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
