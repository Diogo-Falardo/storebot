import { createServerFn } from '@tanstack/react-start'
import { serverOrder } from './order.server'
import { DTO_RECEIVE_ORDER, OrderStatus } from '@/schemas/order.schema'

const orderServer = new serverOrder()

/**
 * "POST"
 * place an order
 *
 *
 * required: telegramUserId, storeId & dto of Receive order
 */
export const sf_PlaceOrder = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: {
      telegramUserId: number
      storeId: string
      dto: DTO_RECEIVE_ORDER
    }) => data,
  )
  .handler(async ({ data }) => {
    await orderServer.placeOrder(data.telegramUserId, data.storeId, data.dto)
  })

/**
 * "GET"
 * obtain all the orders from a store
 *
 * required: storeId
 */
export const sf_GetOrders = createServerFn({ method: 'GET' })
  .inputValidator((data: { storeId: string }) => data)
  .handler(async ({ data }) => {
    return await orderServer.getOrdersFromstoreId(data.storeId)
  })

/**
 * "GET"
 *
 * required: orderId
 */
export const sf_GetProductsFromOrder = createServerFn({ method: 'GET' })
  .inputValidator((data: { storeId: string; orderId: string }) => data)
  .handler(async ({ data }) => {
    return await orderServer.getProductsFromOrderId(data.storeId, data.orderId)
  })

export const sf_AddCustomOrderMessage = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (data: { storeId: string; orderId: string; message: string }) => data,
  )
  .handler(async ({ data }) => {
    return await orderServer.addOrderCustomMessage(
      data.storeId,
      data.orderId,
      data.message,
    )
  })

export const sf_UpdateOrderStatus = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { storeId: string; orderId: string; status: OrderStatus }) => data,
  )
  .handler(async ({ data }) => {
    return await orderServer.changeOrderStatus(
      data.storeId,
      data.orderId,
      data.status,
    )
  })

export const sf_GetTelegramUserOrders = createServerFn({ method: 'GET' })
  .inputValidator((data: { storeId: string; telegramUserId: number }) => data)
  .handler(async ({ data }) => {
    return await orderServer.getOrdersFromTelegramId(
      data.storeId,
      data.telegramUserId,
    )
  })
