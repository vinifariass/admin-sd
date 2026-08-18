import cron from "node-cron";
import { getServicosDoDia } from "@/lib/db/servicos";
import { sendTelegramMessage } from "@/lib/telegram/telegram-message";
import { prisma } from "@/db/prisma";
import { isSameDay } from "date-fns";

function isHoje(dataVencimento: string | Date) {
  return isSameDay(new Date(), new Date(dataVencimento));
}

console.log("Iniciando o cron job para verificar serviços vencendo hoje.");
  cron.schedule("0 8 * * *", async () => {
    const hoje = new Date().toISOString().split("T")[0];
    console.log("Verificando serviços vencendo hoje:", hoje);
    const condominios = await prisma.condominio.findMany({ where: { ativo: true } });
    for (const condominio of condominios) {
      const servicos = await getServicosDoDia(hoje, condominio.id);
      const vencemHoje = servicos.filter((s) => isHoje(s.dataVencimento));
      console.log(`Serviços vencendo hoje em ${condominio.nome}:`, vencemHoje);
      if (vencemHoje.length > 0) {
        const lista = vencemHoje.map((s, i) => `${i + 1}. *${s.nomeServico}*`).join("\n");
        await sendTelegramMessage(`🏢 *${condominio.nome}*\n\n📌 *Serviços com vencimento hoje:*\n\n${lista}`, condominio.telegramChatId);
      } else {
        await sendTelegramMessage(`🏢 *${condominio.nome}*\n\n✅ Nenhum serviço vence hoje.`, condominio.telegramChatId);
      }
    }
  });
