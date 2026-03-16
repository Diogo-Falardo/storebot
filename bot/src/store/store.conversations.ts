import type { Conversation } from "@grammyjs/conversations";
import { InlineKeyboard } from "grammy";
import type { Context } from "grammy";
import { me, userHasStore } from "../user/user.request.js";
import { createStore } from "./store.request.js";

// create store conversation
export async function createStoreConversation(
  conversation: Conversation,
  ctx: Context,
) {
  const tgUserId = ctx.from!.id;
  const username = ctx.from?.username;

  const hasStore = await userHasStore(tgUserId);

  // If user already has a store
  if (hasStore === "has a shop") {
    // returns the entire user info
    const EntireUser = await me(tgUserId);
    await ctx.reply(
      `👋 Hello${username ? ` ${username}` : ""}, you already have a store: ${EntireUser?.storeName}.\n\n` +
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

  // validate store name
  let storeName: string;
  while (true) {
    const { message } = await conversation.waitFor("message:text");
    storeName = String(message.text).trim();

    if (!storeName) {
      await ctx.reply("⚠️ Please send a valid store name.");
      continue;
    }
    if (storeName.charAt(0) === "/") {
      return;
    }
    if (storeName.length < 1 || storeName.length > 50) {
      await ctx.reply(
        "⚠️ Store name must be between 1 and 50 characters. Try again.",
      );
      continue;
    }
    break;
  }

  // user to choose store type
  const keyboard = new InlineKeyboard()
    .text("🌐 Public", "store_type_public")
    .text("🔒 Private", "store_type_private");

  await ctx.reply("Choose your store type:", { reply_markup: keyboard });

  // Wait for the user's button press
  let storeType: "public" | "private" | undefined;
  while (!storeType) {
    const { callbackQuery } = await conversation.waitFor("callback_query:data");
    if (callbackQuery.data === "store_type_public") {
      storeType = "public";
    } else if (callbackQuery.data === "store_type_private") {
      storeType = "private";
    } else {
      await ctx.reply("Please choose one of the options.");
      continue;
    }
    // Acknowledge the button press
    await ctx.answerCallbackQuery();
  }

  try {
    const result = await createStore(tgUserId, storeName, storeType);

    await ctx.reply(
      `✅ Your store has been created: <b>${storeName}</b>\n\n` +
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
