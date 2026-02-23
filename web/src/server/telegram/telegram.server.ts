import { validateWebAppData } from '@grammyjs/validator'
import { getUserByTelegramUserId } from '../user/user.server'

const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN

/**
 * Verify Telegram
 * Grabs initData from tg
 * Validates the data
 * get the tg user id and converts it to db userId
 */
export async function verifyTelegram(initData: string) {
  if (!TELEGRAM_BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN not configured')
  }

  // convert the initData string to URLSearchParams
  const params = new URLSearchParams(initData)

  const isValid = validateWebAppData(TELEGRAM_BOT_TOKEN, params)

  if (!isValid) {
    throw new Error('Invalid Telegram initData: signature verification failed')
  }

  // user data
  const userDataStr = params.get('user')
  if (!userDataStr) {
    throw new Error('Invalid initData: missing user data')
  }

  const userData = JSON.parse(userDataStr)

  // convert the telegram id to the db user id
  const userId = await getUserByTelegramUserId(userData.id)

  if (!userId) {
    throw new Error('User not found')
  }

  return {
    telegramId: userData.id,
    userId,
    firstName: userData.first_name,
    username: userData.username,
  }
}

/**
 * This function is to check if the user that is going to use the shop is accessing from the telegram
 * @param initData
 */
export function verifyTelegramUser(initData: string) {
  if (!TELEGRAM_BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN not configured')
  }

  // convert the initData string to URLSearchParams
  const params = new URLSearchParams(initData)

  const isValid = validateWebAppData(TELEGRAM_BOT_TOKEN, params)

  if (!isValid) {
    throw new Error('Invalid Telegram initData: signature verification failed')
  }

  // user data
  const userDataStr = params.get('user')
  if (!userDataStr) {
    throw new Error('Invalid initData: missing user data')
  }

  const userData = JSON.parse(userDataStr)

  return {
    telegramId: userData.id,
    firstName: userData.first_name,
    username: userData.username,
  }
}
