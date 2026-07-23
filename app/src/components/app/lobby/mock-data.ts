/**
 * Lobby mocks: exactly one owned shop + a long favorites list (scroll stress-test).
 *
 * Usage:
 *   import { myShop, favoriteShops } from './mock-data'
 */

import type { FavoriteShop, MyShop } from './types'

export const myShop: MyShop = {
  id: 'my_shop_1',
  name: 'Nova Merch Co.',
  tagline: 'Streetwear & accessories',
  status: 'live',
}

const FAV_SEEDS: { name: string; tagline: string }[] = [
  { name: 'Lumen Goods', tagline: 'Minimal homeware' },
  { name: 'Pixel Pantry', tagline: 'Digital snacks & tools' },
  { name: 'Orbit Lab', tagline: 'Tech & gadgets' },
  { name: 'Soft Form', tagline: 'Apparel studio' },
  { name: 'Cedar & Co', tagline: 'Artisan goods' },
  { name: 'Northwind Market', tagline: 'Organic groceries' },
  { name: 'Velvet Room', tagline: 'Beauty & skincare' },
  { name: 'Frame & Folio', tagline: 'Prints & stationery' },
  { name: 'Trailhead Supply', tagline: 'Outdoor gear' },
  { name: 'Circuit Bay', tagline: 'Electronics parts' },
  { name: 'Bloom Cart', tagline: 'Fresh flowers' },
  { name: 'Keystone Books', tagline: 'Indie bookstore' },
  { name: 'Harbor Roast', tagline: 'Specialty coffee' },
  { name: 'Mono Desk', tagline: 'Office essentials' },
  { name: 'Petal & Paw', tagline: 'Pet supplies' },
  { name: 'Ironclad Tools', tagline: 'DIY hardware' },
  { name: 'Sunset Vinyl', tagline: 'Records & audio' },
  { name: 'Cloud Nine Toys', tagline: 'Kids & games' },
  { name: 'Silk Route Spices', tagline: 'World pantry' },
  { name: 'Aether Fitness', tagline: 'Activewear' },
]

/** ~60 favorites for scroll / density testing */
export const favoriteShops: FavoriteShop[] = Array.from(
  { length: 60 },
  (_, i) => {
    const seed = FAV_SEEDS[i % FAV_SEEDS.length]!
    const batch = Math.floor(i / FAV_SEEDS.length)
    const suffix = batch > 0 ? ` ${batch + 1}` : ''
    return {
      id: `fav_${i + 1}`,
      name: `${seed.name}${suffix}`,
      tagline: seed.tagline,
      isOpen: i % 5 !== 2,
    }
  },
)
