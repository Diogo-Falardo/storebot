import { v4 as uuidv4 } from 'uuid'
import { and, eq } from 'drizzle-orm'
import { serverProduct } from '../products/products.server'
import { db } from '@/db'
import {
  DTO_RECEIVE_ORDER,
  ORDER_SCHEMA,
  ORDER_VISUALIZATION,
  OrderStatus,
} from '@/schemas/order.schema'
import { orders, productsOrders } from '@/db/schema'

const productServer = new serverProduct()

export class serverOrder {
  /**
   * Place an order [store]
   *
   * Indentifies who placed the order by its telegramUserId and order Indentifier
   *
   * @param telegramUserId number
   * @param storeId uuid
   * @param dto receive order
   * @returns "msg"
   */
  async placeOrder(
    telegramUserId: number,
    storeId: string,
    dto: DTO_RECEIVE_ORDER,
  ) {
    // generate an order id
    const orderId = uuidv4()
    // without an order Indentifier as "TELEGRAM USERNAME" is not possible to make an order
    if (dto.orderIdentifier === '' || dto.orderIdentifier.trim() === '') {
      throw new Error('Order Indetifier is necessary to place an order...')
    }

    // if orders dont have any products there is no need to place an order
    if (dto.productsId.length === 0) {
      throw new Error('Products are necessary to place an order...')
    }

    const orderPayload = {
      id: orderId,
      storeId: storeId,
      orderStatus: 'pending',
      telegramUserId: telegramUserId,
      orderIdentifier: dto.orderIdentifier,
      orderDeliveryInstruction: dto.orderDeliveryInstruction,
      orderShippingMethod: dto.orderShippingMethod,
      orderPaymentMethod: dto.orderPaymentMethod,
    }

    try {
      await db.insert(orders).values(orderPayload)
      dto.productsId.forEach(async (product) => {
        await db
          .insert(productsOrders)
          .values({ id: uuidv4(), orderId: orderId, productId: product })
      })

      return 'order placed'
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error while placing order')
    }
  }

  /**
   * Returns all the orders corresponding to a store
   * @param storeId uuid
   * @returns storeOrders.Parsed(ORDER_VISUALIZATION)
   */
  async getOrdersFromstoreId(storeId: string): Promise<Array<ORDER_SCHEMA>> {
    try {
      const storeOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.storeId, storeId))

      return ORDER_VISUALIZATION.array().parse(storeOrders)
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? `Error getting the store orders`)
    }
  }

  /**
   * return the list of products from an order
   *
   * @param orderId uuid
   * @returns "msg" or products
   */
  async getProductsFromOrderId(storeId: string, orderId: string) {
    try {
      const products = await db
        .select()
        .from(productsOrders)
        .where(eq(productsOrders.orderId, orderId))

      if (products.length === 0) {
        return 'No Products'
      }

      // Fetch all product info in parallel and collect results
      const productInfos = await Promise.all(
        products.map(async (product) => {
          return await productServer.getProductById(storeId, product.productId)
        }),
      )

      return productInfos
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error getting products from order')
    }
  }

  /**
   * Add a Order Custom Message to an order
   *
   * @param orderId uuid
   * @param storeId uuid
   * @param message string
   * @returns "msg"
   */
  async addOrderCustomMessage(
    storeId: string,
    orderId: string,
    message: string,
  ) {
    try {
      await db
        .update(orders)
        .set({ orderCustomMessage: message })
        .where(and(eq(orders.id, orderId), eq(orders.storeId, storeId)))

      return 'Added Order Custom Message'
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error adding order custom message')
    }
  }

  /**
   * Update the order status of an order
   *
   * @param storeId uuid
   * @param orderId uuid
   * @param orderStatus enum
   * @returns "msg"
   */
  async changeOrderStatus(
    storeId: string,
    orderId: string,
    orderStatus: OrderStatus,
  ) {
    try {
      await db
        .update(orders)
        .set({ orderStatus: orderStatus })
        .where(and(eq(orders.storeId, storeId), eq(orders.id, orderId)))

      return 'Updated Order Status'
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error updating order status')
    }
  }

  /**
   * Return all the orders from an user
   * @param telegramUserId
   * @param storeId
   * @returns
   */
  async getOrdersFromTelegramId(storeId: string, telegramUserId: number) {
    try {
      const userOrders = await db
        .select()
        .from(orders)
        .where(
          and(
            eq(orders.storeId, storeId),
            eq(orders.telegramUserId, telegramUserId),
          ),
        )

      if (userOrders.length === 0) {
        return 'no orders'
      }

      return userOrders
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error while getting telegram orders')
    }
  }
}
