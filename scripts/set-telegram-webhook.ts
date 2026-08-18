import axios from "axios";
import "dotenv/config";

(async () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (!token || !webhookUrl) throw new Error("Configure TELEGRAM_BOT_TOKEN e TELEGRAM_WEBHOOK_URL");

  const response = await axios.post(`https://api.telegram.org/bot${token}/setWebhook`, {
    url: webhookUrl,
    ...(secret ? { secret_token: secret } : {}),
  });

  console.log(response.data);
})();
