import { WebApp } from '@grammyjs/web-app'

/**
 * Get Telegram initData (CLIENT-SIDE ONLY)
 */
export function getTelegramInitData(): string {
  const initData = WebApp.initData

  if (!initData || initData.length === 0) {
    throw new Error('Please open this app from Telegram')
  }

  return initData
}

/**
 * Tell Telegram the app is ready (CLIENT-SIDE ONLY)
 */
export function initTelegram() {
  WebApp.ready()
}
