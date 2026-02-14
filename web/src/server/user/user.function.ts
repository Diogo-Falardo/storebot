import { auth } from '@clerk/tanstack-react-start/server'
import { createServerFn } from '@tanstack/react-start'
import { getUserbyClerkId } from './user.server'
import { db } from '@/db'
import { users } from '@/db/schema'

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
    const user = await getUserbyClerkId(clerkUserId)
    if (typeof user === 'string') {
      return user
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
