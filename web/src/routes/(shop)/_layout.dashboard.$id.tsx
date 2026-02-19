import { z } from 'zod'
import { Link, createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getUserShopInfo } from '@/server/shop/shop.functions'
import { telegramVerification } from '@/server/telegram/telegram.function'
import ErrorWrapper from '@/components/errorWrapper'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useGetShopProducts } from '@/server/shop/products/product.hook'
import { Spinner } from '@/components/ui/spinner'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Package } from 'lucide-react'
import ProductAdd from '@/components/shop/products/productAdd'

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
      console
      const shopInfo = await getUserShopInfo({
        data: {
          userId: 'bf8d62b5-08f3-11f1-a9f8-644ed72189d4',
          shopId: data.shopId,
        },
      })

      console.log(shopInfo)

      if (typeof shopInfo === 'undefined') {
        throw new Error('sry')
      }

      return { shopInfo: shopInfo }
    } catch (err: any) {
      throw new Error(err.message)
    }
  })

export function DashboardErrorComponent({ error }: { error: Error }) {
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
  const { shopInfo } = Route.useLoaderData()
  console.error(shopInfo)

  const { userId, id: shopId } = shopInfo

  const { data, isLoading } = useGetShopProducts({ userId, shopId })

  if (data) {
    console.log(data)
  }

  return (
    <div className="w-full lg:max-w-7xl flex items-center justify-between">
      <Tabs defaultValue={'product'} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="product" className="cursor-pointer">
            Products
          </TabsTrigger>
          <TabsTrigger value="orders" className="cursor-pointer">
            Orders
          </TabsTrigger>
        </TabsList>
        <TabsContent value="product">
          <div className="w-full h-full p-4">
            {/* while products are loading */}
            {isLoading && (
              <div>
                <Spinner />
                Loading your products
              </div>
            )}
            {data && data.length > 0 ? (
              <div></div>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant={'icon'}>
                    <Package />
                  </EmptyMedia>
                  <EmptyTitle>No products yet</EmptyTitle>
                  <EmptyDescription>
                    You haven&apos;t inserted any product yet. Add your first
                    product
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <ProductAdd userId={userId} shopId={shopId} />
                </EmptyContent>
              </Empty>
            )}
          </div>
        </TabsContent>
        <TabsContent value="orders"></TabsContent>
      </Tabs>
    </div>
  )
}
