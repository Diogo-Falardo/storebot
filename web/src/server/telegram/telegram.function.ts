import { createServerFn } from '@tanstack/react-start'
import {
  validateExternalTelegramUserInitData,
  validateTelegramInitData,
} from './telegram.server'

export const sf_validateTelegramInitData = createServerFn({ method: 'GET' })
  .inputValidator((data: { initData: string }) => data)
  .handler(async ({ data }) => {
    return await validateTelegramInitData(data.initData)
  })

export const sf_validateExternalTelegramUserInitData = createServerFn({
  method: 'GET',
})
  .inputValidator((data: { initData: string }) => data)
  .handler(({ data }) => {
    return validateExternalTelegramUserInitData(data.initData)
  })
