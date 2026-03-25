import { createServerFn } from '@tanstack/react-start'
import { serverOrder } from './order.server'
import {
  type_create_ORDER,
  type_enum_ORDER_STATUS,
} from '@/db/schemas/order.schema'

const orderServer = new serverOrder()

export const sf_create_Order = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: {
      telegramUserId: number
      storeId: string
      dto: type_create_ORDER
    }) => data,
  )
  .handler(async ({ data }) => {
    await orderServer.create_Order(data.telegramUserId, data.storeId, data.dto)
  })

export const sf_get_StoreOrdersFromStoreId = createServerFn({ method: 'GET' })
  .inputValidator((data: { storeId: string }) => data)
  .handler(async ({ data }) => {
    return await orderServer.get_OrdersFromStoreId(data.storeId)
  })

export const sf_get_ProductsFromOrder = createServerFn({ method: 'GET' })
  .inputValidator((data: { storeId: string; orderId: string }) => data)
  .handler(async ({ data }) => {
    return await orderServer.get_ProductsFromOrderId(data.storeId, data.orderId)
  })

export const sf_add_CustomOrderMessage = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (data: { storeId: string; orderId: string; message: string }) => data,
  )
  .handler(async ({ data }) => {
    return await orderServer.add_OrderCustomMessage(
      data.storeId,
      data.orderId,
      data.message,
    )
  })

export const sf_update_OrderStatus = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: {
      storeId: string
      orderId: string
      status: type_enum_ORDER_STATUS
    }) => data,
  )
  .handler(async ({ data }) => {
    return await orderServer.update_OrderStatus(
      data.storeId,
      data.orderId,
      data.status,
    )
  })

export const sf_get_OrdersFromTelegramUserId = createServerFn({ method: 'GET' })
  .inputValidator((data: { storeId: string; telegramUserId: number }) => data)
  .handler(async ({ data }) => {
    return await orderServer.get_OrdersFromTelegramUserId(
      data.storeId,
      data.telegramUserId,
    )
  })
