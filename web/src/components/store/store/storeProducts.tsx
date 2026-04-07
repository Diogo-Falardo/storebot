import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { PackageIcon } from 'lucide-react'
import ProductsFilters from './products/productsFilters'
import ProductCard from './products/productCard'
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
  const searchOptionsDivRef = useRef<HTMLDivElement>(null)
  const [searchOptionsDivSize, setSearchOptionsDivSize] = useState<number>(0)
  const productsScrollAreaDivRef = useRef<HTMLDivElement>(null)
  const [productsScrollAreaSize, setProductsScrollAreaSize] =
    useState<number>(0)

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
    const updateSizes = () => {
      if (productsPageRef.current) {
        setProductsPageSize(productsPageRef.current.offsetHeight)
      }
      if (searchOptionsDivRef.current) {
        setSearchOptionsDivSize(searchOptionsDivRef.current.offsetHeight)
      }
    }

    updateSizes()
    window.addEventListener('resize', updateSizes)
    return () => window.removeEventListener('resize', updateSizes)
  }, [])

  useEffect(() => {
    setProductsScrollAreaSize(productsPageSize - searchOptionsDivSize)
  }, [productsPageSize, searchOptionsDivSize])

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
        <div className="flex-1 flex flex-col" ref={searchOptionsDivRef}>
          {/* search, filters, cart */}
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
          <div className="flex-1" ref={productsScrollAreaDivRef}>
            {productsScrollAreaSize > 0 ? (
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
            ) : (
              <div className="flex flex-col justify-center items-center h-full">
                <h1 className="text-neutral-200 flex gap-2 items-center">
                  <Spinner /> rendering products...
                </h1>
                <p className="text-neutral-500 font-medium text-sm text-center mt-2">
                  If this takes too long, try switching tabs or refreshing the
                  page.
                  <br />
                  We're working to make this smoother—thanks for your patience!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default StoreProducts
