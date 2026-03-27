import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'
import { PackageIcon, ReceiptTextIcon } from 'lucide-react'
import ErrorWrapper from '@/components/errorWrapper'
import { test_data } from '@/lib/test.data'
import { sf_validate_ExternalUserAccess } from '@/server/store/store.functions'
import { sf_validate_ExternalTelegramUserInitData } from '@/server/telegram/telegram.function'
import { Spinner } from '@/components/ui/spinner'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import StoreProducts from '@/components/store/store/storeProducts'
import StoreOrders from '@/components/store/store/storeOrders'
import { use_get_PublicStoreInfoByStoreId } from '@/lib/hooks/store.hooks'

function StoreErrorComponent({ error }: { error: Error }) {
  return <ErrorWrapper errorTitle={error.message} errorDescription={''} />
}

export const Route = createFileRoute('/(store)/store/$id')({
  errorComponent: StoreErrorComponent,
  component: RouteComponent,
})

function RouteComponent() {
  const { id: storeId } = Route.useParams()
  const [telegramUserId, setTelegramUserId] = useState<number | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [activeTab, setActiveTab] = useState('products')

  const validateExternalUserTelegramInitData = useServerFn(
    sf_validate_ExternalTelegramUserInitData,
  )
  const validateExternalUserAccess = useServerFn(sf_validate_ExternalUserAccess)

  useEffect(() => {
    const authenticate = async () => {
      try {
        // const { WebApp } = await import('@grammyjs/web-app')
        // WebApp.ready()

        const user = await validateExternalUserTelegramInitData({
          data: { initData: test_data.initData },
        })

        if (user.telegramId) {
          const validatedAccess = await validateExternalUserAccess({
            data: { telegramUserId: user.telegramId, storeId: storeId },
          })

          if (!validatedAccess) throw new Error('Store is not activated...')

          setTelegramUserId(user.telegramId)
        }
      } catch (err: any) {
        setError(err ?? new Error('Authentication failed'))
      }
    }

    authenticate()
  }, [])

  const {
    data: PublicStoreInfo,
    isLoading: isLoadingPublicStoreInfo,
    error: PublicStoreError,
  } = use_get_PublicStoreInfoByStoreId({ storeId })

  if (error) return <StoreErrorComponent error={error} />
  if (PublicStoreError) return <StoreErrorComponent error={PublicStoreError} />
  if (!telegramUserId || isLoadingPublicStoreInfo || !PublicStoreInfo)
    return <Spinner />

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-t from-zinc-950 to-background">
      <header className="sticky top-0 z-50 p-3 bg-background border-b border-primary flex justify-center items-center">
        <h1 className="text-4xl font-mono tracking-tight font-semibold">
          {PublicStoreInfo.storeName}
        </h1>
      </header>
      <main className="flex-1 flex flex-col">
        {activeTab === 'products' && (
          <StoreProducts
            storeId={storeId}
            storeCurrency={PublicStoreInfo.storeCurrency}
            telegramUserId={telegramUserId}
          />
        )}
        {activeTab === 'orders' && (
          <StoreOrders
            storeId={storeId}
            storeCurrency={PublicStoreInfo.storeCurrency}
            telegramUserId={telegramUserId}
          />
        )}
      </main>
      <footer className="sticky bottom-0 z-50 p-3 bg-background">
        <nav className="flex justify-center items-center">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="gap-5 p-1 bg-background border ring ring-primary border-primary/50 group-data-[orientation=horizontal]/tabs:h-fit">
              <TabsTrigger
                value="products"
                className="flex w-20 flex-col py-3 px-4 dark:data-[state=active]:bg-neutral-900/35 dark:data-[state=active]:border-neutral-700/50"
              >
                <PackageIcon className="size-7" />
                <p className="text-xs font-light tracking-tight text-neutral-600">
                  products
                </p>
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="flex w-20 flex-col py-3 px-4 dark:data-[state=active]:bg-neutral-900/35 dark:data-[state=active]:border-neutral-700/50"
              >
                <ReceiptTextIcon className="size-7" />

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
