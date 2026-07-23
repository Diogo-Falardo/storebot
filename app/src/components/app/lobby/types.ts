/**
 * Lobby domain types — one owned shop, many favorites.
 */

export type MyShop = {
  id: string
  name: string
  tagline?: string
  status?: 'live' | 'draft'
}

export type FavoriteShop = {
  id: string
  name: string
  tagline?: string
  isOpen?: boolean
}

/** Payload for the single shared preview sheet */
export type ShopPreview = {
  id: string
  name: string
  tagline?: string
  kind: 'owned' | 'favorite'
}
