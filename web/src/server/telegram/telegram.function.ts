import { createServerFn } from '@tanstack/react-start'
import {
  validate_ExternalTelegramUserInitData,
  validate_TelegramInitData,
} from './telegram.server'

export const sf_validate_TelegramInitData = createServerFn({ method: 'GET' })
  .inputValidator((data: { initData: string }) => data)
  .handler(async ({ data }) => {
    return await validate_TelegramInitData(data.initData)
  })

export const sf_validate_ExternalTelegramUserInitData = createServerFn({
  method: 'GET',
})
  .inputValidator((data: { initData: string }) => data)
  .handler(({ data }) => {
    return validate_ExternalTelegramUserInitData(data.initData)
  })
