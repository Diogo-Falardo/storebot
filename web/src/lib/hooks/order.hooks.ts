import { useQuery } from '@tanstack/react-query'
import {
  sf_GetOrders,
  sf_GetProductsFromOrder,
  sf_GetTelegramUserOrders,
} from '@/server/store/orders/order.function'

export function useGetstoreOrders({ storeId }: { storeId: string }) {
  return useQuery({
    queryKey: ['orders', storeId],
    queryFn: () => sf_GetOrders({ data: { storeId } }),
  })
}

export function useGetProductsFromOrders({
  storeId,
  orderId,
}: {
  storeId: string
  orderId: string
}) {
  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => sf_GetProductsFromOrder({ data: { storeId, orderId } }),
  })
}

export function useGetOrdersFromTelegramUser({
  storeId,
  telegramUserId,
}: {
  storeId: string
  telegramUserId: number
}) {
  return useQuery({
    queryKey: ['orders', storeId],
    queryFn: () =>
      sf_GetTelegramUserOrders({ data: { storeId, telegramUserId } }),
  })
}
