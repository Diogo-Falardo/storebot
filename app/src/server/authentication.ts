import jwt from "jsonwebtoken"
import { setCookie, getCookie } from "@tanstack/react-start/server"
import { createServerFn } from "@tanstack/react-start";

import { createNewUser, fetchTelegramId, fetchUser, updateLastLogin } from "./users/user.server";
import { createShop } from "./shops/shops.server";

// Used when real Telegram hash validation is re-enabled
// const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN

export const FAKE_INITDATA =
  "user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Test%22%2C%22last_name%22%3A%22User%22%2C%22username%22%3A%22testuser%22%2C%22language_code%22%3A%22en%22%7D&auth_date=1710000000&hash=dev-fake-hash-not-validated"

/**
 * fake init data for testing:
 *
 * user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Test%22%2C%22last_name%22%3A%22User%22%2C%22username%22%3A%22testuser%22%2C%22language_code%22%3A%22en%22%7D&auth_date=1710000000&hash=dev-fake-hash-not-validated
 */

export const authentication = createServerFn({ method: "POST" })
  .validator((initData: string) => initData)
  .handler(async ({ data: initData }): Promise<string> => {
    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error("JWT_SECRET missing")


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
      await createShop(userId)
    }

    await updateLastLogin(userId, new Date())

    const token = jwt.sign({
      sub: userId
    }, secret, { expiresIn: "1h", algorithm: "HS256" })

    setCookie('tg_session', token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    })

    return "ok"
  })

export const verifyAuthenticationToken = createServerFn().handler(async (): Promise<string> => {
  const token = getCookie("tg_session")
  if (!token) throw new Error("Unauthorized")

  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error("JWT_SECRET missing")

  try {
    const payload = jwt.verify(token, secret, { algorithms: ["HS256"] }) as jwt.JwtPayload

    const userId = payload.sub

    if (!userId || typeof userId !== "string") {
      throw new Error("Unauthorized")
    }

    // checkIfUserActuallyExists
    await fetchUser(userId)

    return userId
  } catch {
    throw new Error("Unauthorized")
  }
})


