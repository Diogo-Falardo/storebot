import { useEffect, useRef, useState } from 'react'
import { EllipsisVertical, PackageIcon, Search, Tags } from 'lucide-react'
import ProductsCategorys from './products/productsCategorys'
import ProductCategorysAdd from './products/productCategorysAdd'
import ProductAdd from './products/productAdd'
import ProductCardDashboard from './products/productCard.dashboard'
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
  const categorysRef = useRef<HTMLDivElement>(null)
  const [screenSize, setScreenSize] = useState(0)
  const [
    ocupatedScreenSizeByOtherElements,
    setocupatedScreenSizeByOtherElements,
  ] = useState(0)
  // we set this for the products scroll area size h-
  const [remainingScreenSize, setRemainingScreenSize] = useState(0)

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

    if (categorysRef.current) {
      elsSpaceOcupated += categorysRef.current.offsetHeight
    }

    if (elsSpaceOcupated !== 0) {
      setocupatedScreenSizeByOtherElements(elsSpaceOcupated)
    }
  }, [])

  useEffect(() => {
    setRemainingScreenSize(() => screenSize - ocupatedScreenSizeByOtherElements)
  }, [screenSize, ocupatedScreenSizeByOtherElements])

  console.log(`
offset: ${dashboardOffset}
screen size: ${screenSize}    
ocupated: ${ocupatedScreenSizeByOtherElements}
remain: ${remainingScreenSize}
    
    
    
`)

  return (
    <div
      ref={screenRef}
      style={{ maxHeight: `calc(100vh - ${dashboardOffset}px)` }}
      className="flex-1 flex flex-col gap-2 p-2"
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
        {/* categorys */}
        <div ref={categorysRef} className="flex justify-end">
          <ProductsCategorys storeId={storeId} />
        </div>
      </div>

      <div className="flex-1">
        <ScrollArea style={{ height: `${remainingScreenSize - 50}px` }}>
          <div className="px-2 pb-4 flex flex-col gap-4 p-2">
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
        </ScrollArea>
      </div>
    </div>
  )
}

export default DashboardDashboard
