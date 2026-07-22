import { z } from "zod"
import type { insertShopSchema, selectShopSchema, updateShopSchema } from "./shop.schema"


export type selectShop = z.infer<typeof selectShopSchema>
export type insertShop = z.infer<typeof insertShopSchema>
export type updateShop = z.infer<typeof updateShopSchema>
