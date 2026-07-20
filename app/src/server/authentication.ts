import { createServerFn } from "@tanstack/react-start";
import { createNewUser, fetchTelegramId, updateLastLogin } from "./users/user.server";

// Used when real Telegram hash validation is re-enabled
// const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN

export const fake_INITDATA =
  "user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Test%22%2C%22last_name%22%3A%22User%22%2C%22username%22%3A%22testuser%22%2C%22language_code%22%3A%22en%22%7D&auth_date=1710000000&hash=dev-fake-hash-not-validated"

/**
 * fake init data for testing:
 *
 * user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Test%22%2C%22last_name%22%3A%22User%22%2C%22username%22%3A%22testuser%22%2C%22language_code%22%3A%22en%22%7D&auth_date=1710000000&hash=dev-fake-hash-not-validated
 */
export const authentication = createServerFn({ method: "POST" })
  .validator((initData: string) => initData)
  .handler(async ({ data: initData }) => {
    // convert the initData string to URLSearchParams
    const params = new URLSearchParams(initData)

    // validate the bot token with params
    // skipped for development

    const userData_str = params.get("user")
    if (!userData_str) {
      console.error("error with telegram init data: missing user data")
      throw new Error("Invalid telegram user data!")
    }

    const userData = JSON.parse(userData_str) as {
      id: number | string
      username?: string
    }

    // JSON.parse yields number/string; column is mode: "bigint" → always convert
    const telegramUserId = BigInt(userData.id)

    let userId = await fetchTelegramId(telegramUserId)

    if (!userId) {
      userId = await createNewUser({
        telegramUserId,
        username: userData.username ?? null,
      })
    }
    await updateLastLogin(userId, new Date())
    return {
      telegramUserId,
      userId,
    }
  })




