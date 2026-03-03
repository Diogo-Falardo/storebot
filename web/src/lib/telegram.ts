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
    // This only runs on client, so window is safe here
    const init = () => {
      if (typeof window === 'undefined') return

      const tg = (window as any).Telegram?.WebApp

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
    if ((window as any).Telegram?.WebApp) {
      init()
    } else {
      // Wait for the script to load
      window.addEventListener('load', init)
      const timeout = setTimeout(init, 1000)

      return () => {
        window.removeEventListener('load', init)
        clearTimeout(timeout)
      }
    }
  }, [])

  return data
}
