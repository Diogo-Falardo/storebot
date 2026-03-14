import type { Conversation } from "@grammyjs/conversations";
import type { Context } from "grammy";
import { createStoreTgOnly, getTelegramUserInfo } from "./requests.js";

// create store conversation
export async function createStoreConversation(
  conversation: Conversation,
  ctx: Context,
) {
  const tgUserId = ctx.from!.id;
  const username = ctx.from?.username;

  const user = await getTelegramUserInfo(tgUserId);

  // If user already has a store
  if (user !== "no stores") {
    await ctx.reply(
      `👋 Hello${username ? ` ${username}` : ""}, you already have a store: ${user?.storeName}.\n\n` +
        "➤ Creating multiple stores is not supported yet.\n" +
        "More features will be available soon.",
    );
    return;
  }

  await ctx.reply(
    `👋 Welcome${username ? ` ${username}` : ""}!\n` +
      "Let's set up your store.\n\n" +
      "Please send the name you want for your store (1–50 characters).",
  );

  let shopName: string;

  while (true) {
    const { message } = await conversation.waitFor("message:text");
    shopName = String(message.text).trim();

    if (!shopName) {
      await ctx.reply("⚠️ Please send a valid store name.");
      continue;
    }
    if (shopName.charAt(0) === "/") {
      return;
    }
    if (shopName.length < 1 || shopName.length > 50) {
      await ctx.reply(
        "⚠️ Store name must be between 1 and 50 characters. Try again.",
      );
      continue;
    }
    break;
  }

  try {
    const result = await createStoreTgOnly(tgUserId, shopName);

    await ctx.reply(
      `✅ Your store has been created: <b>${result.shopName ?? shopName}</b>\n\n` +
        "Next steps:\n" +
        "• 📂 <b>/dashboard</b> – Manage your store (add products, edit settings, delete store, etc.)\n" +
        "• 🔓 <b>/activate</b> – Make your store visible to everyone\n\n" +
        "⚠️ Your store remains hidden until activation is completed.",
      { parse_mode: "HTML" },
    );
  } catch (err: any) {
    console.error(err);
    await ctx.reply(
      "❌ An error occurred while creating your store. Please try again later.\n" +
        (err.message ?? err),
    );
  }
}
