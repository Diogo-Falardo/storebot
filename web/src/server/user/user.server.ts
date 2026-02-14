import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'

/**
 * this function get user by clerk id
 * if user doesnt exist return null
 */
export async function getUserbyClerkId(id: string) {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, id))
      .limit(1)

    return user[0].id || null
  } catch (err) {
    console.error('Error fetching user:', err)
    throw new Error('Error fetching user')
  }
}

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
