// cron-job.ts
import cron from "node-cron";
import axios from "axios";

const TELEGRAM_TOKEN = "8151134641:AAGPGyZ481UF4MQRfrE2hM6vX7NRm6EEtww";
const CHAT_ID = "6722350059";

export const sendTelegramMessage = async (message: string) => {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  console.log("Enviando mensagem para o Telegram:", message);
  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "Markdown",
    });
  } catch (error) {
    console.error("Erro ao enviar mensagem para o Telegram:", error);
  }
};
