import { useQuery } from '@tanstack/react-query'
import { sf_ProductsFromstore } from '@/server/store/products/product.functions'

/**
 * Hook to fetch the products from a store
 *
 * @param param0 userId and storeId
 * @returns server function: sf_ProductsFromstore
 */
export function useGetstoreProducts({
  userId,
  storeId,
}: {
  userId: string
  storeId: string
}) {
  return useQuery({
    queryKey: ['products', storeId],
    queryFn: () => sf_ProductsFromstore({ data: { userId, storeId } }),
  })
}
