// helper functions for telegram

export function getTelegramInitData() {
  if (typeof window === 'undefined') return ''
  return (window as any)?.Telegram?.WebApp?.initData ?? ''
  // fake data for test
  //   return 'user={"id":7824653895,"first_name":"Test","last_name":"User","username":"testuser"}'
}
