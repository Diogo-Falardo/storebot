import "dotenv/config";
import { Bot, Context, InlineKeyboard } from "grammy";
import {
  type Conversation,
  type ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import { createStoreConversation } from "./store/store.conversations.js";
import {
  createPaymentLink,
  getStoreExpireDate,
  getStoreInfoByStoreId,
  getTelegramUserInfo,
} from "./store/requests.js";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN missing");

const webUrl = process.env.WEB_URL;

const bot = new Bot<ConversationFlavor<Context>>(token);
bot.use(conversations());

// ---------------------
// store start command
bot.command("start", async (ctx) => {
  await ctx.reply(
    `🛒 <b>Welcome to Store Bot</b>

Create and manage your digital store directly inside Telegram.
Share your store with others!

<b>Main Commands</b>
• /pricing – View store activation pricing  
• /create – Create your store  
• /activate – Activate or extend your store  
• /dashboard – Open your store dashboard  
• /shop – Open your store privately  
• /setshop – Share your store in groups/channels  
• /openshop – Open any store by ID  
• /about – Learn how Store Bot works  
• /terms – Terms & responsibilities

Start by using <b>/create</b> to set up your store.`,
    { parse_mode: "HTML" },
  );
});

// ---------------------
// store pricing command
bot.command("pricing", async (ctx) => {
  await ctx.reply(
    `💳 <b>Store Activation Pricing</b>

Choose how long you want your store to stay active:

• 1 Day — €1.50  
• 1 Week — €5  
• 1 Month — €10  
• 3 Months — €25  
• 1 Year — €80

Use /activate to manage your store activation.`,
    { parse_mode: "HTML" },
  );
});

// ---------------------
// create a shop command
bot.use(createConversation(createStoreConversation));
bot.command("create", async (ctx) => {
  if (ctx.chat.type !== "private") {
    return ctx.reply(
      "⚠️ This command is only available in a private chat. Please message me directly to continue.",
    );
  }
  await ctx.conversation.enter("createStoreConversation");
});

// ---------------------
// activate store
bot.command("activate", async (ctx) => {
  if (ctx.chat.type !== "private") {
    return ctx.reply("⚠️ This command is only available in a private chat.");
  }

  const tgUserId = ctx.from?.id;
  if (!tgUserId) {
    return ctx.reply("⚠️ Unable to identify your account.");
  }

  const user = await getTelegramUserInfo(tgUserId);

  if (user === "no stores" || !user.storeId) {
    return ctx.reply(
      "ℹ️ You don't have a store yet. Use /create to set up your store.",
    );
  }

  const expireDate = await getStoreExpireDate(tgUserId, user.storeId);

  let msg = `<b>Your Store:</b> ${user.storeName}\n`;
  if (!expireDate) {
    msg += "⏳ Your store is not activated.\n";
  } else {
    msg += `✅ Store active until: <b>${expireDate}</b>\n`;
  }
  msg += "\nChoose a period to activate or extend:";

  await ctx.reply(msg, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Activate 1 Day (€1.50)", callback_data: "activate_1d" }],
        [{ text: "Activate 1 Week (€5)", callback_data: "activate_1w" }],
        [{ text: "Activate 1 Month (€10)", callback_data: "activate_1m" }],
        [{ text: "Activate 3 Months (€25)", callback_data: "activate_3m" }],
        [{ text: "Activate 1 Year (€80)", callback_data: "activate_1y" }],
      ],
    },
  });
});
bot.callbackQuery(/activate_(.*)/, async (ctx) => {
  const period = ctx.match?.[1];
  const telegramId = ctx.from.id.toString();
  if (!period || !telegramId) {
    return ctx.reply("❌ Invalid activation period or user.");
  }

  const payLink = await createPaymentLink(Number(telegramId), period);

  await ctx.reply(
    `💳 Click below to activate your store for <b>${period.toUpperCase()}</b>:\n${payLink}`,
    { parse_mode: "HTML" },
  );
});

// ---------------------
// open dashboard button
bot.command("dashboard", async (ctx) => {
  if (ctx.chat.type !== "private") {
    return ctx.reply(
      "⚠️ This command is only available in a private chat. Please message me directly to continue.",
    );
  }

  const tgUserId = ctx.from?.id;
  if (!tgUserId) {
    return ctx.reply("⚠️ Unable to identify your account. Please try again.");
  }

  try {
    const user = await getTelegramUserInfo(tgUserId);

    if (user === "no stores" || !user.storeId) {
      return ctx.reply(
        "ℹ️ You don't have a store yet. Create one using /create.",
      );
    }

    const dashboardUrl = `${webUrl}/dashboard/${user.storeId}`;

    await ctx.reply("📂 Open your store dashboard:", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Open Dashboard",
              web_app: { url: dashboardUrl },
            },
          ],
        ],
      },
    });
  } catch (err) {
    console.log(err);
    return ctx.reply("❌ Something went wrong. Please try again later.");
  }
});

// ---------------------
// open shop button
bot.command("shop", async (ctx) => {
  if (ctx.chat.type !== "private") {
    return ctx.reply(
      "⚠️ This command is only available in a private chat. Please message me directly to continue.",
    );
  }

  const tgUserId = ctx.from?.id;
  if (!tgUserId) {
    return ctx.reply("⚠️ Unable to identify your account. Please try again.");
  }

  try {
    const user = await getTelegramUserInfo(tgUserId);

    if (user === "no stores" || !user.storeId) {
      return ctx.reply(
        "ℹ️ You don't have a store yet. Create one using /create.",
      );
    }

    const url = `${webUrl}/${user.storeId}`;

    await ctx.reply("🛒 Open your store:", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Open Store",
              web_app: { url },
            },
          ],
        ],
      },
    });
  } catch (err) {
    console.log(err);
    return ctx.reply("❌ Something went wrong. Please try again later.");
  }
});

// ---------------------
// Allows shop owner to post a shop button in a group or channel
bot.command("setshop", async (ctx) => {
  if (
    ctx.chat.type !== "group" &&
    ctx.chat.type !== "supergroup" &&
    ctx.chat.type !== "channel"
  ) {
    return ctx.reply("⚠️ This command can only be used in groups or channels.");
  }

  const tgUserId = ctx.from?.id;
  if (!tgUserId) {
    return ctx.reply("⚠️ Unable to identify your account. Please try again.");
  }

  try {
    const user = await getTelegramUserInfo(tgUserId);

    if (user === "no stores" || !user.storeId) {
      return ctx.reply(
        "ℹ️ You don't have a store yet. Create one using /create.",
      );
    }

    const deepLink = `https://t.me/usestorebot?start=shop_${user.storeId}`;

    await ctx.reply(
      `🛒 <b>${user.storeName}</b>\n\n` + `Tap below to open my store`,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: user.storeName, url: deepLink }]],
        },
      },
    );
  } catch (err) {
    console.log(err);
    return ctx.reply("❌ Something went wrong. Please try again later.");
  }
});

// ---------------------
// open a shop by id button
bot.command("openshop", async (ctx) => {
  const tgUserId = ctx.from?.id;
  if (!tgUserId) {
    return ctx.reply("⚠️ Unable to identify your account. Please try again.");
  }

  const args = ctx.match?.toString().trim();
  if (!args || !args.startsWith("store_")) {
    return ctx.reply(
      "ℹ️ Please provide a valid store ID. Example: /openstore store_1234",
    );
  }

  const shopId = args.replace("store_", "");

  try {
    const store = await getStoreInfoByStoreId(tgUserId, shopId);

    if (!store) {
      return ctx.reply("❌ The store you are looking for was not found.");
    }

    const storeUrl = `${webUrl}/${shopId}`;

    await ctx.reply(`🛒 Viewing store: <b>${store.storeName}</b>`, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Open Store", web_app: { url: storeUrl } }]],
      },
    });
  } catch (err) {
    console.log(err);
    return ctx.reply("❌ Something went wrong. Please try again later.");
  }
});

// ---------------------
// about
bot.command("about", async (ctx) => {
  return ctx.reply(
    `ℹ️ <b>About Store Bot</b>

Store Bot allows you to create and manage your digital store directly inside Telegram.

For security reasons, Telegram only allows stores to be opened inside private chats.  
This ensures that your store is loaded with verified Telegram init data, preventing unauthorized access and protecting both store owners and customers.

Key features:
• Create and manage your store  
• Add and edit products  
• Share your store in groups and channels  
• Secure ordering through private chat  
• Dashboard for full store management

Use /create to start your store or /dashboard to manage it.`,
    { parse_mode: "HTML" },
  );
});

// ---------------------
// terms
bot.command("terms", async (ctx) => {
  return ctx.reply(
    `📄 <b>Terms & Responsibilities</b>

Store Bot is a platform that provides tools for creating and managing digital stores inside Telegram.

By using this service, you acknowledge and agree that:

• Store Bot is <b>not responsible</b> for the products sold by store owners.  
• Store Bot does <b>not verify</b> the legitimacy, quality, or safety of any items listed.  
• Store Bot is <b>not liable</b> for fraud, theft, disputes, or losses resulting from transactions between users.  
• Each store owner is fully responsible for the content they publish and for complying with applicable laws.  
• Store Bot only provides the technical infrastructure for store creation and management.

`,
    { parse_mode: "HTML" },
  );
});

bot.start({
  onStart: async (botInfo) => {
    await bot.api.setMyCommands([
      { command: "start", description: "Start the bot and view main menu" },
      { command: "pricing", description: "View store activation pricing" },
      { command: "create", description: "Create your store" },
      { command: "activate", description: "Activate or extend your store" },
      { command: "dashboard", description: "Open your store dashboard" },
      { command: "shop", description: "Open your store privately" },
      {
        command: "setshop",
        description: "Share your store in groups/channels",
      },
      { command: "openshop", description: "Open any store by ID" },
      { command: "about", description: "Learn how Store Bot works" },
      { command: "terms", description: "Terms & responsibilities" },
    ]);

    console.log(`
BOT IS ON!
Bot started as @${botInfo.username}
by bloop
    `);
  },
});
