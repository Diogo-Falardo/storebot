import { v4 as uuidv4 } from 'uuid'
import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { paymentMethods, shippingMethods, shops } from '@/db/schema'
import {
  DTO_CREATE_SHOP,
  SHOP_SCHEMA,
  VISUALIZE_METHOD_SCHEMA,
  VISUALIZE_SHOP_SCHEMA,
} from '@/schemas/shop.schema'
import { th } from 'zod/v4/locales'

export class serverShop {
  /**
   * Validates if a user is owner of the shop
   *
   * true: means its the owner
   * false: means its not the user or simply the shop was not found...
   * @param userId uuid internal user id
   * @param shopId uuid
   * @returns boolean
   */
  async validateUserShopOwnership(
    userId: string,
    shopId: string,
  ): Promise<boolean> {
    try {
      await this.getShopById(userId, shopId)
      return true
    } catch (err: any) {
      // if server.getShopById
      // returned the error Shop not found, means user is trying to access something that its not his..
      if (err.message === 'Shop not found') {
        return false
      }
      console.error(err.message)
      throw new Error(err.message ?? 'Error validating shop ownership')
    }
  }

  /**
   * Obtain a shop by its shopId
   *
   * @param userId uuid internal user id
   * @param shopId uuid
   * @returns parsed shop schema
   */
  async getShopById(userId: string, shopId: string): Promise<SHOP_SCHEMA> {
    try {
      const shop = await db
        .select()
        .from(shops)
        .where(and(eq(shops.userId, userId), eq(shops.id, shopId)))
        .limit(1)

      if (!shop[0]) throw new Error('Shop was not found!')

      return VISUALIZE_SHOP_SCHEMA.parse(shop[0])
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error getting shop')
    }
  }

  /**
   * Create a shop to a user
   *
   * @param userId uuid internal user id
   * @param dto create shop object
   */
  async createShop(userId: string, dto: DTO_CREATE_SHOP) {
    try {
      await db.insert(shops).values({
        id: uuidv4(),
        userId: userId,
        shopName: dto.shopName,
        shopType: dto.shopType,
      })

      return 'shop created'
    } catch (err: any) {
      console.error(err)
      throw new Error('Error creating shop')
    }
  }

  /**
   * Update a shop related to an user
   *
   * @param userId uuid internal user id
   * @param shopId uuid
   * @param dto create shop object
   * @returns
   */
  async updateShop(userId: string, shopId: string, dto: DTO_CREATE_SHOP) {
    // validate user ownership
    const ownership = await this.validateUserShopOwnership(userId, shopId)
    // returned false
    if (!ownership) {
      throw new Error('Ups... This is restricted area! - not authorized')
    }

    // obtains the current shop info
    const shop = await this.getShopById(userId, shopId)

    // object to compare what data have changed
    const updateObj: Record<string, any> = {}

    // shopName
    if (typeof dto.shopName !== 'undefined' && dto.shopName !== shop.shopName) {
      updateObj.shopName = dto.shopName
    }

    // shopCurrency
    if (
      typeof dto.shopCurrency !== 'undefined' &&
      dto.shopCurrency !== shop.shopCurrency
    ) {
      updateObj.shopCurrency = dto.shopCurrency
    }

    // if no changes, return
    if (Object.keys(updateObj).length === 0) {
      return 'No changes were applied!'
    }

    try {
      await db
        .update(shops)
        .set(updateObj)
        .where(and(eq(shops.id, shopId), eq(shops.userId, userId)))

      return 'Shop has been updated'
    } catch (err: any) {
      console.error(err.message)
      throw new Error(err.message ?? 'Error updating shop')
    }
  }

  /**
   * ANNIQUILATION OF A SHOP......
   * GOODBYESHOP NEVER SEEN AGAIN
   *
   * @param userId uuid internal user id
   * @param shopId uuid
   * @returns bool
   */
  async deleteShop(userId: string, shopId: string) {
    // validate user ownership
    const ownership = await this.validateUserShopOwnership(userId, shopId)
    // returned false
    if (!ownership) {
      throw new Error('Ups... This is restricted area! - not authorized')
    }
    try {
      await db
        .delete(shops)
        .where(and(eq(shops.userId, userId), eq(shops.id, shopId)))

      return true
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error deleting shop')
    }
  }

  /**
   * Obtain the list of shipping methods from a shop
   *
   * @param shopId uuid
   * @returns "0" methods string || array of methods
   */
  async getShopShippingMethods(shopId: string) {
    try {
      const methods = await db
        .select()
        .from(shippingMethods)
        .where(eq(shippingMethods.shopId, shopId))

      if (methods.length === 0) {
        return `There are a total of 0 Shipping Methods...`
      }

      return VISUALIZE_METHOD_SCHEMA.array().parse(methods)
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error finding methods')
    }
  }

  /**
   * Validate if a shipping method already exists on db
   *
   * valid means its availables
   * invalid means its already in use
   *
   * @param shopId uuid
   * @param shippingMethodName string
   * @returns valid | invalid
   */
  async ValidateShippingMethodName(
    shopId: string,
    shippingMethodName: string,
  ): Promise<'valid' | 'invalid'> {
    try {
      const method = await db
        .select()
        .from(shippingMethods)
        .where(
          and(
            eq(shippingMethods.shopId, shopId),
            eq(shippingMethods.method, shippingMethodName),
          ),
        )
        .limit(1)

      if (method[0]) return 'invalid'
      return 'valid'
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error validating shipping method')
    }
  }

  /**
   * Add a shipping method to a shop
   *
   * @param userId uuid internal user id
   * @param shopId uuid
   * @param shippingMethod string
   * @returns "msg"
   */
  async addShippingMethod(
    userId: string,
    shopId: string,
    shippingMethod: string,
  ) {
    // validate user ownership
    const ownership = await this.validateUserShopOwnership(userId, shopId)
    // returned false
    if (!ownership) {
      throw new Error('Ups... This is restricted area! - not authorized')
    }

    const validMethod = await this.ValidateShippingMethodName(
      shopId,
      shippingMethod,
    )

    if (validMethod === 'invalid') {
      throw new Error('Shipping Method already exists!')
    }

    try {
      await db.insert(shippingMethods).values({
        id: uuidv4(),
        shopId: shopId,
        method: shippingMethod,
      })

      return `New shipping method: ${shippingMethod}`
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error adding shipping method')
    }
  }

  /**
   * Delete a shipping method
   *
   * @param userId uuid internal user id
   * @param shopId uuid
   * @param methodId uuid
   * @returns "msg"
   */
  async deleteShippingMethod(userId: string, shopId: string, methodId: string) {
    // validate user ownership
    const ownership = await this.validateUserShopOwnership(userId, shopId)
    // returned false
    if (!ownership) {
      throw new Error('Ups... This is restricted area! - not authorized')
    }
    try {
      await db
        .delete(shippingMethods)
        .where(
          and(
            eq(shippingMethods.shopId, shopId),
            eq(shippingMethods.id, methodId),
          ),
        )

      return `Shipping method deleted!`
    } catch (err: any) {
      console.log(err)
      throw new Error(err.message ?? 'Error deleting shipping method')
    }
  }

  /**
   * Returns the method name from its id
   *
   * @param shippingMethodId
   * @returns method name
   */
  async getShopShippingMethodFromId(shippingMethodId: string) {
    try {
      const method = await db
        .select()
        .from(shippingMethods)
        .where(eq(shippingMethods.id, shippingMethodId))
        .limit(1)

      if (!method[0]) throw new Error('Shipping method not found!')

      return method[0].method
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error retrieving shipping method')
    }
  }

  /**
   * Obtain the list of  payment methods from a shop
   *
   * @param shopId uuid
   * @returns "0" methods string || array of methods
   */
  async getShopPaymentMethods(shopId: string) {
    try {
      const methods = await db
        .select()
        .from(paymentMethods)
        .where(eq(paymentMethods.shopId, shopId))

      if (methods.length === 0) {
        return `There are a total of 0 Payment Methods...`
      }

      return VISUALIZE_METHOD_SCHEMA.array().parse(methods)
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error finding methods')
    }
  }

  /**
   * Validate if a payment method already exists on db
   *
   * valid means its availables
   * invalid means its already in use
   *
   * @param shopId uuid
   * @param shippingMethodName string
   * @returns valid | invalid
   */
  async ValidatePaymentMethodName(
    shopId: string,
    shippingMethodName: string,
  ): Promise<'valid' | 'invalid'> {
    try {
      const method = await db
        .select()
        .from(paymentMethods)
        .where(
          and(
            eq(paymentMethods.shopId, shopId),
            eq(paymentMethods.method, shippingMethodName),
          ),
        )
        .limit(1)

      if (method[0]) return 'invalid'
      return 'valid'
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error validating payment method')
    }
  }

  /**
   * add a payment method to a shop
   *
   * @param userId uuid internal user id
   * @param shopId uuid
   * @param paymentMethod shopid
   * @returns "msg"
   */
  async addPaymentMethod(
    userId: string,
    shopId: string,
    paymentMethod: string,
  ) {
    // validate user ownership
    const ownership = await this.validateUserShopOwnership(userId, shopId)
    // returned false
    if (!ownership) {
      throw new Error('Ups... This is restricted area! - not authorized')
    }

    const validMethod = await this.ValidatePaymentMethodName(
      shopId,
      paymentMethod,
    )

    if (validMethod === 'invalid') {
      throw new Error('Shipping Method already exists!')
    }

    try {
      await db.insert(paymentMethods).values({
        id: uuidv4(),
        shopId: shopId,
        method: paymentMethod,
      })

      return `New shipping method: ${paymentMethod}`
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error adding shipping method')
    }
  }

  /**
   * Delete a Payment method
   *
   * @param userId uuid internal user id
   * @param shopId uuid
   * @param methodId uuid
   * @returns "msg"
   */
  async deletePaymentMethod(userId: string, shopId: string, methodId: string) {
    // validate user ownership
    const ownership = await this.validateUserShopOwnership(userId, shopId)
    // returned false
    if (!ownership) {
      throw new Error('Ups... This is restricted area! - not authorized')
    }
    try {
      await db
        .delete(paymentMethods)
        .where(
          and(
            eq(paymentMethods.shopId, shopId),
            eq(paymentMethods.id, methodId),
          ),
        )

      return `Payment method deleted!`
    } catch (err: any) {
      console.log(err)
      throw new Error(err.message ?? 'Error deleting payment method')
    }
  }

  /**
   * Returns the method name from its id
   *
   * @param paymentMethodId
   * @returns method name
   */
  async getShopPaymentMethodFromId(paymentMethodId: string) {
    try {
      const method = await db
        .select()
        .from(paymentMethods)
        .where(eq(paymentMethods.id, paymentMethodId))
        .limit(1)

      if (!method[0]) throw new Error('Payment method not found!')

      return method[0].method
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error retrieving payment method')
    }
  }
}

/**
 * Obtains the shop and product information about a shop
 *
 * SHOULD ONLY BE RENDERER on **SHOP VIEW ROUTE**,
 * THIS FUNCTION SHOULD ONLY BE USED TO RENDER WHEN ACTUALY NEEDED
 *
 * @param shopId uuid
 */
export async function publicShop(shopId: string) {
  try {
    const shop = await db
      .select({ shopName: shops.shopName, shopCurrency: shops.shopCurrency })
      .from(shops)
      .where(eq(shops.id, shopId))
      .limit(1)

    if (!shop[0]) throw new Error('Shop was not found')

    return shop[0]
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message ?? 'Error finding shop')
  }
}

// get all the user shops from its id
// export async function getUserShopsByUserId(
//   userId: string,
// ): Promise<Array<shopExtendedSchemaType> | null> {
//   try {
//     const userShops = await db
//       .select()
//       .from(shops)
//       .where(eq(shops.userId, userId))

//     if (userShops.length === 0) return null
//     return shopExtendedSchema.array().parse(userShops)
//   } catch (err: any) {
//     console.error(err)
//     throw new Error('Error getting user shops')
//   }
// }

// get shop by id
// export async function getNameByShopId(shopId: string) {
//   try {
//     const shop = await db
//       .select({
//         shopName: shops.shopName,
//       })
//       .from(shops)
//       .where(eq(shops.id, shopId))
//       .limit(1)

//     console.log(shop.length)
//     if (shop.length === 0) throw new Error('Shop not found')
//     return shop[0].shopName
//   } catch (err: any) {
//     console.error(err)
//     throw new Error(err.message ?? 'Error getting shop')
//   }
// }
