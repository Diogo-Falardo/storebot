import { eq } from 'drizzle-orm'
import { serverShop } from '../shop/shop.server'
import { db } from '@/db'
import { users } from '@/db/schema'

const shopServer = new serverShop()

/**
 * Converts the telegram user id
 * into internal database id
 *
 * @param id number telegram user id
 * @returns uuid internal user id
 */
export async function getUserByTelegramUserId(id: number) {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.telegramUserId, id))
      .limit(1)

    return user[0].id || null
  } catch (err) {
    console.error(err)
    throw new Error('Error fetching user')
  }
}

/**
 * Validates if a user is owner of the shop
 *
 * true: means its the owner
 * false: means its not the user or simply the shop was not found...
 * @param userId uuid internal user id
 * @param shopId uuid
 * @returns boolean
 */
export async function validateUserShopOwnership(
  userId: string,
  shopId: string,
): Promise<boolean> {
  try {
    await shopServer.getShopById(userId, shopId)
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
