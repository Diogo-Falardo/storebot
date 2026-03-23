import { useQuery } from '@tanstack/react-query'
import { sf_ProductsFromstore } from '@/server/store/products/product.functions'

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
