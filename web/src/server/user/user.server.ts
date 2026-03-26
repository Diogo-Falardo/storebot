import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'

/**
 * Converts the telegram user id
 * into internal database id
 *
 * @param id number telegram user id
 * @returns uuid internal user id or null
 */
export async function get_InternalUserIdByTelegramUserId(
  id: number,
): Promise<string | null> {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.telegramUserId, id))
      .limit(1)

    if (!user[0]) {
      return null
    }

    return user[0].id
  } catch (err) {
    console.log(`
        -------------------------
        ERROR GETTING INTERNAL USER ID BY TELEGRAM USER ID

        ${err}

        -------------------------
        `)

    throw new Error('Error fetching user')
  }
}
