import "dotenv/config";
import { Bot, Context } from "grammy";
import {
  type ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import { createStoreConversation } from "./store/store.conversations.js";
import { userHasStore, me } from "./user/user.request.js";
import {
  getStoreExpireDate,
  getStoreInfoByStoreId,
} from "./store/store.request.js";
import { createPaymentLink } from "./payments/payments.request.js";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN missing");

const webUrl = process.env.WEB_URL;

const bot = new Bot<ConversationFlavor<Context>>(token);
bot.use(conversations());

// ---------------------
// store start command
bot.command("start", async (ctx) => {
  await ctx.reply(
    `🛒 <b>Welcome to StoreBot</b>

Create and manage your full digital store directly inside Telegram.

No websites. No monthly fees. No platform cuts — you keep 100% of every sale.

<b>Main Commands</b>
• /create — Create your store
• /dashboard — Open your management dashboard
• /mystore — Preview your store privately
• /share — Share your store in groups & channels
• /activate — Activate or extend your store
• /pricing — See activation prices
• /about — Learn how it works
• /terms — Terms & responsibilities

Want to see how it looks and explore more?
Visit our website: <a href="https://storebot.cc">storebot.cc</a>

Ready to start selling? Just type <b>/create</b> 👇`,
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

  const user = await me(tgUserId);
  const hasStore = await userHasStore(tgUserId);

  if (hasStore === "has no store") {
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
// call back to execute the generation of a payment link
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
  const user = await me(tgUserId);

  try {
    const hasStore = await userHasStore(tgUserId);

    if (hasStore === "has no store" || !user.storeId) {
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
// open store button
bot.command("mystore", async (ctx) => {
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
    const user = await me(tgUserId);
    const hasStore = await userHasStore(tgUserId);

    if (hasStore === "has no store" || !user.storeId) {
      return ctx.reply(
        "ℹ️ You don't have a store yet. Create one using /create.",
      );
    }

    const url = `${webUrl}/store/${user.storeId}`;

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
// Allows store owner to post a store button in a group or channel
bot.command("share", async (ctx) => {
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
    const user = await me(tgUserId);
    const hasStore = await userHasStore(tgUserId);

    if (hasStore === "has no store" || !user.storeId) {
      return ctx.reply(
        "ℹ️ You don't have a store yet. Create one using /create.",
      );
    }

    const deepLink = `https://t.me/usestorebot?openshop=shop_${user.storeId}`;

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
// open a store by id
async function handleStoreCommand(ctx: any, storeId: string) {
  const tgUserId = ctx.from?.id;
  if (!tgUserId) {
    return ctx.reply("⚠️ Unable to identify your account. Please try again.");
  }
  try {
    const id = storeId.split("store_")[1];

    if (!id) {
      return ctx.reply("❌ The store you are looking for was not found.");
    }

    const store = await getStoreInfoByStoreId(tgUserId, id);
    if (!store) {
      return ctx.reply("❌ The store you are looking for was not found.");
    }
    const storeUrl = `${webUrl}/store/${store.storeId}`;
    await ctx.reply(`🛒 Viewing store: <b>${store.storeName}</b>`, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Open Store", web_app: { url: storeUrl } }]],
      },
    });
  } catch (err) {
    return ctx.reply("❌ Something went wrong. Please try again later.");
  }
}

bot.command("store", async (ctx) => {
  if (ctx.chat.type !== "private") {
    return ctx.reply(
      "⚠️ This command is only available in a private chat. Please message me directly to continue.",
    );
  }

  const args = ctx.match?.toString().trim();
  if (!args) {
    return ctx.reply(
      "ℹ️ Please provide a valid store ID. Example: /store store_1234",
    );
  }
  await handleStoreCommand(ctx, args);
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
      { command: "create", description: "Create your store" },
      { command: "activate", description: "Activate or extend your store" },
      { command: "dashboard", description: "Open your store dashboard" },
      { command: "mystore", description: "Open your store privately" },
      {
        command: "share",
        description: "Share your store in groups/channels",
      },
      { command: "store", description: "Open any store by ID" },
      { command: "about", description: "Learn how Store Bot works" },
      { command: "terms", description: "Terms & responsibilities" },
      { command: "pricing", description: "View store activation pricing" },
    ]);

    console.log(`
BOT IS ON!
Bot started as @${botInfo.username}
by bloop
    `);
  },
});

bot.catch((err) => {
  console.error("Error in bot:", err);
  // Optionally, notify the user or perform other actions
});
