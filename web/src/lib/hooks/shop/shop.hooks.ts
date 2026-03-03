import { useQuery } from '@tanstack/react-query'
import { sf_PublicShop, sf_ShopInfo } from '@/server/shop/shop.functions'

/**
 * Hook to fetch the user shop info from a user
 *
 * @param param0 userId and shopId
 * @returns server function: sf_ShopInfo
 */
export function useGetUserShopInfo({
  userId,
  shopId,
}: {
  userId: string
  shopId: string
}) {
  return useQuery({
    queryKey: ['shop', shopId],
    queryFn: () => sf_ShopInfo({ data: { userId, shopId } }),
  })
}

/**
 * Hook to fetch the public shop data
 *
 * @param param0 shopId
 * @returns server function: sf_PublicShop
 */
export function usePublicShop({ shopId }: { shopId: string }) {
  return useQuery({
    queryKey: ['publicShop', shopId],
    queryFn: () => sf_PublicShop({ data: { shopId } }),
  })
}
