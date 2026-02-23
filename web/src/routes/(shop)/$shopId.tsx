import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { getTelegramInitData } from './_layout.dashboard.$id'
import { telegramVerification } from '@/server/telegram/telegram.function'
import { verifyTelegramUser } from '@/server/telegram/telegram.server'
import ErrorWrapper from '@/components/errorWrapper'
import { getNameByShopId } from '@/server/shop/shop.server'
import { getProductsFromShop } from '@/server/shop/products/products.server'
import { useGetShopProductsPublic } from '@/server/shop/products/product.hook'
import { Spinner } from '@/components/ui/spinner'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Package } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import CartAdd from '@/components/shop/cartAdd'
import Cart from '@/components/shop/cart'

const publicShopLoader = createServerFn({ method: 'GET' })
  .inputValidator((data: { shopId: string; initData?: string }) => data)
  .handler(async ({ data }) => {
    // if (!data.initData)
    //   throw new Error('What are you looking for couldnt be found')

    if (!data.shopId)
      throw new Error('What are you looking for couldnt be found')

    // accessing from telegram verification
    if (typeof data.initData === 'string' && data.initData.length > 0) {
      // gets tgUser Object
      const tgUser = verifyTelegramUser(data.initData)
      try {
        const shopName = await getNameByShopId(data.shopId)
        return { shopName: shopName, user: tgUser }
      } catch (err: any) {
        throw new Error(err.message)
      }
    }

    try {
      const shopInfo = await getNameByShopId(data.shopId)
      return { shopName: shopInfo }
    } catch (err: any) {
      throw new Error(err.message)
    }
  })

function errorComponent({ error }: { error: Error }) {
  return (
    <ErrorWrapper
      errorTitle={error.message}
      errorDescription="Shop not found"
    />
  )
}

export const Route = createFileRoute('/(shop)/$shopId')({
  loader: async ({ params }) => {
    return await publicShopLoader({
      data: { shopId: params.shopId, initData: getTelegramInitData() },
    })
  },
  errorComponent: errorComponent,
  component: RouteComponent,
})

function RouteComponent() {
  const shop = Route.useLoaderData()
  const { shopId } = Route.useParams()

  const { data, isLoading } = useGetShopProductsPublic({ shopId })

  const visibleProducts = data?.filter((product) => product.visible === 1) || []
  return (
    <div className="flex flex-col">
      {/* header - shop name */}
      <header className="flex justify-center items-center p-4 border-b">
        <h1 className="font-mono font-bold text-3xl">{shop.shopName}</h1>
      </header>
      {/* products */}
      <main className="">
        {isLoading && (
          <div className="flex justify-center p-10">
            <Spinner />
            Loading your products
          </div>
        )}
        {!isLoading && data && data.length > 0 ? (
          <div className="flex flex-col gap-4">
            <div className="flex justify-end p-2">
              <Cart shopId={shopId} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {visibleProducts.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle>{product.productName}</CardTitle>
                    <CardDescription>{product.productPrice}</CardDescription>
                  </CardHeader>
                  <CardContent></CardContent>
                  <CardFooter>
                    <CartAdd
                      productId={product.id}
                      productName={product.productName}
                      productPrice={product.productPrice}
                    />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant={'icon'}>
                <Package />
              </EmptyMedia>
              <EmptyTitle>No products</EmptyTitle>
              <EmptyDescription>This shop has no products</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </main>
    </div>
  )
}
