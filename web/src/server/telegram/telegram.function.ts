import { createServerFn } from '@tanstack/react-start'
import { verifyTelegram } from './telegram.server'

export const telegramVerification = createServerFn({ method: 'GET' })
  .inputValidator((data: { initData: string }) => data)
  .handler(async ({ data }) => {
    return await verifyTelegram(data.initData)
  })
