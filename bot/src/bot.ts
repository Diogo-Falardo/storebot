import "dotenv/config";
import { Bot, Context, InlineKeyboard } from "grammy";
import {
  type Conversation,
  type ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import { createShopConversation } from "./shop/shop.conversations.js";
import { getTelegramUserInfo } from "./shop/requests.js";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN missing");

const webUrl = process.env.WEB_URL;

const bot = new Bot<ConversationFlavor<Context>>(token);
bot.use(conversations());

// ------------------------------------------------------
// START COMMAND
// start dialog
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

// ------------------------------------------------------
// CREATE SHOP COMMAND
// command for shop creation: executes a "conversation"
bot.use(createConversation(createShopConversation));
bot.command("create", async (ctx) => {
  await ctx.conversation.enter("createShopConversation");
});

// ------------------------------------------------------
// OPEN DASHBOARD COMMAND
// add shop dashboard button to the chat conversation
bot.command("dashboard", async (ctx) => {
  const tgUserId = ctx.from?.id;
  if (!tgUserId) {
    return ctx.reply("Unable to identify you. Please try again.");
  }

  try {
    const user = await getTelegramUserInfo(tgUserId);
    if (user === "no shops" || !user.shopId) {
      return ctx.reply(
        "You don't have a shop yet. Please create one first with /create.",
      );
    }

    const dashboardUrl = `${webUrl}/dashboard/${user.shopId}`;

    console.log(dashboardUrl);
    console.log("ID:" + user.shopId);

    await ctx.reply("Click to open your shop dashboard:", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Open Shop Dashboard",
              web_app: { url: dashboardUrl },
            },
          ],
        ],
      },
    });
  } catch (err: any) {
    console.log(err);
    return await ctx.reply(
      "Sorry, something went wrong. Please try again later.",
    );
  }
});

bot.start();
