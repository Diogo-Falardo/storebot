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
