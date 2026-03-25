import { v4 as uuidv4 } from 'uuid'
import { and, eq } from 'drizzle-orm'
import { serverProduct } from '../products/products.server'
import { db } from '@/db'
import { orders, productsOrders } from '@/db/schema'
import {
  schema_ORDER,
  type_create_ORDER,
  type_enum_ORDER_STATUS,
  type_schema_ORDER,
} from '@/db/schemas/order.schema'

const productServer = new serverProduct()

export class serverOrder {
  /**
   * Create || place an order from store.$id.tsx "page"
   *
   * Indentifies who placed the order by its telegramUserId and order Indentifier
   * @param telegramUserId
   * @param storeId
   * @param dto create order
   * @returns "msg"
   */
  async create_Order(
    telegramUserId: number,
    storeId: string,
    dto: type_create_ORDER,
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
      console.log(`
      -------------------------
        ERROR CREATING ORDER

        ${err}

        -------------------------
     `)

      throw new Error(err.message ?? 'error while placing order')
    }
  }

  /**
   * Returns all the orders corresponding to a store
   * @param storeId
   * @returns parsed orders
   */
  async get_OrdersFromStoreId(
    storeId: string,
  ): Promise<Array<type_schema_ORDER>> {
    try {
      const storeOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.storeId, storeId))

      return schema_ORDER.array().parse(storeOrders)
    } catch (err: any) {
      console.log(`
      -------------------------
        ERROR GETTING ORDERS FROM STORE ID

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'error fetching orders')
    }
  }

  /**
   * Returns the list of products from an order
   * @param orderId uuid
   * @returns parsed products
   */
  async get_ProductsFromOrderId(storeId: string, orderId: string) {
    try {
      const products = await db
        .select()
        .from(productsOrders)
        .where(eq(productsOrders.orderId, orderId))

      // Fetch all product info in parallel and collect results
      const productInfos = await Promise.all(
        products.map(async (product) => {
          return await productServer.get_ProductByProductId(
            storeId,
            product.productId,
          )
        }),
      )

      return productInfos
    } catch (err: any) {
      console.log(`
      -------------------------
        ERROR GETTING PRODUCTS FROM ORDER ID

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'error fetching orders')
    }
  }

  /**
   * Add a Order Custom Message to an order
   * @param orderId
   * @param storeId
   * @param message
   * @returns "msg"
   */
  async add_OrderCustomMessage(
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
      console.log(`
      -------------------------
        ERROR ADDING ORDER CUSTOM MESSAGE
        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'error adding order custom message')
    }
  }

  /**
   * Update the order status of an order
   * @param storeId
   * @param orderId
   * @param orderStatus
   * @returns "msg"
   */
  async update_OrderStatus(
    storeId: string,
    orderId: string,
    orderStatus: type_enum_ORDER_STATUS,
  ) {
    try {
      await db
        .update(orders)
        .set({ orderStatus: orderStatus })
        .where(and(eq(orders.storeId, storeId), eq(orders.id, orderId)))

      return 'Updated Order Status'
    } catch (err: any) {
      console.log(`
      -------------------------
        ERROR UPDATING ORDER STATUS
        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'Error updating order status')
    }
  }

  /**
   * Return all the orders from an user
   * @param telegramUserId
   * @param storeId
   * @returns
   */
  async get_OrdersFromTelegramUserId(storeId: string, telegramUserId: number) {
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
      console.log(`
      -------------------------
        ERROR GETTING ORDERS FROM TELEGRAM ID
        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'error fetching orders')
    }
  }
}
