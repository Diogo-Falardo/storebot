import { z } from "zod"
import type { selectShopSchema } from "./shop.schema"


export type selectShop = z.infer<typeof selectShopSchema>
