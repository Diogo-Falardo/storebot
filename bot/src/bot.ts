import "dotenv/config";
import { Bot, Context, InlineKeyboard } from "grammy";
import {
  type Conversation,
  type ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import { createShopConversation } from "./shop/shop.conversations.js";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN missing");

const api = process.env.API_URL;

const bot = new Bot<ConversationFlavor<Context>>(token);
bot.use(conversations());

bot.command("start", (ctx) =>
  ctx.reply(
    `Welcome to Kira Bot!

Kira Bot helps you create and manage your Telegram shop in seconds.

Version: v1.0

Available Commands:
/create – Set up your personal Telegram shop.
/addDashboard – Add your dashboard to the bot channel.
/addShop – Integrate a shop into your Telegram channel.

Website: kira.com
For version details, visit: kira/versions

If you need assistance, feel free to reach out.`,
  ),
);

// create shop
bot.use(createConversation(createShopConversation));
bot.command("create", async (ctx) => {
  await ctx.conversation.enter("createShopConversation");
});

// add shop dashboard button to the chat conversation
bot.command("shopDashboard", async (ctx) => {
  const shopUrl =
    "http://localhost:3000/dashboard/76ec1804-0792-11f1-a9f8-644ed72189d4";

  const keyboard = new InlineKeyboard().webApp("Shop Dashboard", shopUrl);

  await ctx.reply("Tap to open the shop:", {
    reply_markup: keyboard,
  });
});

bot.start();
