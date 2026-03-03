// // Only runs on the client, returns undefined on the server
// import { createClientOnlyFn } from '@tanstack/react-start'
// import { WebApp } from '@grammyjs/web-app'

// export const getTelegramInitData = createClientOnlyFn(() => {
//   WebApp.ready()
//   return WebApp.initData
// })

import { useEffect, useState } from 'react'

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

interface TelegramWebAppData {
  initData: string
  initDataUnsafe: {
    user?: TelegramUser
    auth_date?: number
    hash?: string
    query_id?: string
  }
  isReady: boolean
  error: string | null
}

export function useTelegramWebApp(): TelegramWebAppData {
  const [data, setData] = useState<TelegramWebAppData>({
    initData: '',
    initDataUnsafe: {},
    isReady: false,
    error: null,
  })

  useEffect(() => {
    // Wait for DOM and Telegram SDK to be fully loaded
    const init = () => {
      const tg = window.Telegram?.WebApp

      if (!tg) {
        setData((prev) => ({
          ...prev,
          isReady: true,
          error: 'Not running inside Telegram',
        }))
        return
      }

      // Signal to Telegram that the app is ready
      tg.ready()

      // Small delay to ensure initData is populated
      setTimeout(() => {
        setData({
          initData: tg.initData || '',
          initDataUnsafe: tg.initDataUnsafe || {},
          isReady: true,
          error: tg.initData ? null : 'initData is empty',
        })
      }, 100)
    }

    // Check if script is already loaded
    if (window.Telegram?.WebApp) {
      init()
    } else {
      // Wait for the script to load
      window.addEventListener('load', init)
      // Also try after a delay in case load already fired
      const timeout = setTimeout(init, 1000)

      return () => {
        window.removeEventListener('load', init)
        clearTimeout(timeout)
      }
    }
  }, [])

  return data
}
