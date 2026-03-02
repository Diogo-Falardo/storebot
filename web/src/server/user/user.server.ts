import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'

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
