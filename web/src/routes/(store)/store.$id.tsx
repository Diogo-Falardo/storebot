import { useServerFn } from '@tanstack/react-start'
import { ClientOnly, createFileRoute } from '@tanstack/react-router'
import { Package } from 'lucide-react'
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

import { sf_PublicTelegramVerification } from '@/server/telegram/telegram.function'
import { Badge } from '@/components/ui/badge'
import { sf_ConvertCategoryIdIntoName } from '@/server/store/products/category/productCategory.functions'

import { ModeToggle } from '@/components/mode-toggle'
import { ScrollArea } from '@/components/ui/scroll-area'
import { usePublicstore } from '@/lib/hooks/shop/store.hooks'
import StoreFilters from '@/components/store/storeFilters'
import Cart from '@/components/store/cart'
import { ProductInfo } from '@/components/store/products/productInfo'
import CartAdd from '@/components/store/cartAdd'
import Orders from '@/components/store/orders/orders'
import { sf_GetUserIdFromTelegramId } from '@/server/user/user.function'
import {
  sf_IsStoreValid,
  sf_ValidateStore,
} from '@/server/store/store.functions'

type TelegramUser = {
  telegramId: string
  firstName: string
  username: string
}

function ErrorComponent({ error }: { error: Error }) {
  return <ErrorWrapper errorTitle={error.message} errorDescription="" />
}

export const Route = createFileRoute('/(store)/store/$id')({
  errorComponent: ErrorComponent,
  component: RouteComponent,
})

function RouteComponent() {
  const { id: storeId } = Route.useParams()
  // hooks
  const { data, isLoading } = usePublicstore({ storeId })
  // server fn
  const verifyUser = useServerFn(sf_PublicTelegramVerification)
  const tryToGetUserId = useServerFn(sf_GetUserIdFromTelegramId)
  const validateStore = useServerFn(sf_ValidateStore)
  const isStoreValid = useServerFn(sf_IsStoreValid)
  const categoryName = useServerFn(sf_ConvertCategoryIdIntoName)
  // states
  const [user, setUser] = useState<TelegramUser | null>()
  const [error, setError] = useState<Error | null>(null)
  const [categoryNames, setCategoryNames] = useState<Record<string, string>>({})
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [selectedCategories, setSelectedCategories] = useState<Array<string>>(
    [],
  )

  useEffect(() => {
    const authenticate = async () => {
      try {
        const { WebApp } = await import('@grammyjs/web-app')
        WebApp.ready()

        const tgUser = await verifyUser({ data: { initData: WebApp.initData } })

        const userId = await tryToGetUserId({
          data: { telegramId: tgUser.telegramId },
        })

        if (userId) {
          const isValid = await validateStore({ data: { userId, storeId } })
          if (!isValid) {
            throw new Error('This shop is not activated')
          }
        }

        const isValid = await isStoreValid({ data: { storeId } })
        if (!isValid) {
          throw new Error('This shop is not activated')
        }
        setUser(tgUser)
      } catch (err: any) {
        setError(err ?? 'Error loading store')
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
            data: { storeId, categoryId: product.categoryId },
          })
        }
      }
      // only update if changed
      if (JSON.stringify(names) !== JSON.stringify(categoryNames)) {
        setCategoryNames(names)
      }
    }
    fetchCategoryNames()
  }, [visibleProducts])

  const availableCategories = Object.values(categoryNames).filter(Boolean)

  const filteredProducts = visibleProducts.filter((product) => {
    // price filters
    const price = Number(product.productPrice)
    const inPriceRange = price >= priceRange[0] && price <= priceRange[1]

    // category filter
    const _categoryName =
      product.categoryId && categoryNames[product.categoryId]
    const inCategory =
      selectedCategories.length === 0 ||
      (_categoryName && selectedCategories.includes(_categoryName))

    return inPriceRange && inCategory
  })

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-3">
        <Spinner />
        <p className="text-sm text-muted-foreground">Loading store...</p>
      </div>
    )
  if (error) return <ErrorComponent error={error} />
  if (!data) return <ErrorComponent error={new Error('store not found')} />

  const PLACEHOLDER_IMG = 'https://placehold.co/400x300?text=No+Image'
  return (
    <div className="h-screen flex flex-col">
      {/* header */}
      {/* following code should only render the store name and theme switcher */}
      <header className="flex w-full justify-center items-center p-3 border-b">
        <h1 className="font-mono font-bold text-3xl">{data.store.storeName}</h1>
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {/* TODO: put theme swithcer working */}
          {/* <ClientOnly>
            <ModeToggle />
          </ClientOnly> */}
        </div>
      </header>
      {/* container number 1 */}
      {/* part 2 of the container one renders: store filters & cart */}
      <div className="w-full shrink-0">
        {user?.telegramId && visibleProducts.length !== 0 && (
          <div className="flex justify-end p-3 gap-2">
            <StoreFilters
              categoryNames={availableCategories}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
            <Cart
              telegramUserId={user.telegramId ? Number(user.telegramId) : null}
              storeId={storeId}
              storeCurrency={data.store.storeCurrency}
            />
          </div>
        )}
      </div>
      {/* container number 2 */}
      {/* the following container displays the store products inside a scroll area or an Empty "Object" */}
      <div className="flex-1 min-h-0 w-full">
        {visibleProducts.length !== 0 ? (
          // scroll area should ocupate the fr space (remaining space of the screen)
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 p-1 auto-rows-max">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="relative mx-auto w-full max-w-sm pt-0 p-1"
                  >
                    <div className="flex h-full flex-col justify-between">
                      {/* header of the product */}
                      <div className="relative">
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

                        {product.categoryId ? (
                          <Badge
                            variant="outline"
                            className="absolute top-2 right-2 z-20 bg-black rounded-sm"
                          >
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
                      </div>

                      {/* container 1 */}
                      <CardHeader className="flex flex-col p-1 gap-0">
                        <CardTitle className="text-lg">
                          {product.productName}
                        </CardTitle>
                        <h1 className="flex gap-1">
                          {product.productPrice}
                          <span>{data.store.storeCurrency}</span>
                        </h1>
                        <CardDescription className="flex items-center gap-2"></CardDescription>
                      </CardHeader>
                      {/* container */}
                      <CardContent className="flex flex-col justify-end p-0">
                        <CardFooter className="flex items-center justify-end sm:justify-end p-1 gap-2 ">
                          {/* more info external visualizer */}
                          <ProductInfo
                            productName={product.productName}
                            productDesc={product.productDesc}
                            productPrice={product.productPrice}
                            productCategory={
                              product.categoryId &&
                              categoryNames[product.categoryId]
                            }
                            productImage={product.imageUrl}
                            storeCurrency={data.store.storeCurrency}
                          />
                          {/* add product to cart */}
                          <CartAdd
                            productId={product.id}
                            productImg={product.imageUrl}
                            productName={product.productName}
                            productPrice={product.productPrice}
                          />
                        </CardFooter>
                      </CardContent>
                    </div>
                  </Card>
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
              <EmptyTitle>No products</EmptyTitle>
              <EmptyDescription>This store has no products</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
      {/* container number 3 */}
      {/* the following container is used to display actions in row */}
      {/* is showed on the end of the page */}
      <div className="w-full p-5 flex justify-center items-center">
        {user?.telegramId && (
          <Orders
            storeId={storeId}
            telegramUserId={Number(user.telegramId)}
            storeCurrency={data.store.storeCurrency}
          />
        )}
      </div>
    </div>
  )
}
