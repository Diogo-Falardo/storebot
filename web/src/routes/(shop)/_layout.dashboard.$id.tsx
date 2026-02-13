import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getUserShopInfo } from '@/server/shop/shop.functions'
import { getOrCreateDbUser } from '@/server/user/user.server'

export function getTelegramInitData() {
  return (window as any)?.Telegram?.WebApp?.initData ?? ''
}

export const shopLoader = createServerFn({ method: 'GET' })
  .inputValidator((data: { shopId: string; tgInitData?: string }) => data)
  .handler(async ({ data }) => {
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
    return await shopLoader({ data: { shopId: params.id } })
  },

  component: RouteComponent,
})

function RouteComponent() {
  const { userId, shopInfo, error } = Route.useLoaderData()

  console.log(userId, shopInfo, error)
  return <div>Hello "/(shop)/dashboard/$id"!</div>
}
