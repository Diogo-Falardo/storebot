import { uuid, z } from "zod";
import { category } from "../schema";

export const STORE_TYPE_EMUM = z.enum(["public", "private"]);

// store info
export const SELECT_STORE = z.object({
  userId: z.uuid(),
  storeId: z.uuid(),
  storeType: STORE_TYPE_EMUM,
  storeName: z.string(),
  storeCurrency: z.string(),
  storeExpireDate: z.date().nullable(),
  storeCreatedAt: z.date(),
});
export type SELECT_STORE_type = z.infer<typeof SELECT_STORE>;

// public store info
export const SELECT_PUBLIC_STORE = z.object({
  storeId: z.uuid(),
  storeName: z.string(),
  storeCurrency: z.string(),
});
export type SELECT_PUBLIC_STORE_type = z.infer<typeof SELECT_PUBLIC_STORE>;

// create a store
export const INSERT_STORE = z.object({
  storeName: z
    .string()
    .min(1, { message: "store name is required" })
    .max(120, { message: "store name max characters 120" }),
  storeType: STORE_TYPE_EMUM,
});
export type INSERT_STORE_type = z.infer<typeof INSERT_STORE>;

export const SELECT_STORE_CATEGORY = z.object({
  id: z.string(),
  category: z.string(),
});
export type SELECT_STORE_CATEGORY_type = z.infer<typeof SELECT_STORE_CATEGORY>;

export const SELECT_STORE_METHODS = z.object({
  id: z.string(),
  method: z.string(),
});
export type SELECT_STORE_METHODS_type = z.infer<typeof SELECT_STORE_METHODS>;
