import { z } from "zod";

export const shopTypeEnum = z.enum(["public", "private", "telegram_only"]);

export const shopCreateSchema = z.object({
  shopType: shopTypeEnum,
  shopName: z.string().min(3).max(50),
});
export type shopCreateSchemaType = z.infer<typeof shopCreateSchema>;

export const shopViewSchema = shopCreateSchema.extend({
  id: z.uuid(),
  userId: z.uuid(),
});
export type shopViewSchemaType = z.infer<typeof shopViewSchema>;
