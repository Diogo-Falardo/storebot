import { ClientOnly, Link, createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'
import { Package, ReceiptText } from 'lucide-react'
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

import { useGetstoreOrders } from '@/lib/hooks/order.hooks'

import { ScrollArea } from '@/components/ui/scroll-area'
import StoreUpdate from '@/components/shop/storeUpdate'
import OrderCardADM from '@/components/shop/orders/orderCard.admin'
import PaymentMethodAdd from '@/components/shop/paymentMethodAdd'
import ShippingMethodAdd from '@/components/shop/shippingMethodAdd'
import ProductAdd from '@/components/shop/products/productAdd'
import ProductCardADM from '@/components/shop/products/productCard.admin'
import ProductCategoryAdd from '@/components/shop/products/productCategoryAdd'
import { useGetstoreProducts } from '@/lib/hooks/shop/product.hook'
import { useGetUserstoreInfo } from '@/lib/hooks/shop/store.hooks'

function DashboardErrorComponent({ error }: { error: Error }) {
  return <ErrorWrapper errorTitle={error.message} errorDescription={''} />
}

export const Route = createFileRoute('/(store)/dashboard/$id')({
  errorComponent: DashboardErrorComponent,
  component: RouteComponent,
})

function RouteComponent() {
  // storeId
  const { id: storeId } = Route.useParams()
  // store data
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
    data: storeInfo,
    isLoading: storeLoading,
    error: storeError,
  } = useGetUserstoreInfo({
    userId: userId ?? '',
    storeId,
  })

  const { data: products, isLoading: productsLoading } = useGetstoreProducts(
    storeInfo
      ? { userId: storeInfo.userId, storeId: storeInfo.id }
      : { userId: '', storeId: '' },
  )

  const { data: orders, isLoading: ordersLoading } = useGetstoreOrders({
    storeId,
  })

  if (error) return <DashboardErrorComponent error={error} />
  if (storeError) return <DashboardErrorComponent error={storeError} />
  if (!userId || storeLoading || !storeInfo || !userId) return <Spinner />

  return (
    <div className="h-screen flex flex-col">
      {/* header */}
      {/* following code should render the store name, store Update dialog and a theme toogler */}
      <header className="flex justify-center w-full p-3 border-b">
        <div className="w-full lg:max-w-7xl flex items-center justify-between">
          <Link to="/" className="select-none text-4xl font-bold tracking-wide">
            {storeInfo.storeName}
          </Link>
          <div className="flex items-center gap-3">
            {/* FIX: ---- */}
            {/* <ClientOnly>
                <ModeToggle />
              </ClientOnly> */}
            <StoreUpdate userId={storeInfo.userId} storeId={storeInfo.id} />
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
              <ProductAdd userId={storeInfo.userId} storeId={storeInfo.id} />
              <ProductCategoryAdd storeId={storeInfo.id} />
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
                            storeCurrency={storeInfo.storeCurrency}
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
                    <ProductAdd
                      userId={storeInfo.userId}
                      storeId={storeInfo.id}
                    />
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
              <ShippingMethodAdd userId={userId} storeId={storeInfo.id} />
              <PaymentMethodAdd userId={userId} storeId={storeInfo.id} />
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
                      {orders
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime(),
                        )
                        .map((order) => (
                          <OrderCardADM
                            key={order.id}
                            storeId={storeId}
                            storeCurrency={storeInfo.storeCurrency}
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
