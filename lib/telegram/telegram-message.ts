import axios from "axios";

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export const sendTelegramMessage = async (message: string, chatId: string) => {
  if (!TELEGRAM_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN não configurado");
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  console.log(`Enviando mensagem para o Telegram (${chatId}):`, message);
  try {
    await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    });
  } catch (error) {
    console.error("Erro ao enviar mensagem para o Telegram:", error);
    throw error;
  }
};
