import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeftIcon,
  EllipsisVertical,
  PackageIcon,
  Search,
  Tags,
} from 'lucide-react'
import ProductsCategorys from './products/productsCategorys'
import ProductCategorysAdd from './products/productCategorysAdd'
import ProductAdd from './products/productAdd'
import ProductCardDashboard from './products/productCard.dashboard'
import { ProductInfoDashboard } from './products/productInfo.dashboard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useGetstoreProducts } from '@/lib/hooks/shop/product.hook'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useLayoutDashboard } from '@/lib/data'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

const DashboardDashboard = ({
  userId,
  storeId,
  storeCurrency,
  dashboardOffset,
}: {
  userId: string
  storeId: string
  storeCurrency: string
  dashboardOffset: number
}) => {
  const [openProductCategoryAdd, setOpenProductCategoryAdd] =
    useState<boolean>(false)
  const [openProductAdd, setOpenProductAdd] = useState<boolean>(false)
  const screenRef = useRef<HTMLDivElement>(null)
  const searchAndButtonsRef = useRef<HTMLDivElement>(null)
  const container2Ref = useRef<HTMLDivElement>(null)
  const [screenSize, setScreenSize] = useState(0)
  const [
    ocupatedScreenSizeByOtherElements,
    setocupatedScreenSizeByOtherElements,
  ] = useState(0)
  // we set this for the products scroll area size h-
  const [remainingScreenSize, setRemainingScreenSize] = useState(0)
  const activeProductInfo = useLayoutDashboard((s) => s.productInfoActive)
  const deactivateProductInfo = useLayoutDashboard(
    (pId) => pId.setProductInfoActive,
  )
  const removeActiveCategoryId = useLayoutDashboard(
    (cId) => cId.setProductInfoActiveCategoryId,
  )

  // store products
  const { data: products, isLoading: productsLoading } = useGetstoreProducts({
    userId,
    storeId,
  })

  useEffect(() => {
    if (screenRef.current) {
      setScreenSize(screenRef.current.offsetHeight)
    }

    // search bar and categorys space ocupated
    let elsSpaceOcupated = 0

    if (searchAndButtonsRef.current) {
      elsSpaceOcupated += searchAndButtonsRef.current.offsetHeight
    }

    if (container2Ref.current) {
      elsSpaceOcupated += container2Ref.current.offsetHeight
    }

    if (elsSpaceOcupated !== 0) {
      setocupatedScreenSizeByOtherElements(elsSpaceOcupated)
    }
  }, [])

  useEffect(() => {
    setRemainingScreenSize(() => screenSize - ocupatedScreenSizeByOtherElements)
  }, [screenSize, ocupatedScreenSizeByOtherElements])

  //   console.log(`
  //  screenSize = ${screenSize}
  //  ocupated = ${ocupatedScreenSizeByOtherElements}
  //  remain = ${remainingScreenSize}

  //   `)

  return (
    <div
      ref={screenRef}
      style={{ maxHeight: `calc(100vh - ${dashboardOffset}px)` }}
      className="flex-1 flex flex-col"
    >
      <div className="p-2 flex flex-col gap-2">
        {/* search bar and buttons */}
        <div ref={searchAndButtonsRef} className="flex gap-2">
          <Input placeholder="search" />
          <Button>
            <Search />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={'outline'}>
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>products</DropdownMenuLabel>

                {/* new product */}
                <DropdownMenuItem>
                  <Button
                    variant={'outline'}
                    className="w-full"
                    onClick={() => setOpenProductAdd(true)}
                  >
                    <PackageIcon /> add product
                  </Button>
                </DropdownMenuItem>
                {/* new category */}
                <DropdownMenuItem>
                  <Button
                    variant={'outline'}
                    className="w-full"
                    onClick={() => setOpenProductCategoryAdd(true)}
                  >
                    <Tags /> add category
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* item - new product */}
          <ProductAdd
            userId={userId}
            storeId={storeId}
            open={openProductAdd}
            setOpen={setOpenProductAdd}
          />
          {/* item - new category */}
          <ProductCategorysAdd
            storeId={storeId}
            open={openProductCategoryAdd}
            setOpen={setOpenProductCategoryAdd}
          />
        </div>
        {/* container 2 */}
        <div ref={container2Ref} className="flex justify-between items-center">
          {activeProductInfo !== null ? (
            <Button
              onClick={() => {
                deactivateProductInfo(null)
                removeActiveCategoryId(null)
              }}
              size={'icon'}
              variant="secondary"
              aria-label="Back"
            >
              <ArrowLeftIcon />
            </Button>
          ) : (
            <div></div>
          )}

          <ProductsCategorys storeId={storeId} />
        </div>
      </div>

      <div className="flex-1">
        {activeProductInfo !== null ? (
          <>
            <div className="px-2"></div>
            <ScrollArea style={{ height: `${remainingScreenSize}px` }}>
              <div className="px-2 pb-8 flex flex-col gap-4 pt-2">
                <ProductInfoDashboard
                  storeId={storeId}
                  productId={activeProductInfo}
                />
              </div>
            </ScrollArea>
          </>
        ) : (
          <ScrollArea style={{ height: `${remainingScreenSize}px` }}>
            <div className="px-2 pb-8 flex flex-col gap-4 pt-2">
              {!productsLoading &&
                Array.isArray(products) &&
                products.length > 0 &&
                products.map((product) => (
                  <ProductCardDashboard
                    key={product.id}
                    storeCurrency={storeCurrency}
                    {...product}
                  />
                ))}
            </div>
            {!productsLoading &&
              Array.isArray(products) &&
              products.length === 0 && (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant={'icon'}>
                      <PackageIcon />
                    </EmptyMedia>
                    <EmptyTitle>No Products Yet</EmptyTitle>
                    <EmptyDescription>
                      Add your first product to start building your store and
                      attracting customers!
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
          </ScrollArea>
        )}
      </div>
    </div>
  )
}

export default DashboardDashboard
