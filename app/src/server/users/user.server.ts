import { db } from "#/db"
import { table_users } from "#/db/schema"
import { eq } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"

import { createUserInputSchema } from "#/db/schemas/user/user.schema"
import type { CreateUser } from "#/db/schemas/user/user.types"

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
  const user = createUserInputSchema.parse(input)
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
