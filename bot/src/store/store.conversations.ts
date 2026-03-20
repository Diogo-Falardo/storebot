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
  console.log(hasStore);

  // If user already has a store
  if (hasStore === "has a store") {
    const EntireUser = await me(tgUserId);
    await ctx.reply(
      `👋 Hello${username ? ` ${username}` : ""}, you already have a store: <b>${EntireUser?.storeName}</b>.\n\n` +
        "➤ Creating multiple stores is not supported yet.\n" +
        "More features will be available soon.",
      { parse_mode: "HTML" },
    );
    return;
  }

  // ====================== TERMS AGREEMENT ======================
  await ctx.reply(
    `📄 Before we create your store, please read our <b>Terms & Responsibilities</b>.\n\n` +
      `By continuing, you confirm that you:\n` +
      `• Accept full responsibility for the products you sell\n` +
      `• Understand StoreBot is not liable for any disputes or losses\n` +
      `• Have read and agree to the full Terms\n\n` +
      `Do you accept the Terms & Responsibilities?`,
    {
      parse_mode: "HTML",
      reply_markup: new InlineKeyboard()
        .text("✅ Yes, I Accept", "accept_terms")
        .text("❌ Cancel", "cancel_create"),
    },
  );

  const response = await conversation.waitFor("callback_query:data");
  await response.answerCallbackQuery();

  if (response.callbackQuery.data === "cancel_create") {
    await ctx.reply(
      "Creation cancelled. You can try again anytime with /create.",
    );
    return;
  }

  if (response.callbackQuery.data === "accept_terms") {
    await ctx.reply("✅ Thank you! You have accepted the Terms.");
  } else {
    await ctx.reply("Please choose one of the options.");
    return;
  }

  // ====================== CONTINUE WITH STORE CREATION ======================

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
    if (storeName.charAt(0) === "/") return;
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

  let storeType: "public" | "private" | undefined;

  while (!storeType) {
    const response = await conversation.waitFor("callback_query:data");
    const data = response.callbackQuery.data;
    await response.answerCallbackQuery();

    if (data === "store_type_public") {
      storeType = "public";
    } else if (data === "store_type_private") {
      storeType = "private";
    } else {
      await ctx.reply("Please choose one of the options.");
      continue;
    }
  }

  try {
    await createStore(tgUserId, storeName, storeType);

    await ctx.reply(
      `✅ Your store has been created: <b>${storeName}</b>\n\n` +
        "Next steps:\n" +
        "• 📂 <b>/dashboard</b> – Manage your store\n" +
        "• 🔓 <b>/activate</b> – Activate your store so people can see it\n\n" +
        "⚠️ Your store remains hidden until you activate it.",
      { parse_mode: "HTML" },
    );
  } catch (err: any) {
    console.error(err);
    await ctx.reply(
      "❌ An error occurred while creating your store. Please try again later.",
    );
  }
}
