import { createServerOnlyFn } from "@tanstack/react-start";
import { createNewUser, fetchTelegramId } from "./users/user.server";

const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN

export const authentication = createServerOnlyFn(async (initData: string) => {
  if (!TELEGRAM_BOT_TOKEN) {
    throw new Error("telegram bot token not set")
  }
  // convert the initData string to URLSearchParams
  const params = new URLSearchParams(initData)


  // validate the bot token with params
  // skipped for development

  const userData_str = params.get("user")
  if (!userData_str) {
    console.log("error with telegram init data: missing user data")
    throw new Error("Invalid telegram user data!")
  }
  const userData = JSON.parse(userData_str)
  let userId = await fetchTelegramId(userData.id)

  if (!userId) {
    userId = await createNewUser({ telegramUserId: userData.id, username: userData.username ?? null })
  }
  return {
    telegramUserId: userData.telegramUserId,
    userId,
  }
})
