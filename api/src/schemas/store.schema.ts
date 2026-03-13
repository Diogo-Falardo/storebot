import { z } from "zod";

// public store info
export const schema_public_STORE_INFO = z.object({
  id: z.uuid(),
  storeName: z.string(),
  storeCurrency: z.string(),
});
export type schema_public_type_STORE_INFO = z.infer<
  typeof schema_public_STORE_INFO
>;

// add expire date to store
export const schema_add_STORE_EXPIRE_DATE = z.object({
  storeExpireDate: z.iso.datetime(),
});
