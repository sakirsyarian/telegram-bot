// File: api/webhook.js
const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");

dotenv.config();

const bot = new TelegramBot(process.env.BOT_TOKEN);

// Set webhook
bot.setWebHook(`${process.env.VERCEL_URL}/api/webhook`);

// Command handler for /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Selamat datang! Saya adalah bot Telegram Anda.");
});

// Command handler for /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Ini adalah pesan bantuan. Anda dapat menggunakan perintah berikut:\n/start - Memulai bot\n/help - Menampilkan pesan bantuan"
  );
});

// Group message handler
bot.on("message", (msg) => {
  if (msg.chat.type === "group" || msg.chat.type === "supergroup") {
    const chatId = msg.chat.id;
    if (msg.text && !msg.text.startsWith("/")) {
      bot.sendMessage(chatId, `@${msg.from.username} mengatakan: ${msg.text}`);
    }
  }
});

// Error handler
bot.on("polling_error", (error) => {
  console.error(error);
});

module.exports = async (req, res) => {
  if (req.method === "POST") {
    const { body } = req;
    await bot.processUpdate(body);
    res.status(200).json({ message: "OK" });
  } else {
    res.status(200).json({ message: "Bot is running!" });
  }
};
