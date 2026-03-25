import { createServerFn } from '@tanstack/react-start'
import { get_UserByTelegramUserId } from './user.server'

export const sf_get_UserIdFromTelegramId = createServerFn({ method: 'GET' })
  .inputValidator((data: { telegramId: number }) => data)
  .handler(async ({ data }) => {
    return await get_UserByTelegramUserId(data.telegramId)
  })
