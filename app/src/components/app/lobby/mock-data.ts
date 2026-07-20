/**
 * Shared mock data for lobby sheets (frontend demo until real APIs wire up).
 */

export type MockShop = {
  id: string
  name: string
  category: string
  status: 'live' | 'draft' | 'paused'
}

export type FavShop = {
  id: string
  name: string
  tagline: string
  rating: number
  items: number
  emoji: string
  /** When the user saved this shop */
  savedAt: string
  /** Whether the storefront is currently open */
  isOpen: boolean
}

export type MockProduct = {
  name: string
  price: string
  tag: string | null
}

export const MOCK_MY_SHOP: MockShop = {
  id: 'shop_01',
  name: 'Nova Merch Co.',
  category: 'Streetwear & Accessories',
  status: 'live',
}

const FAV_SHOP_SEEDS: Omit<FavShop, 'id' | 'savedAt' | 'isOpen'>[] = [
  { name: 'Lumen Goods', tagline: 'Minimal homeware', rating: 4.9, items: 126, emoji: '✦' },
  { name: 'Pixel Pantry', tagline: 'Digital snacks & tools', rating: 4.7, items: 84, emoji: '◈' },
  { name: 'Orbit Lab', tagline: 'Tech & gadgets', rating: 4.8, items: 210, emoji: '◎' },
  { name: 'Soft Form', tagline: 'Apparel studio', rating: 4.6, items: 67, emoji: '◇' },
  { name: 'Cedar & Co', tagline: 'Artisan goods', rating: 5.0, items: 42, emoji: '✧' },
  { name: 'Northwind Market', tagline: 'Organic groceries', rating: 4.5, items: 320, emoji: '◆' },
  { name: 'Velvet Room', tagline: 'Beauty & skincare', rating: 4.8, items: 95, emoji: '❖' },
  { name: 'Frame & Folio', tagline: 'Prints & stationery', rating: 4.4, items: 158, emoji: '▣' },
  { name: 'Trailhead Supply', tagline: 'Outdoor gear', rating: 4.9, items: 187, emoji: '▲' },
  { name: 'Circuit Bay', tagline: 'Electronics parts', rating: 4.3, items: 540, emoji: '⬡' },
  { name: 'Bloom Cart', tagline: 'Fresh flowers', rating: 4.7, items: 38, emoji: '✿' },
  { name: 'Keystone Books', tagline: 'Indie bookstore', rating: 4.9, items: 412, emoji: '▤' },
  { name: 'Harbor Roast', tagline: 'Specialty coffee', rating: 4.8, items: 56, emoji: '●' },
  { name: 'Mono Desk', tagline: 'Office essentials', rating: 4.2, items: 143, emoji: '▭' },
  { name: 'Petal & Paw', tagline: 'Pet supplies', rating: 4.6, items: 201, emoji: '♡' },
  { name: 'Ironclad Tools', tagline: 'DIY hardware', rating: 4.5, items: 278, emoji: '⚒' },
  { name: 'Sunset Vinyl', tagline: 'Records & audio', rating: 4.9, items: 89, emoji: '◎' },
  { name: 'Cloud Nine Toys', tagline: 'Kids & games', rating: 4.4, items: 165, emoji: '✧' },
  { name: 'Silk Route Spices', tagline: 'World pantry', rating: 4.7, items: 112, emoji: '◈' },
  { name: 'Aether Fitness', tagline: 'Activewear', rating: 4.6, items: 98, emoji: '⚡' },
  { name: 'Paper Crane Co', tagline: 'Gifts & wrapping', rating: 4.3, items: 74, emoji: '✦' },
  { name: 'Nova Optics', tagline: 'Eyewear', rating: 4.8, items: 61, emoji: '◉' },
  { name: 'Greenline Plants', tagline: 'Indoor plants', rating: 4.5, items: 133, emoji: '☘' },
  { name: 'Byte Boutique', tagline: 'Phone accessories', rating: 4.1, items: 247, emoji: '▣' },
  { name: 'Marble & Grain', tagline: 'Kitchenware', rating: 4.7, items: 119, emoji: '◇' },
]

const SAVED_LABELS = [
  'Saved today',
  'Saved 1d ago',
  'Saved 2d ago',
  'Saved 3d ago',
  'Saved 5d ago',
  'Saved 1w ago',
  'Saved 2w ago',
  'Saved 3w ago',
  'Saved 1mo ago',
  'Saved 2mo ago',
  'Saved 3mo ago',
]

export const MOCK_FAV_SHOPS: FavShop[] = FAV_SHOP_SEEDS.map((seed, i) => ({
  ...seed,
  id: `fav_${i + 1}`,
  savedAt: SAVED_LABELS[i % SAVED_LABELS.length]!,
  isOpen: i % 5 !== 2,
}))

export const MOCK_PRODUCTS: MockProduct[] = [
  { name: 'Classic Hoodie', price: '$64', tag: 'Popular' },
  { name: 'Logo Cap', price: '$28', tag: 'New' },
  { name: 'Everyday Tee', price: '$32', tag: null },
  { name: 'Crew Socks 3-pack', price: '$18', tag: null },
  { name: 'Zip Track Jacket', price: '$89', tag: 'Popular' },
  { name: 'Cargo Joggers', price: '$72', tag: null },
  { name: 'Oversized Denim Shirt', price: '$58', tag: 'New' },
  { name: 'Ribbed Beanie', price: '$22', tag: null },
  { name: 'Canvas Tote', price: '$26', tag: null },
  { name: 'Leather Belt', price: '$45', tag: null },
  { name: 'Fleece Half-Zip', price: '$76', tag: 'Popular' },
  { name: 'Performance Shorts', price: '$38', tag: null },
  { name: 'Linen Camp Shirt', price: '$54', tag: 'New' },
  { name: 'Wool Scarf', price: '$42', tag: null },
  { name: 'Trail Runner Sneakers', price: '$118', tag: 'Popular' },
  { name: 'Court Low Sneakers', price: '$96', tag: null },
  { name: 'Nylon Crossbody', price: '$48', tag: null },
  { name: 'Insulated Bottle 32oz', price: '$34', tag: null },
  { name: 'Phone Crossbody Case', price: '$29', tag: 'New' },
  { name: 'Merino Base Layer', price: '$68', tag: null },
  { name: 'Quilted Vest', price: '$82', tag: null },
  { name: 'Relaxed Chinos', price: '$62', tag: null },
  { name: 'Pique Polo', price: '$44', tag: null },
  { name: 'Graphic Longsleeve', price: '$36', tag: null },
  { name: 'Packable Windbreaker', price: '$79', tag: 'Popular' },
  { name: 'Slip-On Mules', price: '$52', tag: null },
  { name: 'Structured Backpack', price: '$98', tag: 'New' },
  { name: 'Cotton Boxers 2-pack', price: '$24', tag: null },
  { name: 'Aviator Sunglasses', price: '$56', tag: null },
  { name: 'Silk Scrunchie Set', price: '$16', tag: null },
  { name: 'Waffle Lounge Pants', price: '$48', tag: null },
  { name: 'Heavyweight Crewneck', price: '$66', tag: 'Popular' },
  { name: 'Utility Work Shirt', price: '$59', tag: null },
  { name: 'Mini Pouch Wallet', price: '$31', tag: null },
  { name: 'Sport Ankle Socks', price: '$14', tag: null },
  { name: 'Rain Shell Jacket', price: '$124', tag: 'New' },
  { name: 'Corduroy Overshirt', price: '$71', tag: null },
  { name: 'Knit Fingerless Gloves', price: '$19', tag: null },
  { name: 'Weekend Duffel', price: '$88', tag: null },
  { name: 'Essential Tank', price: '$22', tag: null },
]

export const DASHBOARD_STATS = [
  {
    label: 'Products',
    value: String(MOCK_PRODUCTS.length),
    delta: '+3 this week',
  },
  { label: 'Orders', value: '12', delta: 'Today' },
  { label: 'Revenue', value: '$2.8k', delta: '+18%' },
  { label: 'Visitors', value: '1.2k', delta: '7 days' },
] as const
