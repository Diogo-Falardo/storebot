import { db } from "#/db"
import { table_users } from "#/db/schema"
import { eq } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"

import { createUserSchema, outputUserSchema } from "#/db/schemas/user/user.schema"
import type { CreateUser, OutputUser } from "#/db/schemas/user/user.types"

/**
 * fetch the userId corresponding to a telegramUserId
 * @param telegramUserId
 * @returns string(userId) if user was found
 * @returns null if user was not found
 */
export async function fetchTelegramId(
  telegramUserId: bigint,
): Promise<string | null> {
  try {
    const [user] = await db
      .select()
      .from(table_users)
      .where(eq(table_users.telegramUserId, telegramUserId))
    if (!user) return null
    return user.id
  } catch (error) {
    console.error("fetchTelegramId", error)
    throw new Error("Error loading user!")
  }
}

/**
 * Creates a new user
 * @param CreateUser
 * @returns userId or null
 * */
export async function createNewUser(input: CreateUser): Promise<string> {
  const user = createUserSchema.parse(input)
  if (!user.username) {
    const random_uuid = uuidv4()
    user.username = `user_${random_uuid}`
  }

  try {
    const [created] = await db
      .insert(table_users)
      .values({
        telegramUserId: user.telegramUserId,
        username: user.username,
      })
      .returning({ id: table_users.id })

    if (!created) {
      console.error("error returning the id of a new user")
      throw new Error("Error creating user!")
    }

    return created.id
  } catch (error) {
    console.error("createNewUser", error)
    throw new Error("Error creating user!")
  }
}

/**
 * Fecths an user
 * @param userId internal user id
 * @returns selectUserSchema
 * */
export async function fetchUser(userId: string): Promise<OutputUser> {
  try {
    const [user] = await db.select().from(table_users).where(eq(table_users.id, userId)).limit(1)

    if (!user) throw new Error("User not found!")

    return outputUserSchema.parse(user)
  } catch (error) {
    console.error("fetchUser", error)
    throw new Error("Error loading user!")

  }
}

/**
 * Updates the last login with new date
 * @param userId internal user id
 * @param lastLogin date of the last login
 * */
export async function updateLastLogin(userId: string, lastLogin: Date) {
  try {
    await db.update(table_users).set({ lastLogin }).where(eq(table_users.id, userId))
  } catch (error) {
    console.error("updateLastLogin", error)
    throw new Error("Internal Server Error")
  }
}
