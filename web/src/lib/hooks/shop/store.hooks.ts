import { useQuery } from '@tanstack/react-query'
import {
  sf_GetStorePaymentMethods,
  sf_GetstoreShippingMethods,
  sf_PublicStore,
  sf_StoreInfo,
} from '@/server/store/store.functions'

/**
 * Hook to fetch the user store info from a user
 *
 * @param param0 userId and storeId
 * @returns server function: sf_storeInfo
 */
export function useGetUserstoreInfo({
  userId,
  storeId,
}: {
  userId: string
  storeId: string
}) {
  return useQuery({
    queryKey: ['store', storeId],
    queryFn: () => sf_StoreInfo({ data: { userId, storeId } }),
    enabled: !!userId,
  })
}

/**
 * Hook to fetch the public store data
 *
 * @param param0 storeId
 * @returns server function: sf_Publicstore
 */
export function usePublicstore({ storeId }: { storeId: string }) {
  return useQuery({
    queryKey: ['publicstore', storeId],
    queryFn: () => sf_PublicStore({ data: { storeId } }),
  })
}

/**
 * Hook to fetch the shipping methods from a specific store
 *
 * @param param0
 * @returns server function: sf_GetstoreShippingMethods
 */
export function useGetstoreShippingMethods({ storeId }: { storeId: string }) {
  return useQuery({
    queryKey: ['shippingMethods', storeId],
    queryFn: () => sf_GetstoreShippingMethods({ data: { storeId } }),
  })
}

/**
 * Hook to fetch the payment methods from a specific store
 *
 * @param param0
 * @returns server function: sf_GetstorePaymentMethods
 */
export function useGetstorePaymentMethods({ storeId }: { storeId: string }) {
  return useQuery({
    queryKey: ['paymentMethods', storeId],
    queryFn: () => sf_GetStorePaymentMethods({ data: { storeId } }),
  })
}
