import { useQuery } from '@tanstack/react-query'
import {
  sf_get_OrdersFromTelegramUserId,
  sf_get_ProductsFromOrderId,
  sf_get_StoreOrdersFromStoreId,
} from '@/server/orders/order.function'

export function use_get_StoreOrdersFromStoreId({
  storeId,
}: {
  storeId: string
}) {
  return useQuery({
    queryKey: ['orders', storeId],
    queryFn: () => sf_get_StoreOrdersFromStoreId({ data: { storeId } }),
  })
}

export function use_get_ProductsFromOrderId({
  storeId,
  orderId,
}: {
  storeId: string
  orderId: string
}) {
  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => sf_get_ProductsFromOrderId({ data: { storeId, orderId } }),
  })
}

export function use_get_OrdersFromTelegramUserId({
  storeId,
  telegramUserId,
}: {
  storeId: string
  telegramUserId: number
}) {
  return useQuery({
    queryKey: ['orders', storeId],
    queryFn: () =>
      sf_get_OrdersFromTelegramUserId({ data: { storeId, telegramUserId } }),
  })
}
