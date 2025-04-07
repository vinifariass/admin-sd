import { NextResponse } from "next/server";
import { getServicosDoDia } from "@/lib/db/servicos";
import { sendTelegramMessage } from "@/lib/telegram/telegram-message";

function isHoje(data: string | Date) {
  const hojeStr = new Date().toISOString().split("T")[0];
  const dataStr = new Date(data).toISOString().split("T")[0];
  return hojeStr === dataStr;
}

export async function GET() {
  try {
    const hoje = new Date().toISOString().split("T")[0];
    const servicos = await getServicosDoDia(hoje);

    const vencemHoje = servicos.filter((s) => isHoje(s.dataVencimento));

    if (vencemHoje.length > 0) {
      const lista = vencemHoje
        .map((s, i) => `${i + 1}. *${s.nomeServico}*`)
        .join("\n");

      await sendTelegramMessage(`📅 *Serviços com vencimento hoje:*\n\n${lista}`);
    } else {
      await sendTelegramMessage("✅ Nenhum serviço vence hoje.");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro no cron:", error);
    return NextResponse.json({ success: false, error });
  }
}
