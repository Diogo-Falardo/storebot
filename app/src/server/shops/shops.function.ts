import { createServerFn } from "@tanstack/react-start"
import { createShop, fetchUserShop, updateShop } from "./shops.server"
import type {
  selectShop,
  updateShop as _updateShop,
} from "#/db/schemas/shops/shop.types"

export const sfCreateShop = createServerFn({ method: "POST" })
  .validator((userId: string) => userId)
  .handler(async ({ data }): Promise<selectShop> => {
    return createShop(data)
  })

export const sfFetchUserShop = createServerFn({ method: "GET" })
  .validator((userId: string) => userId)
  .handler(async ({ data }): Promise<selectShop | null> => {
    return fetchUserShop(data)
  })

export const sfUpdateShop = createServerFn({ method: "POST" })
  .validator(
    (data: { userId: string; shopId: string; shopInfo: _updateShop }) => data,
  )
  .handler(
    async ({ data }) =>
      await updateShop(data.userId, data.shopId, data.shopInfo),
  )
