import { z } from "zod";

export const shopTypeEnum = z.enum(["public", "private", "telegram_only"]);

export const shopCreateSchema = z.object({
  shopType: shopTypeEnum,
  shopName: z.string().min(3).max(50),
});
export type shopCreateSchemaType = z.infer<typeof shopCreateSchema>;

export const shopViewSchema = shopCreateSchema.extend({
  id: z.uuidv4(),
  userId: z.uuidv4(),
});
export type shopViewSchemaType = z.infer<typeof shopViewSchema>;
