import { useEffect, useState } from 'react'
import { PackageIcon, Search, ShoppingCartIcon } from 'lucide-react'
import ProductsFilters from './products/productsFilters'
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

const StoreProducts = ({ storeId }: { storeId: string }) => {
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
      {!isLoadingStoreProducts && storeProducts && storeProducts.length > 0 && (
        <div className="flex-1 flex flex-col">
          {/* search, filters, cart */}
          <div className="p-2 flex gap-2">
            <Input placeholder="search" />
            <Button>
              <Search />
            </Button>
            <ProductsFilters
              categoryNames={categorysNames}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
            <Button variant={'outline'}>
              <ShoppingCartIcon />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default StoreProducts
