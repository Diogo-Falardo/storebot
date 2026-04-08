import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowLeftIcon, PackageIcon } from 'lucide-react'
import ProductsFilters from './products/productsFilters'
import ProductCard from './products/productCard'
import { ProductInfo } from './products/productInfo'
import Cart from './orders/cart'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import { use_get_CategorysFromStoreId } from '@/lib/hooks/category.hooks'
import { use_get_ProductsFromStoreId } from '@/lib/hooks/product.hook'
import { type_schema_PRODUCT } from '@/db/schemas/product.schema'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useLayoutPublic } from '@/lib/data'
import { Button } from '@/components/ui/button'

const StoreProducts = ({
  storeId,
  storeCurrency,
  telegramUserId,
}: {
  storeId: string
  storeCurrency: string
  telegramUserId: number
}) => {
  const { data: storeProducts, isLoading: isLoadingStoreProducts } =
    use_get_ProductsFromStoreId({ storeId })
  const { data: storeCategorys, isLoading: isLoadingStoreCategorys } =
    use_get_CategorysFromStoreId({ storeId })
  const [visibleProducts, setVisibleProducts] = useState<
    Array<type_schema_PRODUCT>
  >([])
  const [categorysNames, setCateoryNames] = useState<
    Array<{ categoryId: string; categoryName: string }>
  >([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0])
  const [selectedCategories, setSelectedCategories] = useState<Array<string>>(
    [],
  )
  const [searchQuery, setSearchQuery] = useState('')
  const productsPageRef = useRef<HTMLDivElement>(null)
  const [productsPageSize, setProductsPageSize] = useState<number>(0)
  const productsScrollAreaDivRef = useRef<HTMLDivElement>(null)
  const [productsScrollAreaSize, setProductsScrollAreaSize] =
    useState<number>(0)
  const activeProductInfo = useLayoutPublic((s) => s.productInfoActive)
  const deactivateProductInfo = useLayoutPublic(
    (pId) => pId.setProductInfoActive,
  )
  const removeActiveCategoryId = useLayoutPublic(
    (cId) => cId.setProductInfoActiveCategoryId,
  )

  useEffect(() => {
    if (!isLoadingStoreProducts && storeProducts) {
      setVisibleProducts(storeProducts.filter((p) => p.productVisible === 1))
    }
  }, [isLoadingStoreProducts, storeProducts])

  useEffect(() => {
    if (!isLoadingStoreProducts && storeProducts && storeProducts.length > 0) {
      const prices = storeProducts
        .filter((p) => p.productVisible === 1)
        .map((p) => Number(p.productPrice))
      const min = Math.min(...prices)
      const max = Math.max(...prices)
      setPriceRange([min, max])
    }
  }, [isLoadingStoreProducts, storeProducts])

  useEffect(() => {
    if (!isLoadingStoreCategorys && storeCategorys) {
      setCateoryNames(
        storeCategorys.map((c) => ({
          categoryId: c.categoryId,
          categoryName: c.categoryName,
        })),
      )
    }
  }, [isLoadingStoreCategorys, storeCategorys])

  useLayoutEffect(() => {
    if (productsPageRef.current) {
      setProductsPageSize(productsPageRef.current.offsetHeight)
    }
  }, [])

  useEffect(() => {
    setProductsScrollAreaSize(productsPageSize)
  }, [productsPageSize])

  useEffect(() => {
    if (!isLoadingStoreProducts && storeProducts) {
      let filtered = storeProducts.filter((p) => p.productVisible === 1)

      if (selectedCategories.length > 0) {
        filtered = filtered.filter((p) =>
          selectedCategories.includes(p.productCategoryId),
        )
      }

      if (priceRange[0] !== priceRange[1]) {
        filtered = filtered.filter((p) => {
          const price = Number(p.productPrice)
          return price >= priceRange[0] && price <= priceRange[1]
        })
      }

      if (searchQuery.trim() !== '') {
        const searched = filtered.filter((p) =>
          p.productName.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        if (searched.length > 0) {
          filtered = searched
        } // else: keep previous filtered (do not update)
      }

      setVisibleProducts(filtered)
    }
  }, [
    isLoadingStoreProducts,
    storeProducts,
    selectedCategories,
    priceRange,
    searchQuery,
  ])

  return (
    <div className="flex-1 flex flex-col" ref={productsPageRef}>
      {isLoadingStoreProducts && (
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="flex gap-2">
            <Spinner /> loading products
          </div>
        </div>
      )}
      {!isLoadingStoreProducts &&
        storeProducts &&
        storeProducts.length === 0 && (
          <div className="flex-1 flex flex-col justify-center items-center">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant={'icon'}>
                  <PackageIcon />
                </EmptyMedia>
                <EmptyTitle>No Products Available</EmptyTitle>
                <EmptyDescription>
                  This store isn't selling any products at the moment. Please
                  check back later!
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        )}
      {visibleProducts.length > 0 && (
        <div className="flex-1 flex flex-col">
          {/* search, filters, cart */}
          {activeProductInfo !== null ? (
            <div className="p-2">
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
            </div>
          ) : (
            <div className="p-2 flex gap-2">
              <Input
                placeholder="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <ProductsFilters
                categories={categorysNames}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
              />
              <Cart
                storeId={storeId}
                storeCurrency={storeCurrency}
                telegramUserId={telegramUserId}
              />
            </div>
          )}
          <div className="flex-1" ref={productsScrollAreaDivRef}>
            {productsScrollAreaSize > 0 &&
              (activeProductInfo !== null ? (
                <>
                  <div className="px-2"></div>
                  <ScrollArea
                    style={{
                      height: `${productsScrollAreaSize}px`,
                      maxHeight: `${productsScrollAreaSize - 55}px`,
                    }}
                  >
                    <div className="px-2 pb-8 flex flex-col gap-4 pt-2">
                      <ProductInfo
                        storeId={storeId}
                        productId={activeProductInfo}
                      />
                    </div>
                  </ScrollArea>
                </>
              ) : (
                <ScrollArea
                  style={{
                    height: `${productsScrollAreaSize}px`,
                    maxHeight: `${productsScrollAreaSize - 55}px`,
                  }}
                  className="h-full overflow-y-auto"
                >
                  <div className="py-4 px-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {visibleProducts.map((product) => (
                      <ProductCard
                        key={product.productId}
                        {...product}
                        storeCurrency={storeCurrency}
                      />
                    ))}
                  </div>
                </ScrollArea>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default StoreProducts
