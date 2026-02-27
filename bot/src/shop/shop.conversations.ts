import type { Conversation } from "@grammyjs/conversations";
import type { Context } from "grammy";
import { getTelegramUserInfo, createShopTgOnly } from "./requests.js";

export async function createShopConversation(
  conversation: Conversation,
  ctx: Context,
) {
  // verify if user has already a shop created
  const tgUserId = ctx.from!.id;
  const username = ctx.from?.username;

  const user = await getTelegramUserInfo(tgUserId);

  console.log(user);

  if (user !== "0") {
    await ctx.reply(
      `Hello${username ? ` ${username}` : ""}, you already have a shop: ${user.shopName}.\n\n` +
        "Currently, creating multiple shops is not supported. Stay tuned for future updates!",
    );
    return;
  }

  await ctx.reply(
    `Welcome${username ? ` ${username}` : ""}!\nThank you for choosing Kira to create your shop.\n\n` +
      "Please reply with your desired shop name (1–50 characters).",
  );

  let shopName: string;
  // while name is not correct
  while (true) {
    const { message } = await conversation.waitFor("message:text");
    shopName = String(message.text).trim();

    if (!shopName) {
      await ctx.reply("No name received. Please send your shop name.");
      continue;
    }
    if (shopName.length < 1 || shopName.length > 50) {
      await ctx.reply(
        "Shop name must be between 1 and 50 characters. Please try again.",
      );
      continue;
    }
    break;
  }

  try {
    const result = await createShopTgOnly(tgUserId, shopName);

    await ctx.reply(
      `Shop created: ${result.shopName ?? shopName}\n` +
        "Next step: activate it with /activate",
    );
  } catch (err: any) {
    console.error(err);
    await ctx.reply(
      "An error occurred while creating your shop. Please try again later.\n" +
        (err.message ?? err),
    );
  }
}
