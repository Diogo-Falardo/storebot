import { z } from "zod";

export const ENTIRE_USER_MODEL = z.object({
  userId: z.uuid(),
  storeId: z.uuid(),
  storeName: z.string(),
  storeType: z.string(),
  storeCurrency: z.string().nullable(),
});
