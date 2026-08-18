import { NextResponse } from "next/server";
import { getServicosDoDia } from "@/lib/db/servicos";
import { sendTelegramMessage } from "@/lib/telegram/telegram-message";
import { prisma } from "@/db/prisma";

function isHoje(data: string | Date) {
  const hojeStr = new Date().toISOString().split("T")[0];
  const dataStr = new Date(data).toISOString().split("T")[0];
  return hojeStr === dataStr;
}

export async function GET() {
  try {
    const hoje = new Date().toISOString().split("T")[0];
    const condominios = await prisma.condominio.findMany({ where: { ativo: true } });

    for (const condominio of condominios) {
      const servicos = await getServicosDoDia(hoje, condominio.id);
      const vencemHoje = servicos.filter((s) => isHoje(s.dataVencimento));
      const prefixo = `🏢 *${condominio.nome}*\n\n`;

      if (vencemHoje.length > 0) {
        const lista = vencemHoje.map((s, i) => `${i + 1}. *${s.nomeServico}*`).join("\n");
        await sendTelegramMessage(`${prefixo}📅 *Serviços com vencimento hoje:*\n\n${lista}`, condominio.telegramChatId);
      } else {
        await sendTelegramMessage(`${prefixo}✅ Nenhum serviço vence hoje.`, condominio.telegramChatId);
      }
    }

    return NextResponse.json({ success: true, condominiosProcessados: condominios.length });
  } catch (error) {
    console.error("Erro no cron:", error);
    return NextResponse.json({ success: false, error });
  }
}
