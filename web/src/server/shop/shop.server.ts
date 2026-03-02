import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { shops } from '@/db/schema'
import {
  DTO_CREATE_SHOP,
  SHOP_SCHEMA,
  VISUALIZE_SHOP_SCHEMA,
} from '@/schemas/shop.schema'

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
    }
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
