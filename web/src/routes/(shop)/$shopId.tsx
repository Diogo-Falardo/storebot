import { useServerFn } from '@tanstack/react-start'
import { ClientOnly, createFileRoute } from '@tanstack/react-router'
import { Package, ReceiptText } from 'lucide-react'
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
import { usePublicShop } from '@/lib/hooks/shop/shop.hooks'
import { sf_PublicTelegramVerification } from '@/server/telegram/telegram.function'
import { Badge } from '@/components/ui/badge'
import { sf_ConvertCategoryIdIntoName } from '@/server/shop/products/category/productCategory.functions'
import { ProductInfo } from '@/components/shop/products/productInfo'
import ShopFilters from '@/components/shop/shopFilters'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

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
  // categorys
  const [categoryNames, setCategoryNames] = useState<Record<string, string>>({})
  // filters state
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [selectedCategories, setSelectedCategories] = useState<Array<string>>(
    [],
  )

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
      // only update if changed
      if (JSON.stringify(names) !== JSON.stringify(categoryNames)) {
        setCategoryNames(names)
      }
    }
    fetchCategoryNames()
  }, [visibleProducts])

  const availableCategories = Object.values(categoryNames).filter(Boolean)

  // rendering filters

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

  if (error) return <ErrorComponent error={error} />

  const PLACEHOLDER_IMG = 'https://placehold.co/400x300?text=No+Image'
  return (
    <div className="h-screen flex flex-col">
      {/* header */}
      {/* following code should only render the shop name and theme switcher */}
      <header className="flex w-full justify-center items-center p-3 border-b">
        <h1 className="font-mono font-bold text-3xl">{data?.shop.shopName}</h1>
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {/* TODO: put theme swithcer working */}
          {/* <ClientOnly>
            <ModeToggle />
          </ClientOnly> */}
        </div>
      </header>
      {/* container number 1 */}
      {/* part 2 of the container one renders: shop filters & cart */}
      <div className="w-full shrink-0">
        {user?.telegramId && data?.products && data.products.length > 0 && (
          <div className="flex justify-end p-3 gap-2">
            <ShopFilters
              categoryNames={availableCategories}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
            <Cart
              telegramUserId={user.telegramId ? Number(user.telegramId) : null}
              shopId={shopId}
              shopCurrency={data.shop.shopCurrency}
            />
          </div>
        )}
      </div>

      {/* container number 2 */}
      {/* the following container displays the shop products inside a scroll area or an Empty "Object" */}
      <div className="flex-1 min-h-0 w-full">
        {!isLoading && data?.products && data.products.length > 0 ? (
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
                          <span>{data.shop.shopCurrency}</span>
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
                            shopCurrency={data.shop.shopCurrency}
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
              <EmptyDescription>This shop has no products</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>

      {/* container number 3 */}
      {/* the following container is used to display actions in row */}
      {/* is showed on the end of the page */}
      <div className="w-full p-5 flex justify-center items-center">
        <Button>
          <ReceiptText />
          Orders
        </Button>
      </div>
    </div>
  )
}
