import { z } from "zod"
import { fetchUser } from "./users/user.server";
import { fecthShop } from "./shops/shops.server";
import { db } from "#/db";
import { table_shops } from "#/db/schema";
import { and, eq } from "drizzle-orm";


export function validateUUID(uuid: string) {
  const parsed = z.uuid().safeParse(uuid);
  if (!parsed.success) throw new Error("Invalid Id")
}


type validator = {
  userId: string;
  shopId: string;
  userExists?: boolean;
  shopExists?: boolean;
  isUserOwner?: boolean;
}
export async function validateUserShopInteraction(validator: validator) {
  validateUUID(validator.userId)
  validateUUID(validator.shopId)

  if (validator.userExists) {
    await fetchUser(validator.userId)
  }

  if (validator.shopExists) {
    await fecthShop(validator.shopId)
  }

  if (validator.isUserOwner) {
    try {
      const [isOwner] = await db.select().from(table_shops).where(and(eq(table_shops.userId, validator.userId), eq(table_shops.id, validator.shopId))).limit(1)
      if (!isOwner) throw new Error("Acess denied!")
    } catch (error) {
      console.error("validateUserShopInteraction.validator.isUserOwner", error)
      throw new Error("Internal Server Error")
    }
  }

}
