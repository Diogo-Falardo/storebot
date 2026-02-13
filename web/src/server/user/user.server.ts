import { auth } from '@clerk/tanstack-react-start/server'
import { createServerFn } from '@tanstack/react-start'
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
 * Creates new user if there is no user with that clerk id
 * returns user_id or not authenticated error
 */
export const getOrCreateDbUser = createServerFn({ method: 'POST' }).handler(
  async () => {
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      throw new Error('Not authenticated')
    }

    // checks for user
    const _user = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, clerkUserId))
      .limit(1)

    if (_user.length > 0) {
      return _user[0].id
    }
    try {
      await db.insert(users).values({
        clerkUserId: clerkUserId,
      })

      const userId = await getUserbyClerkId(clerkUserId)

      if (!userId) {
        throw new Error('Failed to retrieve user after creation')
      }

      return userId
    } catch (err: any) {
      console.error('Failed to create user:', err)
      throw new Error('Failed to sync user with database')
    }
  },
)
