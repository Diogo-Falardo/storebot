import { z } from "zod";

export const ENTIRE_USER_MODEL = z.object({
  userId: z.uuid(),
  shopId: z.uuid(),
  shopName: z.string(),
  shopType: z.string(),
  shopCurrency: z.string().nullable(),
});
