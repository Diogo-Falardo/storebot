import { useQuery } from '@tanstack/react-query'
import {
  sf_get_PublicStoreInfoByStoreId,
  sf_get_StoreInfoByStoreId,
  sf_get_StorePaymentMethods,
  sf_get_StoreShippingMethods,
} from '@/server/store/store.functions'

export function use_get_StoreInfoByStoreId({
  userId,
  storeId,
}: {
  userId: string
  storeId: string
}) {
  return useQuery({
    queryKey: ['store', storeId],
    queryFn: () => sf_get_StoreInfoByStoreId({ data: { userId, storeId } }),
    enabled: !!userId,
  })
}

export function use_get_StoreShippingMethods({ storeId }: { storeId: string }) {
  return useQuery({
    queryKey: ['shippingMethods', storeId],
    queryFn: () => sf_get_StoreShippingMethods({ data: { storeId } }),
  })
}

export function use_get_StorePaymentMethods({ storeId }: { storeId: string }) {
  return useQuery({
    queryKey: ['paymentMethods', storeId],
    queryFn: () => sf_get_StorePaymentMethods({ data: { storeId } }),
  })
}

export function use_get_PublicStoreInfoByStoreId({
  storeId,
}: {
  storeId: string
}) {
  return useQuery({
    queryKey: ['store', storeId],
    queryFn: () => sf_get_PublicStoreInfoByStoreId({ data: { storeId } }),
  })
}
