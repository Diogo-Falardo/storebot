/**
 * Zod validators for dashboard forms (aligned with db schema).
 * Zod 4 implements Standard Schema — TanStack Form accepts it at runtime;
 * we cast for TS until form types pick up Standard Schema on ZodObject.
 */
import { z } from 'zod'

export const shopInfoFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name is too short')
    .max(64, 'Name is too long'),
  description: z.string().max(2000, 'Description is too long'),
  currency: z.enum([
    'USD',
    'EUR',
    'RUB',
    'UAH',
    'GBP',
    'BRL',
    'TRY',
    'INR',
    'IDR',
    'KZT',
    'PLN',
    'ARS',
  ]),
})

export type ShopInfoFormValues = z.infer<typeof shopInfoFormSchema>

export const methodFormSchema = z.object({
  method: z
    .string()
    .min(2, 'Method name is too short')
    .max(120, 'Method name is too long'),
})

export type MethodFormValues = z.infer<typeof methodFormSchema>

/** Cast Zod schema for TanStack Form `validators.onSubmit` / `onChange`. */
export function formSchema<T extends z.ZodType>(schema: T) {
  return schema as unknown as T & { '~standard': unknown }
}
