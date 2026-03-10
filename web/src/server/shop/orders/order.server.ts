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
   * Place an order [shop]
   *
   * Indentifies who placed the order by its telegramUserId and order Indentifier
   *
   * @param telegramUserId number
   * @param shopId uuid
   * @param dto receive order
   * @returns "msg"
   */
  async placeOrder(
    telegramUserId: number,
    shopId: string,
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
      shopId: shopId,
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
   * Returns all the orders corresponding to a shop
   * @param shopId uuid
   * @returns ShopOrders.Parsed(ORDER_VISUALIZATION)
   */
  async getOrdersFromShopId(shopId: string): Promise<Array<ORDER_SCHEMA>> {
    try {
      const shopOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.shopId, shopId))

      return ORDER_VISUALIZATION.array().parse(shopOrders)
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? `Error getting the shop orders`)
    }
  }

  /**
   * return the list of products from an order
   *
   * @param orderId uuid
   * @returns "msg" or products
   */
  async getProductsFromOrderId(shopId: string, orderId: string) {
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
          return await productServer.getProductById(shopId, product.productId)
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
   * @param shopId uuid
   * @param message string
   * @returns "msg"
   */
  async addOrderCustomMessage(
    shopId: string,
    orderId: string,
    message: string,
  ) {
    try {
      await db
        .update(orders)
        .set({ orderCustomMessage: message })
        .where(and(eq(orders.id, orderId), eq(orders.shopId, shopId)))

      return 'Added Order Custom Message'
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error adding order custom message')
    }
  }

  /**
   * Update the order status of an order
   *
   * @param shopId uuid
   * @param orderId uuid
   * @param orderStatus enum
   * @returns "msg"
   */
  async changeOrderStatus(
    shopId: string,
    orderId: string,
    orderStatus: OrderStatus,
  ) {
    try {
      await db
        .update(orders)
        .set({ orderStatus: orderStatus })
        .where(and(eq(orders.shopId, shopId), eq(orders.id, orderId)))

      return 'Updated Order Status'
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error updating order status')
    }
  }
}
