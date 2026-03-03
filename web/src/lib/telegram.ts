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
  debug: string
}

export function useTelegramWebApp(): TelegramWebAppData {
  const [data, setData] = useState<TelegramWebAppData>({
    initData: '',
    initDataUnsafe: {},
    isReady: false,
    error: null,
    debug: 'initializing...',
  })

  useEffect(() => {
    const debugInfo: string[] = []

    const init = () => {
      if (typeof window === 'undefined') {
        debugInfo.push('window is undefined (SSR)')
        return
      }

      debugInfo.push(`window.Telegram exists: ${!!window.Telegram}`)
      debugInfo.push(
        `window.Telegram.WebApp exists: ${!!window.Telegram?.WebApp}`,
      )

      const tg = (window as any).Telegram?.WebApp

      if (!tg) {
        setData({
          initData: '',
          initDataUnsafe: {},
          isReady: true,
          error: 'Telegram WebApp not found',
          debug: debugInfo.join('\n'),
        })
        return
      }

      // Call ready FIRST
      tg.ready()
      debugInfo.push('Called tg.ready()')

      // Log ALL available properties
      debugInfo.push(`platform: ${tg.platform}`)
      debugInfo.push(`version: ${tg.version}`)
      debugInfo.push(`initData length: ${tg.initData?.length || 0}`)
      debugInfo.push(`initData: "${tg.initData || 'EMPTY'}"`)
      debugInfo.push(
        `initDataUnsafe: ${JSON.stringify(tg.initDataUnsafe || {})}`,
      )
      debugInfo.push(`colorScheme: ${tg.colorScheme}`)
      debugInfo.push(`themeParams: ${JSON.stringify(tg.themeParams || {})}`)

      // Check if we're actually in a Mini App context
      if (tg.platform === 'unknown') {
        debugInfo.push('WARNING: platform is unknown - not running as Mini App')
      }

      setData({
        initData: tg.initData || '',
        initDataUnsafe: tg.initDataUnsafe || {},
        isReady: true,
        error: tg.initData
          ? null
          : 'initData is empty - opened outside Mini App context',
        debug: debugInfo.join('\n'),
      })
    }

    // Try multiple times with increasing delays
    const attempts = [0, 100, 500, 1000, 2000]
    const timeouts: NodeJS.Timeout[] = []

    attempts.forEach((delay) => {
      const timeout = setTimeout(() => {
        if (!data.initData) {
          init()
        }
      }, delay)
      timeouts.push(timeout)
    })

    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [])

  return data
}
