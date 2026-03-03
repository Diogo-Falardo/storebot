import { useServerFn } from '@tanstack/react-start'
import { createFileRoute } from '@tanstack/react-router'
import { Camera, Info, Package } from 'lucide-react'
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
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import CartAdd from '@/components/shop/cartAdd'
import Cart from '@/components/shop/cart'
import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { usePublicShop } from '@/lib/hooks/shop/shop.hooks'
import { sf_PublicTelegramVerification } from '@/server/telegram/telegram.function'

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

  const verifyUser = useServerFn(sf_PublicTelegramVerification)

  useEffect(() => {
    const authenticate = async () => {
      try {
        // This runs **only in browser**
        if (typeof window === 'undefined') return

        const { WebApp } = await import('@grammyjs/web-app')
        WebApp.ready()

        const initData = WebApp.initData || ''

        console.log(
          '[Telegram Debug] initData from WebApp:',
          initData ? 'present' : 'MISSING',
        )

        if (!initData) {
          throw new Error(
            'Telegram initData is empty. Are you running inside Telegram Mini App?',
          )
        }
        const tgUser = await verifyUser({ data: { initData } })

        setUser(tgUser)
      } catch (err: any) {
        setError(err ?? 'Error loading shop')
      }
    }
    authenticate()
  }, [])

  if (error) return <ErrorComponent error={error} />

  const visibleProducts =
    data?.products.filter((product) => product.visible === 1) ?? []
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
            <div className="flex justify-end p-2">
              <Cart />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 auto-rows-max">
              {visibleProducts.map((product) => (
                <Card key={product.id}>
                  <CardHeader className="flex justify-between">
                    <CardTitle className="text-xl">
                      {product.productName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3 flex-1 flex items-end justify-end">
                    <span className="text-lg font-semibold">
                      {product.productPrice}
                    </span>
                  </CardContent>
                  {/* footer */}
                  <CardFooter className="justify-end gap-2 pt-auto mt-auto">
                    <HoverCard openDelay={10} closeDelay={200}>
                      <HoverCardTrigger asChild>
                        <Button
                          variant={'ghost'}
                          size={'icon-lg'}
                          className="cursor-pointer"
                        >
                          <Info />
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent side="right" className="text-sm">
                        {product.productDesc ?? 'No description available'}
                      </HoverCardContent>
                    </HoverCard>
                    <Button variant={'outline'}>
                      <Camera className="h-4 w-4" />
                      Image
                    </Button>
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
