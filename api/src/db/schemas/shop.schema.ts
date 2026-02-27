import { z } from "zod";

export const SHOP_TYPE_ENUM = z.enum(["public", "private"]);

export const CREATE_SHOP_MODEL = z.object({
  shopType: SHOP_TYPE_ENUM,
  shopName: z.string(),
  shopCurrency: z.string().optional().nullable(),
});
export type CREATE_SHOP_TYPE = z.infer<typeof CREATE_SHOP_MODEL>;

// export const shopViewSchema = shopCreateSchema.extend({
//   id: z.uuid(),
//   userId: z.uuid(),
// });
// export type shopViewSchemaType = z.infer<typeof shopViewSchema>;
