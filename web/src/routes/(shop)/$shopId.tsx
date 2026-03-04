import { useServerFn } from '@tanstack/react-start'
import { createFileRoute } from '@tanstack/react-router'
import { Info, Package } from 'lucide-react'
import { useEffect, useState } from 'react'
import ErrorWrapper from '@/components/errorWrapper'
import { Spinner } from '@/components/ui/spinner'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
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
import { Button } from '@/components/ui/button'

import { usePublicShop } from '@/lib/hooks/shop/shop.hooks'
import { sf_PublicTelegramVerification } from '@/server/telegram/telegram.function'
import { Badge } from '@/components/ui/badge'
import { sf_ConvertCategoryIdIntoName } from '@/server/shop/products/category/productCategory.functions'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ProductInfo } from '@/components/shop/products/productInfo'

type TelegramUser = {
  telegramId: string
  firstName: string
  username: string
}

function ErrorComponent({ error }: { error: Error }) {
  return <ErrorWrapper errorTitle={error.message} errorDescription="" />
}

export const Route = createFileRoute('/(shop)/$shopId')({
  errorComponent: ErrorComponent,
  component: RouteComponent,
})

function RouteComponent() {
  const { shopId } = Route.useParams()
  const { data, isLoading } = usePublicShop({ shopId })
  const [user, setUser] = useState<TelegramUser | null>()
  const [error, setError] = useState<Error | null>(null)
  const [categoryNames, setCategoryNames] = useState<Record<string, string>>({})

  // server fn
  const verifyUser = useServerFn(sf_PublicTelegramVerification)
  const categoryName = useServerFn(sf_ConvertCategoryIdIntoName)

  useEffect(() => {
    const authenticate = async () => {
      try {
        // const { WebApp } = await import('@grammyjs/web-app')
        // WebApp.ready()

        // const initData = WebApp.initData
        // Example for mocking in your test
        const initData =
          'user=%7B%22id%22%3A7824653895%2C%22first_name%22%3A%22Test%22%2C%22last_name%22%3A%22User%22%2C%22username%22%3A%22testuser%22%2C%22language_code%22%3A%22en%22%7D&auth_date=1700000000&hash=FAKE_HASH'

        const tgUser = await verifyUser({ data: { initData } })

        setUser(tgUser)
      } catch (err: any) {
        setError(err ?? 'Error loading shop')
      }
    }
    authenticate()
  }, [])

  const visibleProducts =
    data?.products.filter((product) => product.visible === 1) ?? []

  useEffect(() => {
    const fetchCategoryNames = async () => {
      const names: Record<string, string> = {}
      for (const product of visibleProducts) {
        if (product.categoryId && !names[product.categoryId]) {
          names[product.categoryId] = await categoryName({
            data: { shopId, categoryId: product.categoryId },
          })
        }
      }
      setCategoryNames(names)
    }
    fetchCategoryNames()
  }, [visibleProducts])

  if (error) return <ErrorComponent error={error} />

  const PLACEHOLDER_IMG = 'https://placehold.co/400x300?text=No+Image'
  return (
    <div className="flex flex-col">
      {/* header - shop name */}
      <header className="flex justify-center items-center p-4 border-b">
        <h1 className="font-mono font-bold text-3xl">{data?.shop.shopName}</h1>
      </header>
      {/* products */}
      <main className="">
        {isLoading && (
          <div className="flex justify-center p-10">
            <Spinner />
            Loading your products
          </div>
        )}
        {!isLoading && data?.products && data.products.length > 0 ? (
          <div className="flex flex-col gap-4">
            <div className="flex justify-end p-4">
              <Cart />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 auto-rows-max">
              {visibleProducts.map((product) => (
                <Card
                  key={product.id}
                  onClick={() => console.log(product)}
                  className="relative mx-auto w-full max-w-sm pt-0"
                >
                  <img
                    src={product.imageUrl || PLACEHOLDER_IMG}
                    alt={product.productName}
                    className="
    w-full
    aspect-4/3       // Default: 4:3 aspect ratio
    sm:aspect-video    // On small screens and up: 16:9
    md:aspect-3/2     // On medium screens and up: 3:2
    object-cover
    brightness-80
    rounded-t-lg
  "
                  />
                  <CardHeader>
                    <CardTitle>{product.productName}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      {product.categoryId ? (
                        <Badge variant="outline" className="rounded-sm">
                          {categoryNames[product.categoryId]}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="rounded-sm opacity-0"
                        >
                          placeholder
                        </Badge>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-end">
                    <h1 className="flex gap-1">
                      {product.productPrice}
                      <span>{data.shop.shopCurrency}</span>
                    </h1>
                  </CardContent>
                  <CardFooter className="flex items-center justify-center sm:justify-end gap-2">
                    {/* more info external visualizer */}
                    <ProductInfo
                      productName={product.productName}
                      productDesc={product.productDesc}
                      productPrice={product.productPrice}
                      productCategory={
                        product.categoryId && categoryNames[product.categoryId]
                      }
                      productImage={product.imageUrl}
                      shopCurrency={data.shop.shopCurrency}
                    />
                    {/* add product to cart */}
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
