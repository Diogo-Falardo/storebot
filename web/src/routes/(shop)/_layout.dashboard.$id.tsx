import { z } from 'zod'
import { Link, createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getUserShopInfo } from '@/server/shop/shop.functions'
import { telegramVerification } from '@/server/telegram/telegram.function'
import ErrorWrapper from '@/components/errorWrapper'

export function getTelegramInitData() {
  if (typeof window === 'undefined') return ''
  return (window as any)?.Telegram?.WebApp?.initData ?? ''
}

export const shopLoader = createServerFn({ method: 'GET' })
  .inputValidator((data: { shopId: string; initData?: string }) => data)
  .handler(async ({ data }) => {
    // if (!data.initData)
    //   throw new Error('What are you looking for couldnt be found')

    if (!data.shopId)
      throw new Error('What are you looking for couldnt be found')

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
          return { shopInfo: shopInfo }
        } catch (err: any) {
          throw new Error(err.message)
        }
      }
    }
    try {
      const shopInfo = await getUserShopInfo({
        data: {
          userId: 'bf8d62b5-08f3-11f1-a9f8-644ed72189d4',
          shopId: data.shopId,
        },
      })
      return { shopInfo: shopInfo }
    } catch (err: any) {
      throw new Error(err.message)
    }
  })

function DashboardErrorComponent({ error }: { error: Error }) {
  return (
    <ErrorWrapper
      errorTitle={error.message}
      errorDescription="Probably this shop doesnt exist anymore!"
    />
  )
}

export const Route = createFileRoute('/(shop)/_layout/dashboard/$id')({
  loader: async ({ params }) => {
    return await shopLoader({
      data: { shopId: params.id, initData: getTelegramInitData() },
    })
  },
  errorComponent: DashboardErrorComponent,
  component: RouteComponent,
})

function RouteComponent() {
  const shopInfo = Route.useLoaderData()

  return <div>Hello "/(shop)/dashboard/$id"!</div>
}
