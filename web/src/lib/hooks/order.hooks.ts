import { useQuery } from '@tanstack/react-query'
import {
  sf_GetOrders,
  sf_GetProductsFromOrder,
  sf_GetTelegramUserOrders,
} from '@/server/shop/orders/order.function'

export function useGetShopOrders({ shopId }: { shopId: string }) {
  return useQuery({
    queryKey: ['orders', shopId],
    queryFn: () => sf_GetOrders({ data: { shopId } }),
  })
}

export function useGetProductsFromOrders({
  shopId,
  orderId,
}: {
  shopId: string
  orderId: string
}) {
  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => sf_GetProductsFromOrder({ data: { shopId, orderId } }),
  })
}

export function useGetOrdersFromTelegramUser({
  shopId,
  telegramUserId,
}: {
  shopId: string
  telegramUserId: number
}) {
  return useQuery({
    queryKey: ['orders', shopId],
    queryFn: () =>
      sf_GetTelegramUserOrders({ data: { shopId, telegramUserId } }),
  })
}
