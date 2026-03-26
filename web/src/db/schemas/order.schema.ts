import { z } from 'zod'

export const enum_ORDER_STATUS = z.enum(
  [
    'pending',
    'accepted',
    'awaiting_payment',
    'in_progress',
    'shipped',
    'completed',
    'failed',
  ],
  {
    message: 'Please select a order status',
  },
)
export type type_enum_ORDER_STATUS = z.infer<typeof enum_ORDER_STATUS>

// db order schema
export const schema_ORDER = z.object({
  orderId: z.uuid(),
  storeId: z.uuid(),
  orderStatus: enum_ORDER_STATUS,
  orderIdentifier: z
    .string()
    .min(1, { message: 'Please provide identification' })
    .max(255, { message: 'Indentification limit of 255 characters' }),
  telegramUserId: z.number(),
  orderPaymentMethod: z.uuid({ message: 'Invalid payment method' }),
  orderShippingMethod: z.uuid({ message: 'Invalid shipping method' }),
  orderDeliveryInstruction: z
    .string()
    .min(1, { message: 'Please provide delivery instructions' })
    .max(1000, { message: 'Delivery instruction too long' }),
  orderCustomMessage: z
    .string()
    .min(1, { message: 'Order custom message cant be empty' })
    .max(2500, {
      message: 'Order custom message has a max limit of 2500 characters',
    }),
  orderCreatedAt: z.string(),
})
export type type_schema_ORDER = z.infer<typeof schema_ORDER>

// create || place an order
export const create_ORDER = schema_ORDER
  .pick({
    orderIdentifier: true,
    orderPaymentMethod: true,
    orderShippingMethod: true,
    orderDeliveryInstruction: true,
  })
  .extend({
    productsId: z.array(z.uuid()),
  })
export type type_create_ORDER = z.infer<typeof create_ORDER>
