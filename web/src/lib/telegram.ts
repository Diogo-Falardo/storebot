// helper functions for telegram

/**
 * Wait for Telegram WebApp to be available
 */
function waitForTelegram(maxWaitMs = 3000): Promise<boolean> {
  return new Promise((resolve) => {
    // Already available
    if ((window as any)?.Telegram?.WebApp?.initData) {
      resolve(true)
      return
    }

    const startTime = Date.now()

    const check = () => {
      const webApp = (window as any)?.Telegram?.WebApp

      if (webApp?.initData && webApp.initData.length > 0) {
        resolve(true)
        return
      }

      if (Date.now() - startTime > maxWaitMs) {
        resolve(false)
        return
      }

      requestAnimationFrame(check)
    }

    // Start checking on next frame
    requestAnimationFrame(check)
  })
}

/**
 * Initialize Telegram WebApp and get initData
 */
export async function getTelegramInitData(): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('Not in browser')
  }

  // Wait for Telegram to be ready
  const isReady = await waitForTelegram(3000)

  const webApp = (window as any)?.Telegram?.WebApp

  // Debug logging - remove in production
  console.log('[Telegram Debug]', {
    telegramExists: !!(window as any)?.Telegram,
    webAppExists: !!webApp,
    initData: webApp?.initData,
    initDataLength: webApp?.initData?.length,
    platform: webApp?.platform,
    version: webApp?.version,
  })

  if (!isReady || !webApp) {
    throw new Error(
      'Telegram WebApp not available. Open this app from Telegram.',
    )
  }

  // Tell Telegram we're ready
  if (webApp.ready) {
    webApp.ready()
  }

  const initData = webApp.initData

  if (!initData || initData.length === 0) {
    throw new Error(
      'No initData received from Telegram. Make sure you open this from a Telegram bot.',
    )
  }

  return initData
}

/**
 * Sync version for cases where you've already waited
 */
export function getTelegramInitDataSync(): string {
  if (typeof window === 'undefined') return ''
  return (window as any)?.Telegram?.WebApp?.initData ?? ''
}
