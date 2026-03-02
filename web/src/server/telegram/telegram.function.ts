import { createServerFn } from '@tanstack/react-start'
import { verifyTelegram } from './telegram.server'

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
