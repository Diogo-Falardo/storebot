import { z } from 'zod'

export const ORDER_STATUS_ENUM = z.enum(
  [
    'pending',
    'accepted',
    'awaiting_payment',
    'cancelled',
    'awaiting_shipment',
    'shipped',
    'delivered',
    'returned',
    'refunded',
  ],
  {
    message: 'Please select a order status',
  },
)
export type OrderStatus = z.infer<typeof ORDER_STATUS_ENUM>
/**
 * RECEIVE AN ORDER
 *
 * Order request form
 */
export const RECEIVE_ORDER = z.object({
  orderIdentifier: z
    .string()
    .min(1, { message: 'Please provide identification' })
    .max(255, { message: 'Indentification limit of 255 characters' }),
  orderPaymentMethod: z.uuid(),
  orderShippingMethod: z.uuid(),
  orderDeliveryInstruction: z
    .string()
    .max(1000, { message: 'Delivery instruction too long' }),
  productsId: z.array(z.uuid()),
})
export type DTO_RECEIVE_ORDER = z.infer<typeof RECEIVE_ORDER>

export const ORDER_VISUALIZATION = z.object({
  id: z.uuid(),
  orderStatus: ORDER_STATUS_ENUM,
  orderIdentifier: z.string(),
  orderDeliveryInstruction: z.string(),
  orderCustomMessage: z.string().nullable(),
  orderShippingMethod: z.uuid(),
  orderPaymentMethod: z.uuid(),
  createdAt: z.string(),
})
export type ORDER_SCHEMA = z.infer<typeof ORDER_VISUALIZATION>

export const CREATE_ORDER_CUSTOM_MESSGE = z.object({
  orderCustomMessage: z
    .string()
    .min(1, { message: 'Order custom message cant be empty' })
    .max(2500, {
      message: 'Order custom message has a max limit of 2500 characters',
    }),
})
