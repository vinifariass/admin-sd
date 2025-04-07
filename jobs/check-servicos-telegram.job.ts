import cron from "node-cron";
import { getServicosDoDia } from "@/lib/db/servicos";
import { sendTelegramMessage } from "@/lib/telegram/telegram-message";
import { isSameDay } from "date-fns";

function isHoje(dataVencimento: string | Date) {
  return isSameDay(new Date(), new Date(dataVencimento));
}

console.log("Iniciando o cron job para verificar serviços vencendo hoje.");
  cron.schedule("0 8 * * *", async () => {
    const hoje = new Date().toISOString().split("T")[0];
    console.log("Verificando serviços vencendo hoje:", hoje);
    const servicos = await getServicosDoDia(hoje);
    const vencemHoje = servicos.filter((s) => isHoje(s.dataVencimento));
    console.log("Serviços vencendo hoje:", vencemHoje);
    if (vencemHoje.length > 0) {
      const lista = servicos.map((s, i) => `${i + 1}. *${s.nomeServico}*`).join("\n");

      await sendTelegramMessage(`📌 *Serviços com vencimento hoje:*\n\n${lista}`);
    } else {
      await sendTelegramMessage("✅ Nenhum serviço vence hoje.");
    }
  });

