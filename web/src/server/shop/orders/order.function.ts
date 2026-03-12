import { createServerFn } from '@tanstack/react-start'
import { serverOrder } from './order.server'
import {
  DTO_RECEIVE_ORDER,
  ORDER_STATUS_ENUM,
  OrderStatus,
} from '@/schemas/order.schema'

const orderServer = new serverOrder()

/**
 * "POST"
 * place an order
 *
 *
 * required: telegramUserId, ShopId & dto of Receive order
 */
export const sf_PlaceOrder = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: {
      telegramUserId: number
      shopId: string
      dto: DTO_RECEIVE_ORDER
    }) => data,
  )
  .handler(async ({ data }) => {
    await orderServer.placeOrder(data.telegramUserId, data.shopId, data.dto)
  })

/**
 * "GET"
 * obtain all the orders from a shop
 *
 * required: shopId
 */
export const sf_GetOrders = createServerFn({ method: 'GET' })
  .inputValidator((data: { shopId: string }) => data)
  .handler(async ({ data }) => {
    return await orderServer.getOrdersFromShopId(data.shopId)
  })

/**
 * "GET"
 *
 * required: orderId
 */
export const sf_GetProductsFromOrder = createServerFn({ method: 'GET' })
  .inputValidator((data: { shopId: string; orderId: string }) => data)
  .handler(async ({ data }) => {
    return await orderServer.getProductsFromOrderId(data.shopId, data.orderId)
  })

export const sf_AddCustomOrderMessage = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (data: { shopId: string; orderId: string; message: string }) => data,
  )
  .handler(async ({ data }) => {
    return await orderServer.addOrderCustomMessage(
      data.shopId,
      data.orderId,
      data.message,
    )
  })

export const sf_UpdateOrderStatus = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { shopId: string; orderId: string; status: OrderStatus }) => data,
  )
  .handler(async ({ data }) => {
    return await orderServer.changeOrderStatus(
      data.shopId,
      data.orderId,
      data.status,
    )
  })

export const sf_GetTelegramUserOrders = createServerFn({ method: 'GET' })
  .inputValidator((data: { shopId: string; telegramUserId: number }) => data)
  .handler(async ({ data }) => {
    return await orderServer.getOrdersFromTelegramId(
      data.shopId,
      data.telegramUserId,
    )
  })
