import { Link, createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'
import { Package } from 'lucide-react'
import { useGetUserShopInfo } from '@/lib/hooks/shop/shop.hooks'
import { sf_telegramVerification } from '@/server/telegram/telegram.function'
import ErrorWrapper from '@/components/errorWrapper'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Spinner } from '@/components/ui/spinner'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import ProductAdd from '@/components/shop/products/productAdd'
import ProductCardADM from '@/components/shop/products/productCard.admin'
import ProductCategory from '@/components/shop/products/productCategory'
import ShopUpdate from '@/components/shop/shopUpdate'
import { useGetShopProducts } from '@/lib/hooks/shop/product.hook'
import { useTelegramWebApp } from '@/lib/telegram'

function DashboardErrorComponent({ error }: { error: Error }) {
  return <ErrorWrapper errorTitle={error.message} errorDescription={''} />
}

export const Route = createFileRoute('/(shop)/dashboard/$id')({
  errorComponent: DashboardErrorComponent,
  component: RouteComponent,
})

function RouteComponent() {
  // shopId
  const { id: shopId } = Route.useParams()
  // shop data
  const [userId, setUserId] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isAuthenticating, setIsAuthenticating] = useState(true)

  const telegram = useTelegramWebApp()
  const verifyTelegram = useServerFn(sf_telegramVerification)

  // auto renders
  useEffect(() => {
    // Wait for Telegram hook to be ready
    if (!telegram.isReady) return

    const authenticate = async () => {
      try {
        if (telegram.error) {
          throw new Error(telegram.error)
        }

        if (!telegram.initData) {
          throw new Error('No initData available. Open this app from Telegram.')
        }

        const user = await verifyTelegram({
          data: { initData: telegram.initData },
        })

        setUserId(user.userId)
      } catch (err: any) {
        console.error('Auth error:', err)
        setError(err ?? new Error('Authentication failed'))
      } finally {
        setIsAuthenticating(false)
      }
    }

    authenticate()
  }, [telegram.isReady, telegram.initData, telegram.error])

  const {
    data: shopInfo,
    isLoading: shopLoading,
    error: shopError,
  } = useGetUserShopInfo({
    userId: userId ?? '',
    shopId,
  })

  const { data: products, isLoading: productsLoading } = useGetShopProducts(
    shopInfo
      ? { userId: shopInfo.userId, shopId: shopInfo.id }
      : { userId: '', shopId: '' },
  )

  // Show loading while Telegram SDK initializes or authenticating
  if (!telegram.isReady || isAuthenticating) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <Spinner />
        <p>Connecting to Telegram...</p>
      </div>
    )
  }

  if (error) return <DashboardErrorComponent error={error} />
  if (shopError) return <DashboardErrorComponent error={shopError} />
  if (!userId || shopLoading || !shopInfo || !userId) return <Spinner />

  return (
    <div className="min-h-screen flex flex-col">
      {/* header */}
      <header className="p-4 max-h-20">
        <nav className="w-full flex justify-center">
          <div className="w-full lg:max-w-7xl flex items-center justify-between">
            <Link
              to="/"
              className="select-none text-4xl font-bold tracking-wide"
            >
              {shopInfo.shopName}
            </Link>
            <div className="flex items-center gap-3">
              <ShopUpdate userId={shopInfo.userId} shopId={shopInfo.id} />
            </div>
          </div>
        </nav>
      </header>
      {/* body */}
      <main className="p-6 w-full flex flex-1 overflow-auto justify-center">
        <div className="w-full lg:max-w-7xl flex justify-between">
          <Tabs defaultValue={'product'} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="product" className="cursor-pointer">
                Products
              </TabsTrigger>
              <TabsTrigger value="orders" className="cursor-pointer">
                Orders
              </TabsTrigger>
            </TabsList>
            {/* page products */}
            <TabsContent value="product">
              <div className="w-full h-full p-4">
                {/* while products are loading */}
                {productsLoading && (
                  <div>
                    <Spinner />
                    Loading your products
                  </div>
                )}
                {!productsLoading && products && products.length > 0 ? (
                  <div className="flex flex-col gap-5">
                    <div className="flex justify-end gap-2">
                      <ProductAdd
                        userId={shopInfo.userId}
                        shopId={shopInfo.id}
                      />
                      <ProductCategory shopId={shopInfo.id} />
                    </div>
                    {/* products display grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products.map((product) => (
                        <ProductCardADM key={product.id} {...product} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant={'icon'}>
                        <Package />
                      </EmptyMedia>
                      <EmptyTitle>No products yet</EmptyTitle>
                      <EmptyDescription>
                        You haven&apos;t inserted any product yet. Add your
                        first product
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <ProductAdd
                        userId={shopInfo.userId}
                        shopId={shopInfo.id}
                      />
                    </EmptyContent>
                  </Empty>
                )}
              </div>
            </TabsContent>
            <TabsContent value="orders"></TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
