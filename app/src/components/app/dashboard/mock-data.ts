/**
 * Dashboard mock data — mirrors `db/schema.ts` fields.
 * Replace with server functions when wiring real APIs.
 */

export type Currency =
  | 'USD'
  | 'EUR'
  | 'RUB'
  | 'UAH'
  | 'GBP'
  | 'BRL'
  | 'TRY'
  | 'INR'
  | 'IDR'
  | 'KZT'
  | 'PLN'
  | 'ARS'

export type ShopInfo = {
  id: string
  userId: string
  name: string
  description: string
  currency: Currency
}

export type ShopClient = {
  id: string
  shopId: string
  userId: string
  username: string
  role: 'owner' | 'client'
  banned: boolean
  timeoutUntil: string | null
  memberSince: string
}

export type Product = {
  id: string
  shopId: string
  name: string
  price: number // integer minor units or whole currency units (demo: whole)
  description: string
  images: string | null
  hidden: boolean
  outOfStock: boolean
}

export type ShippingMethod = {
  id: string
  shopId: string
  method: string
}

export type PaymentMethod = {
  id: string
  shopId: string
  method: string
}

export const SHOP_ID = 'shop_01'

export const MOCK_SHOP: ShopInfo = {
  id: SHOP_ID,
  userId: 'user_owner',
  name: 'Nova Merch Co.',
  description:
    'Streetwear and accessories for the Telegram-native crowd. Ships EU-wide.',
  currency: 'EUR',
}

export const MOCK_CLIENTS: ShopClient[] = [
  {
    id: 'cli_1',
    shopId: SHOP_ID,
    userId: 'u_2',
    username: 'alex_buyer',
    role: 'client',
    banned: false,
    timeoutUntil: null,
    memberSince: '2026-03-12T10:00:00Z',
  },
  {
    id: 'cli_2',
    shopId: SHOP_ID,
    userId: 'u_3',
    username: 'mira.k',
    role: 'client',
    banned: false,
    timeoutUntil: null,
    memberSince: '2026-04-02T14:20:00Z',
  },
  {
    id: 'cli_3',
    shopId: SHOP_ID,
    userId: 'u_4',
    username: 'jon_doe',
    role: 'client',
    banned: true,
    timeoutUntil: null,
    memberSince: '2026-01-18T09:00:00Z',
  },
  {
    id: 'cli_4',
    shopId: SHOP_ID,
    userId: 'u_5',
    username: 'sofia_r',
    role: 'client',
    banned: false,
    timeoutUntil: '2026-07-25T00:00:00Z',
    memberSince: '2026-05-01T11:30:00Z',
  },
  {
    id: 'cli_5',
    shopId: SHOP_ID,
    userId: 'u_6',
    username: 'kai_shopper',
    role: 'client',
    banned: false,
    timeoutUntil: null,
    memberSince: '2026-06-10T16:45:00Z',
  },
  {
    id: 'cli_6',
    shopId: SHOP_ID,
    userId: 'u_7',
    username: 'lena.v',
    role: 'client',
    banned: false,
    timeoutUntil: null,
    memberSince: '2026-02-22T08:15:00Z',
  },
  {
    id: 'cli_7',
    shopId: SHOP_ID,
    userId: 'u_8',
    username: 'tom_w',
    role: 'client',
    banned: false,
    timeoutUntil: null,
    memberSince: '2026-07-01T12:00:00Z',
  },
  {
    id: 'cli_8',
    shopId: SHOP_ID,
    userId: 'u_9',
    username: 'nara_b',
    role: 'client',
    banned: false,
    timeoutUntil: null,
    memberSince: '2026-06-28T19:00:00Z',
  },
]

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prd_1',
    shopId: SHOP_ID,
    name: 'Classic Hoodie',
    price: 64,
    description: 'Heavyweight cotton hoodie',
    images: null,
    hidden: false,
    outOfStock: false,
  },
  {
    id: 'prd_2',
    shopId: SHOP_ID,
    name: 'Logo Cap',
    price: 28,
    description: 'Embroidered cap',
    images: null,
    hidden: false,
    outOfStock: false,
  },
  {
    id: 'prd_3',
    shopId: SHOP_ID,
    name: 'Everyday Tee',
    price: 32,
    description: 'Soft jersey tee',
    images: null,
    hidden: false,
    outOfStock: true,
  },
  {
    id: 'prd_4',
    shopId: SHOP_ID,
    name: 'Crew Socks 3-pack',
    price: 18,
    description: 'Cotton blend',
    images: null,
    hidden: true,
    outOfStock: false,
  },
  {
    id: 'prd_5',
    shopId: SHOP_ID,
    name: 'Zip Track Jacket',
    price: 89,
    description: 'Lightweight shell',
    images: null,
    hidden: false,
    outOfStock: false,
  },
  {
    id: 'prd_6',
    shopId: SHOP_ID,
    name: 'Cargo Joggers',
    price: 72,
    description: 'Tapered fit',
    images: null,
    hidden: false,
    outOfStock: false,
  },
  {
    id: 'prd_7',
    shopId: SHOP_ID,
    name: 'Oversized Denim Shirt',
    price: 58,
    description: 'Washed denim',
    images: null,
    hidden: false,
    outOfStock: false,
  },
  {
    id: 'prd_8',
    shopId: SHOP_ID,
    name: 'Ribbed Beanie',
    price: 22,
    description: 'Merino blend',
    images: null,
    hidden: false,
    outOfStock: false,
  },
  {
    id: 'prd_9',
    shopId: SHOP_ID,
    name: 'Canvas Tote',
    price: 26,
    description: 'Daily carry',
    images: null,
    hidden: false,
    outOfStock: false,
  },
  {
    id: 'prd_10',
    shopId: SHOP_ID,
    name: 'Packable Windbreaker',
    price: 79,
    description: 'Packs into pocket',
    images: null,
    hidden: false,
    outOfStock: true,
  },
]

export const MOCK_SHIPPING: ShippingMethod[] = [
  { id: 'ship_1', shopId: SHOP_ID, method: 'Standard EU (3–5 days)' },
  { id: 'ship_2', shopId: SHOP_ID, method: 'Express (1–2 days)' },
  { id: 'ship_3', shopId: SHOP_ID, method: 'Pickup in store' },
]

export const MOCK_PAYMENTS: PaymentMethod[] = [
  { id: 'pay_1', shopId: SHOP_ID, method: 'Telegram Stars' },
  { id: 'pay_2', shopId: SHOP_ID, method: 'Card (Stripe)' },
  { id: 'pay_3', shopId: SHOP_ID, method: 'Cash on delivery' },
]

export const CURRENCIES: Currency[] = [
  'EUR',
  'USD',
  'GBP',
  'RUB',
  'UAH',
  'BRL',
  'TRY',
  'INR',
  'PLN',
  'ARS',
  'KZT',
  'IDR',
]

export function formatPrice(amount: number, currency: Currency) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${amount} ${currency}`
  }
}

export function formatMemberSince(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(iso))
}
