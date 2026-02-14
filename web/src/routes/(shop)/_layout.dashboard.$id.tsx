import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getUserShopInfo } from '@/server/shop/shop.functions'
import { telegramVerification } from '@/server/telegram/telegram.function'
import { getOrCreateDbUser } from '@/server/user/user.function'

export function getTelegramInitData() {
  return (window as any)?.Telegram?.WebApp?.initData ?? ''
}

export const shopLoader = createServerFn({ method: 'GET' })
  .inputValidator((data: { shopId: string; initData?: string }) => data)
  .handler(async ({ data }) => {
    // if there is data
    if (typeof data.initData === 'string' && data.initData.length > 0) {
      // gets tgUser Object
      const tgUser = await telegramVerification({
        data: { initData: data.initData },
      })
      const uuidValidation = z.uuid().safeParse(tgUser.userId)
      if (uuidValidation.success) {
        // userId validated
        const userId = uuidValidation.data
        // shop info from telegram
        try {
          const shopInfo = await getUserShopInfo({
            data: { userId: userId, shopId: data.shopId },
          })
          return { userId: userId, shopInfo: shopInfo, error: null }
        } catch (err: any) {
          return { userId, shopInfo: null, error: err.message }
        }
      }
    }

    // clerk
    const userId = await getOrCreateDbUser()
    try {
      const shopInfo = await getUserShopInfo({
        data: { userId: userId, shopId: data.shopId },
      })
      return { userId: userId, shopInfo: shopInfo, error: null }
    } catch (err: any) {
      return { userId, shopInfo: null, error: err.message }
    }
  })

export const Route = createFileRoute('/(shop)/_layout/dashboard/$id')({
  loader: async ({ params }) => {
    return await shopLoader({
      data: { shopId: params.id, initData: getTelegramInitData() },
    })
  },

  component: RouteComponent,
})

function RouteComponent() {
  const { userId, shopInfo, error } = Route.useLoaderData()

  console.log(userId, shopInfo, error)
  return <div>Hello "/(shop)/dashboard/$id"!</div>
}
