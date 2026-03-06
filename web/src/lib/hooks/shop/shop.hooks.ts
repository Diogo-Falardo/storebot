import { useQuery } from '@tanstack/react-query'
import {
  sf_GetShopPaymentMethods,
  sf_GetShopShippingMethods,
  sf_PublicShop,
  sf_ShopInfo,
} from '@/server/shop/shop.functions'

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
    enabled: !!userId,
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

/**
 * Hook to fetch the shipping methods from a specific shop
 *
 * @param param0
 * @returns server function: sf_GetShopShippingMethods
 */
export function useGetShopShippingMethods({ shopId }: { shopId: string }) {
  return useQuery({
    queryKey: ['shippingMethods', shopId],
    queryFn: () => sf_GetShopShippingMethods({ data: { shopId } }),
  })
}

/**
 * Hook to fetch the payment methods from a specific shop
 *
 * @param param0
 * @returns server function: sf_GetShopPaymentMethods
 */
export function useGetShopPaymentMethods({ shopId }: { shopId: string }) {
  return useQuery({
    queryKey: ['shippingMethods', shopId],
    queryFn: () => sf_GetShopPaymentMethods({ data: { shopId } }),
  })
}
