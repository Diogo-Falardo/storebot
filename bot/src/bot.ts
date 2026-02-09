import "dotenv/config";
import { Bot } from "grammy";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN missing");

const bot = new Bot(token); // bot token

bot.command("start", (ctx) => ctx.reply("Welcome! Up and running"));
bot.on("message", (ctx) => {
  const msg = ctx.message.text;
  ctx.reply(`${msg}`);
});

bot.start();
