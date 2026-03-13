import { z } from "zod";

export const SHOP_TYPE_ENUM = z.enum(["public", "private"]);

export const CREATE_SHOP_MODEL = z.object({
  storeType: SHOP_TYPE_ENUM,
  storeName: z.string(),
  storeCurrency: z.string().optional().nullable(),
});
export type CREATE_SHOP_TYPE = z.infer<typeof CREATE_SHOP_MODEL>;

// export const shopViewSchema = shopCreateSchema.extend({
//   id: z.uuid(),
//   userId: z.uuid(),
// });
// export type shopViewSchemaType = z.infer<typeof shopViewSchema>;
