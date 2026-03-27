import { useEffect, useState } from 'react'
import { PackageIcon, Search } from 'lucide-react'
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
import { Button } from '@/components/ui/button'
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
  const [categorysNames, setCateoryNames] = useState<Array<string>>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0])
  const [selectedCategories, setSelectedCategories] = useState<Array<string>>(
    [],
  )

  useEffect(() => {
    if (!isLoadingStoreProducts && storeProducts) {
      setVisibleProducts(storeProducts.filter((p) => p.productVisible === 1))
    }
  }, [isLoadingStoreProducts, storeProducts])

  useEffect(() => {
    if (visibleProducts.length > 0) {
      const prices = visibleProducts.map((p) => Number(p.productPrice))
      const min = Math.min(...prices)
      const max = Math.max(...prices)
      setPriceRange([min, max])
    }
  }, [visibleProducts])

  useEffect(() => {
    if (!isLoadingStoreCategorys && storeCategorys) {
      setCateoryNames(storeCategorys.map((c) => c.categoryName))
    }
  }, [isLoadingStoreCategorys, storeCategorys])

  return (
    <div className="flex-1 flex flex-col">
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
          <div className="p-2 flex gap-2">
            <Input placeholder="search" />
            <Button variant={'outline'}>
              <Search />
            </Button>
            <ProductsFilters
              categoryNames={categorysNames}
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
          <div className="flex-1">
            <ScrollArea className="h-full overflow-y-auto">
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
          </div>
        </div>
      )}
    </div>
  )
}

export default StoreProducts
