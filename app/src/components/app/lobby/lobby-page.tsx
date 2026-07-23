/**
 * Lobby composition — one owned shop center + long favorites list.
 * No auth/fetch; mock data only.
 *
 * Usage:
 *   {user && <LobbyPage user={user} />}
 */

import { Separator } from '#/components/ui/separator'
import type { OutputUser } from '#/db/schemas/user/user.types'
import { useState } from 'react'
import { FavoriteShopRow } from './favorite-shop-row'
import { LobbyHeader } from './lobby-header'
import { favoriteShops, myShop } from './mock-data'
import { ShopPreviewSheet } from './shop-preview-sheet'
import { ShopRow } from './shop-row'
import { ShopSection } from './shop-section'
import type { FavoriteShop, MyShop, ShopPreview } from './types'

export function LobbyPage({ user }: { user: OutputUser }) {
  const [preview, setPreview] = useState<ShopPreview | null>(null)

  const openOwnedPreview = (shop: MyShop) => {
    setPreview({
      id: shop.id,
      name: shop.name,
      tagline: shop.tagline,
      kind: 'owned',
    })
  }

  const openFavoritePreview = (shop: FavoriteShop) => {
    setPreview({
      id: shop.id,
      name: shop.name,
      tagline: shop.tagline,
      kind: 'favorite',
    })
  }

  const onDashboard = (shop: MyShop) => {
    // TODO: navigate to real dashboard when route + shopId are ready
    console.log('[lobby] Dashboard (mock)', shop.id, shop.name)
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <LobbyHeader username={user.username} />

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-5 px-3 py-4 pb-10">
        {/* Exactly one owned shop */}
        <ShopSection title="My shop">
          <ShopRow
            shop={myShop}
            onDashboard={onDashboard}
            onVisualize={openOwnedPreview}
          />
        </ShopSection>

        {/* Many favorites — natural page scroll */}
        <ShopSection
          title="Favorite shops"
          count={favoriteShops.length}
          animate
        >
          {favoriteShops.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              No favorites yet
            </p>
          ) : (
            favoriteShops.map((shop, i) => (
              <div key={shop.id}>
                {i > 0 ? <Separator /> : null}
                <FavoriteShopRow
                  shop={shop}
                  onVisualize={openFavoritePreview}
                />
              </div>
            ))
          )}
        </ShopSection>

        <p className="text-center text-xs text-muted-foreground">
          Mock shop center · one shop · {favoriteShops.length} favorites
        </p>
      </main>

      <ShopPreviewSheet
        open={preview != null}
        onOpenChange={(open) => {
          if (!open) setPreview(null)
        }}
        shop={preview}
      />
    </div>
  )
}
