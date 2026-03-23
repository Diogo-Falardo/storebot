import { ClientOnly, Link, createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { LayoutDashboard, Package, ReceiptText, Settings } from 'lucide-react'
import { sf_validateTelegramInitData } from '@/server/telegram/telegram.function'
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
import StoreUpdate from '@/components/store/storeUpdate'
import OrderCardADM from '@/components/store/orders/orderCard.admin'
import PaymentMethodAdd from '@/components/store/paymentMethodAdd'
import ShippingMethodAdd from '@/components/store/shippingMethodAdd'
import ProductAdd from '@/components/store/products/productAdd'
import ProductCardADM from '@/components/store/products/productCard.admin'
import ProductCategoryAdd from '@/components/store/products/productCategoryAdd'
import { useGetstoreProducts } from '@/lib/hooks/shop/product.hook'
import { useGetUserStoreInfo } from '@/lib/hooks/shop/store.hooks'
import { sf_validateIfStoreIsActivated } from '@/server/store/store.functions'
import { test_data } from '@/lib/test.data'
import DashboardSettings from '@/components/store/dashboard/dashboardSettings'
import DashboardDashboard from '@/components/store/dashboard/dashboardDashboard'
import { useLayoutDashboard, useLayoutPublic } from '@/lib/data'

function DashboardErrorComponent({ error }: { error: Error }) {
  return <ErrorWrapper errorTitle={error.message} errorDescription={''} />
}

export const Route = createFileRoute('/(store)/dashboard/$id')({
  errorComponent: DashboardErrorComponent,
  component: RouteComponent,
})

function RouteComponent() {
  const { id: storeId } = Route.useParams()
  const [userId, setUserId] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [activeTab, setActiveTab] = useState('dashboard')

  const validateTelegramInitData = useServerFn(sf_validateTelegramInitData)
  const validateIfStoreIsActivated = useServerFn(sf_validateIfStoreIsActivated)

  const dashboardNavbarRef = useRef<HTMLDivElement>(null)
  const dashboardNavbarHeight = useLayoutDashboard((s) => s.headerHeight)
  const setDashboardNavbarHeight = useLayoutDashboard((s) => s.setHeaderHeight)
  const dashboardFooterRef = useRef<HTMLDivElement>(null)
  const dashboardFooterHeight = useLayoutDashboard((s) => s.footerHeight)
  const setDashboardFooterHeight = useLayoutDashboard((s) => s.setFooterHeight)
  const setDashboardOffset = useLayoutDashboard((s) => s.setOffset)
  const dashboardOffset = useLayoutDashboard((s) => s.offset)

  // authentication || validation of the user on CLIENT LOAD
  useEffect(() => {
    const authenticate = async () => {
      try {
        // const { WebApp } = await import('@grammyjs/web-app')
        // WebApp.ready()

        // const user = await validateTelegramInitData({
        //   data: { initData: WebApp.initData },
        // })

        const user = await validateTelegramInitData({
          data: { initData: test_data.initData },
        })

        const isStoreActivated = await validateIfStoreIsActivated({
          data: { userId: user.userId, storeId: storeId },
        })

        if (!isStoreActivated) throw new Error('Unauthorized...')

        setUserId(user.userId)
      } catch (err: any) {
        setError(err ?? new Error('Authentication failed'))
      }
    }
    authenticate()
  }, [])

  useLayoutEffect(() => {
    if (dashboardNavbarRef.current) {
      setDashboardNavbarHeight(dashboardNavbarRef.current.offsetHeight)
    }

    if (dashboardFooterRef.current) {
      setDashboardFooterHeight(dashboardFooterRef.current.offsetHeight)
    }
  })

  useEffect(() => {
    if (dashboardNavbarHeight && dashboardFooterHeight) {
      setDashboardOffset(dashboardNavbarHeight + dashboardFooterHeight)
    }
  }, [dashboardFooterHeight, dashboardNavbarHeight])

  // store information
  const {
    data: storeInfo,
    isLoading: storeLoading,
    error: storeError,
  } = useGetUserStoreInfo({
    userId: userId ?? '',
    storeId,
  })

  const { data: orders, isLoading: ordersLoading } = useGetstoreOrders({
    storeId,
  })

  if (error) return <DashboardErrorComponent error={error} />
  if (storeError) return <DashboardErrorComponent error={storeError} />
  if (!userId || storeLoading || !storeInfo || !userId) return <Spinner />

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-t from-zinc-950 to-background">
      <header
        ref={dashboardNavbarRef}
        className="sticky top-0 z-50 p-3 bg-background border-b border-primary flex justify-center items-center"
      >
        <h1 className="text-4xl font-mono tracking-tight font-semibold">
          {storeInfo.storeName}
        </h1>
      </header>
      {/* content */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'settings' && (
          <DashboardSettings storeId={storeId} userId={userId} />
        )}
        {activeTab === 'dashboard' && (
          <DashboardDashboard
            storeId={storeId}
            userId={userId}
            storeCurrency={storeInfo.storeCurrency}
            dashboardOffset={dashboardOffset}
          />
        )}
        {activeTab === 'orders' && <></>}
      </main>
      {/* menu */}
      <footer
        ref={dashboardFooterRef}
        className="sticky bottom-0 z-50 p-3 bg-background"
      >
        <nav className="flex justify-center items-center">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="gap-5 p-1 bg-background border ring ring-primary border-primary/50 group-data-[orientation=horizontal]/tabs:h-fit">
              <TabsTrigger
                value="settings"
                className="flex w-20 flex-col py-3 px-4 dark:data-[state=active]:bg-neutral-900/35 dark:data-[state=active]:border-neutral-700/50"
              >
                <Settings className="size-7" />
                <p className="text-xs font-light tracking-tight text-neutral-600">
                  settings
                </p>
              </TabsTrigger>
              <TabsTrigger
                value="dashboard"
                className="flex w-20 flex-col py-3 px-4 dark:data-[state=active]:bg-neutral-900/35 dark:data-[state=active]:border-neutral-700/50"
              >
                <LayoutDashboard className="size-7" />

                <p className="text-xs font-light tracking-tight text-neutral-600">
                  dashboard
                </p>
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="flex w-20 flex-col py-3 px-4 dark:data-[state=active]:bg-neutral-900/35 dark:data-[state=active]:border-neutral-700/50"
              >
                <ReceiptText className="size-7" />

                <p className="text-xs font-light tracking-tight text-neutral-600">
                  orders
                </p>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </nav>
      </footer>
    </div>
  )
}
