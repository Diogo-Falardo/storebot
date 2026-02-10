import type { Conversation } from "@grammyjs/conversations";
import type { Context } from "grammy";
import { createShopTgOnly } from "./shop.requests.js";

export async function createShopConversation(
  conversation: Conversation,
  ctx: Context,
) {
  const username = ctx.from?.username;
  await ctx.reply(
    `Hi${username ? ` ${username}` : ""}, thank you for creating a bot with Kira\n\n`,
  );
  await ctx.reply(
    "What is your new shop name? \n" + "Please only right the name of it\n",
  );
  const { message } = await conversation.waitFor("message:text");
  let shopName = String(message.text).trim();

  if (!shopName) {
    await ctx.reply("Aborted no name was given!");
    return;
  }
  while (shopName.length < 1 || shopName.length > 50) {
    await ctx.reply("Your shop name must have between 1 and 50 letters!");
    const { message } = await conversation.waitFor("message:text");
    shopName = String(message.text).trim();
  }

  try {
    const tgUserId = ctx.from!.id;

    console.log(shopName);
    const result = await createShopTgOnly(tgUserId, shopName);

    console.log(result);
    await ctx.reply(
      `✅ Shop created: ${result.shopName ?? shopName}\n` +
        "Dont forget to activate it. /activate!",
    );
  } catch (e: any) {
    await ctx.reply(`❌ Failed to create shop.\n${e.message ?? e}`);
  }
}
