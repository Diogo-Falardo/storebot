import { useQuery } from '@tanstack/react-query'
import { sf_getProductFromProductId } from '@/server/store/products/product.functions'

export function use_getProductByProductId({
  storeId,
  productId,
}: {
  storeId: string
  productId: string
}) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => sf_getProductFromProductId({ data: { storeId, productId } }),
  })
}
