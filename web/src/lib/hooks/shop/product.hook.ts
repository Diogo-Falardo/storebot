import { useQuery } from '@tanstack/react-query'
import { sf_ProductsFromShop } from '@/server/shop/products/product.functions'

/**
 * Hook to fetch the products from a shop
 *
 * @param param0 userId and shopId
 * @returns server function: sf_ProductsFromShop
 */
export function useGetShopProducts({
  userId,
  shopId,
}: {
  userId: string
  shopId: string
}) {
  return useQuery({
    queryKey: ['products', shopId],
    queryFn: () => sf_ProductsFromShop({ data: { userId, shopId } }),
  })
}
