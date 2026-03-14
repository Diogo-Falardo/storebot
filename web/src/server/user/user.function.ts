import { createServerFn } from '@tanstack/react-start'
import { getUserByTelegramUserId } from './user.server'

export const sf_GetUserIdFromTelegramId = createServerFn({ method: 'GET' })
  .inputValidator((data: { telegramId: number }) => data)
  .handler(async ({ data }) => {
    return await getUserByTelegramUserId(data.telegramId)
  })
