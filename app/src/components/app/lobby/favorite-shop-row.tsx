/**
 * Dense Telegram list row for a favorite shop.
 * Full-row tap opens visualize; chevron only (no heavy per-row actions).
 *
 * Props: shop, onVisualize.
 *
 * Usage:
 *   <FavoriteShopRow shop={f} onVisualize={openPreview} />
 */

import { Badge } from '#/components/ui/badge'
import { cn } from '#/lib/utils'
import { ChevronRightIcon } from 'lucide-react'
import type { FavoriteShop } from './types'

export function FavoriteShopRow({
  shop,
  onVisualize,
}: {
  shop: FavoriteShop
  onVisualize: (shop: FavoriteShop) => void
}) {
  return (
    <button
      type="button"
      data-lobby-row
      onClick={() => onVisualize(shop)}
      className={cn(
        'flex w-full min-h-14 items-center gap-3 px-4 py-2.5 text-left',
        'transition-colors outline-none',
        'hover:bg-accent/50 active:bg-accent',
        'focus-visible:bg-accent',
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
        {shop.name.slice(0, 1)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-1.5">
          <span className="truncate text-[15px] font-medium text-foreground">
            {shop.name}
          </span>
          {shop.isOpen === true ? (
            <Badge variant="default" className="text-[10px]">
              Open
            </Badge>
          ) : shop.isOpen === false ? (
            <Badge variant="secondary" className="text-[10px]">
              Closed
            </Badge>
          ) : null}
        </span>
        {shop.tagline ? (
          <span className="mt-0.5 block truncate text-sm text-muted-foreground">
            {shop.tagline}
          </span>
        ) : null}
      </span>
      <ChevronRightIcon className="size-5 shrink-0 text-muted-foreground" />
    </button>
  )
}
