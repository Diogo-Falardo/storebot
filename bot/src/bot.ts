import "dotenv/config";
import { Bot, Context } from "grammy";
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
bot.use(conversations()); // bot token

bot.command("start", (ctx) => ctx.reply("Welcome! Up and running"));

// create bot
bot.use(createConversation(createShopConversation));
bot.command("create", async (ctx) => {
  await ctx.conversation.enter("createShopConversation");
});

bot.start();
