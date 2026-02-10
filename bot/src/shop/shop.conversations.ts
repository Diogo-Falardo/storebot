import type { Conversation } from "@grammyjs/conversations";
import type { Context } from "grammy";
import { createShopTgOnly } from "./shop.requests.js";

export async function createShopConversation(
  conversation: Conversation,
  ctx: Context,
) {
  const username = ctx.from?.username;
  await ctx.reply(
    `Hi${username ? ` ${username}` : ""}! Thanks for creating a shop with Kira.\n\n` +
      "What would you like to name your shop?\n" +
      "Reply with the name only.",
  );
  const { message } = await conversation.waitFor("message:text");
  let shopName = String(message.text).trim();

  if (!shopName) {
    await ctx.reply("No name received. Send /create to try again.");
    return;
  }
  while (shopName.length < 1 || shopName.length > 50) {
    await ctx.reply(
      "That name is too long. Please send a name between 1 and 50 characters.",
    );
    const { message } = await conversation.waitFor("message:text");
    shopName = String(message.text).trim();
  }

  try {
    const tgUserId = ctx.from!.id;

    const result = await createShopTgOnly(tgUserId, shopName);

    await ctx.reply(
      `Shop created: ${result.shopName ?? shopName}\n` +
        "Next step: activate it with /activate",
    );
  } catch (e: any) {
    await ctx.reply(`Failed to create shop.\n${e.message ?? e}`);
  }
}
