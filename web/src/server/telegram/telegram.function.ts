import { createServerFn } from '@tanstack/react-start'
import { verifyTelegram, verifyTelegramUser } from './telegram.server'

/**
 * "GET"
 * validates the tg init data
 *
 * required: telegram init data
 */
export const sf_telegramVerification = createServerFn({ method: 'GET' })
  .inputValidator((data: { initData: string }) => data)
  .handler(async ({ data }) => {
    return await verifyTelegram(data.initData)
  })

/**
 * "GET"
 * validates the tg init data that cames from a public user
 *
 * required: telegram init data
 *  */

export const sf_PublicTelegramVerification = createServerFn({ method: 'GET' })
  .inputValidator((data: { initData: string }) => data)
  .handler(({ data }) => {
    return verifyTelegramUser(data.initData)
  })
