import { validateWebAppData } from '@grammyjs/validator'
import { get_UserByTelegramUserId } from '../user/user.server'

const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN

/**
 * Validates telegram init data
 * uses grammy to validate the web app data
 *
 * @param initData telegram init data
 * @returns object : {data}
 */
export async function validate_TelegramInitData(initData: string) {
  if (!TELEGRAM_BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN not configured')
  }

  // convert the initData string to URLSearchParams
  const params = new URLSearchParams(initData)

  // const isValid = validateWebAppData(TELEGRAM_BOT_TOKEN, params)

  // if (!isValid) {
  //   console.log(`
  //   ------------------------------
  //   ERROR VALIDATING TELEGRAM

  //   ERROR: Invalid Telegram initData: signature verification failed...
  //   ------------------------------
  //   `)
  //   throw new Error('Ups... store is only valid in telegram.')
  // }

  // user data
  const userDataStr = params.get('user')
  if (!userDataStr) {
    console.log(`
    ------------------------------
    ERROR VALIDATING TELEGRAM INIT DATA

    ERROR: Invalid initData: missing user data
   ------------------------------  
      `)
    throw new Error('Ups... invalid telegram user data.')
  }

  const userData = JSON.parse(userDataStr)

  // convert the telegram id into internal user id
  const userId = await get_UserByTelegramUserId(userData.id)

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
 * This function is to check if the user
 * that is going to use the store is accessing from the telegram
 * @param initData
 */
export function validate_ExternalTelegramUserInitData(initData: string) {
  if (!TELEGRAM_BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN not configured')
  }

  // convert the initData string to URLSearchParams
  const params = new URLSearchParams(initData)

  // const isValid = validateWebAppData(TELEGRAM_BOT_TOKEN, params)

  // if (!isValid) {
  //   console.log(`
  //   ------------------------------
  //   ERROR VALIDATING TELEGRAM

  //   ERROR: Invalid Telegram initData: signature verification failed...
  //   ------------------------------
  //   `)
  //   throw new Error('Ups... store is only valid in telegram.')
  // }

  // user data
  const userDataStr = params.get('user')

  if (!userDataStr) {
    console.log(`
    ------------------------------
    ERROR VALIDATING TELEGRAM INIT DATA

    ERROR: Invalid initData: missing user data
   ------------------------------  
      `)
    throw new Error('Ups... invalid telegram user data.')
  }

  const userData = JSON.parse(userDataStr)

  return {
    telegramId: userData.id,
    firstName: userData.first_name,
    username: userData.username,
  }
}
