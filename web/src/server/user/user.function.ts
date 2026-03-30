import { createServerFn } from '@tanstack/react-start'
import { get_InternalUserIdByTelegramUserId } from './user.server'

export const sf_get_UserIdFromTelegramId = createServerFn({ method: 'GET' })
  .inputValidator((data: { telegramId: number }) => data)
  .handler(async ({ data }) => {
    return await get_InternalUserIdByTelegramUserId(data.telegramId)
  })
