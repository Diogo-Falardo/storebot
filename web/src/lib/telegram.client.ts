// Only runs on the client, returns undefined on the server
import { createClientOnlyFn } from '@tanstack/react-start'
import { WebApp } from '@grammyjs/web-app'

export const getTelegramInitData = createClientOnlyFn(() => {
  WebApp.ready()
  return WebApp.initData
})
