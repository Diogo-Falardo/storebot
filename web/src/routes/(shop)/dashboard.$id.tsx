import { ClientOnly, Link, createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'
import { Package, ReceiptText } from 'lucide-react'
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
import ShopUpdate from '@/components/shop/shopUpdate'
import { useGetShopProducts } from '@/lib/hooks/shop/product.hook'
import { ModeToggle } from '@/components/mode-toggle'
import ShippingMethodAdd from '@/components/shop/shippingMethodAdd'
import PaymentMethodAdd from '@/components/shop/paymentMethodAdd'
import ProductCategoryAdd from '@/components/shop/products/productCategoryAdd'
import { useGetShopOrders } from '@/lib/hooks/order.hooks'
import OrderCardADM from '@/components/shop/orders/orderCard.admin'
import { ScrollArea } from '@/components/ui/scroll-area'

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

  const verifyTelegram = useServerFn(sf_telegramVerification)

  // auto renders
  useEffect(() => {
    const authenticate = async () => {
      try {
        // const { WebApp } = await import('@grammyjs/web-app')
        // WebApp.ready()

        // const initData = WebApp.initData

        // Example for mocking in your test
        const initData =
          'user=%7B%22id%22%3A7824653895%2C%22first_name%22%3A%22Test%22%2C%22last_name%22%3A%22User%22%2C%22username%22%3A%22testuser%22%2C%22language_code%22%3A%22en%22%7D&auth_date=1700000000&hash=FAKE_HASH'

        const user = await verifyTelegram({
          data: { initData: initData },
        })

        setUserId(user.userId)
      } catch (err: any) {
        console.error('Auth error:', err)
        setError(err ?? new Error('Authentication failed'))
      }
    }

    authenticate()
  }, [])

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

  const { data: orders, isLoading: ordersLoading } = useGetShopOrders({
    shopId,
  })

  if (error) return <DashboardErrorComponent error={error} />
  if (shopError) return <DashboardErrorComponent error={shopError} />
  if (!userId || shopLoading || !shopInfo || !userId) return <Spinner />

  return (
    <div className="h-screen flex flex-col">
      {/* header */}
      {/* following code should render the shop name, shop Update dialog and a theme toogler */}
      <header className="flex justify-center w-full p-3 border-b">
        <div className="w-full lg:max-w-7xl flex items-center justify-between">
          <Link to="/" className="select-none text-4xl font-bold tracking-wide">
            {shopInfo.shopName}
          </Link>
          <div className="flex items-center gap-3">
            {/* FIX: ---- */}
            {/* <ClientOnly>
                <ModeToggle />
              </ClientOnly> */}
            <ShopUpdate userId={shopInfo.userId} shopId={shopInfo.id} />
          </div>
        </div>
      </header>
      {/* container number 1 */}
      {/* the dashboard... */}
      <main className="w-full flex-1  min-h-0 p-3 flex justify-center">
        <Tabs defaultValue={'product'} className="flex-1 flex flex-col min-h-0">
          {/* tab swithcer to switch between products and orders */}
          <TabsList className="w-full rounded-sm">
            <TabsTrigger value="product" className="cursor-pointer ">
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="cursor-pointer">
              Orders
            </TabsTrigger>
          </TabsList>
          {/* page products */}
          <TabsContent
            value="product"
            className="flex-1 flex flex-col min-h-0 gap-3"
          >
            {/* container 1 */}
            {/* top actions */}
            <div className="flex justify-end gap-2">
              <ProductAdd userId={shopInfo.userId} shopId={shopInfo.id} />
              <ProductCategoryAdd shopId={shopInfo.id} />
            </div>
            {/* while products are loading */}
            {productsLoading && (
              <div>
                <Spinner />
                Loading your products
              </div>
            )}
            {/* container 2 */}
            {/* products render or empty */}
            <div className="flex-1 flex flex-col min-h-0">
              {!productsLoading && products && products.length > 0 ? (
                // products display gid
                <ScrollArea className="h-full">
                  <div className="flex flex-col h-full min-h-0">
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
                      {products
                        .slice()
                        .sort((a, b) => a.id.localeCompare(b.id))
                        .map((product) => (
                          <ProductCardADM
                            key={product.id}
                            {...product}
                            shopCurrency={shopInfo.shopCurrency}
                          />
                        ))}
                    </div>
                  </div>
                </ScrollArea>
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
                    <ProductAdd userId={shopInfo.userId} shopId={shopInfo.id} />
                  </EmptyContent>
                </Empty>
              )}
            </div>
          </TabsContent>
          {/* page orders */}
          <TabsContent
            value="orders"
            className="flex-1 flex flex-col min-h-0 gap-3"
          >
            {/* container 1 */}
            {/* top actions */}
            <div className="flex justify-end gap-2">
              <ShippingMethodAdd userId={userId} shopId={shopInfo.id} />
              <PaymentMethodAdd userId={userId} shopId={shopInfo.id} />
            </div>
            {/* while orders are loading */}
            {ordersLoading && (
              <div>
                <Spinner />
                Loading your orders
              </div>
            )}
            {/* container 2 */}
            {/* orders render or empty */}
            <div className="flex-1 flex flex-col min-h-0">
              {!ordersLoading && orders && orders.length > 0 ? (
                <ScrollArea className="h-full">
                  <div className="flex flex-col h-full min-h-0">
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
                      {orders.map((order) => (
                        <OrderCardADM
                          key={order.id}
                          shopId={shopId}
                          shopCurrency={shopInfo.shopCurrency}
                          order={order}
                        />
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              ) : (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant={'icon'}>
                      <ReceiptText />
                    </EmptyMedia>
                    <EmptyTitle>No orders for now</EmptyTitle>
                    <EmptyDescription>
                      Stay active and keep showcasing your products. Success
                      often begins with small steps.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
