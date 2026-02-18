import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { getShopById } from '../shop/shop.server'
import { db } from '@/db'
import { users } from '@/db/schema'

/**
 * this function get user by telegram id
 * if user doesnt exist return null
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
    console.error('Error fetching user:', err)
    throw new Error('Error fetching user')
  }
}

export const userShopOwnershipSchema = z.object({
  userId: z.uuid(),
  shopId: z.uuid(),
})
export type userShopOwnershipSchemaType = z.infer<
  typeof userShopOwnershipSchema
>

export async function validateUserShopOwnership(
  id: userShopOwnershipSchemaType,
): Promise<boolean> {
  try {
    await getShopById(id.userId, id.shopId)

    return true
  } catch (err: any) {
    if (err.message === 'Shop not found') {
      return false
    }

    console.error(err.message)
    throw new Error(err.message ?? 'Error while validating shop ownership')
  }
}
