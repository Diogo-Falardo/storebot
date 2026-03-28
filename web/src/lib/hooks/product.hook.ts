import { useQuery } from '@tanstack/react-query'
import {
  sf_get_ProductFromProductId,
  sf_get_ProductsFromStoreId,
} from '@/server/products/product.functions'

export function use_get_ProductsFromStoreId({ storeId }: { storeId: string }) {
  return useQuery({
    queryKey: ['products', storeId],
    queryFn: () => sf_get_ProductsFromStoreId({ data: { storeId } }),
  })
}

export function use_get_ProductFromProductId({
  storeId,
  productId,
}: {
  storeId: string
  productId: string
}) {
  return useQuery({
    queryKey: ['product', productId, storeId],
    queryFn: () =>
      sf_get_ProductFromProductId({ data: { storeId, productId } }),
  })
}
