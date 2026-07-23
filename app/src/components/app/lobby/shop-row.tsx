/**
 * Single owned shop center cell — Dashboard + Visualize.
 *
 * Props: shop (MyShop), onDashboard, onVisualize.
 *
 * Usage:
 *   <ShopRow shop={myShop} onDashboard={…} onVisualize={…} />
 */

import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { LayoutDashboardIcon, StoreIcon } from 'lucide-react'
import type { MyShop } from './types'

export function ShopRow({
  shop,
  onDashboard,
  onVisualize,
}: {
  shop: MyShop
  onDashboard: (shop: MyShop) => void
  onVisualize: (shop: MyShop) => void
}) {
  return (
    <div className="flex flex-col gap-3 px-4 py-3.5" data-lobby-row>
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
          {shop.name.slice(0, 1)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="truncate text-[15px] font-medium text-foreground">
              {shop.name}
            </p>
            {shop.status === 'live' ? (
              <Badge variant="default" className="text-[10px]">
                Live
              </Badge>
            ) : shop.status === 'draft' ? (
              <Badge variant="secondary" className="text-[10px]">
                Draft
              </Badge>
            ) : null}
          </div>
          {shop.tagline ? (
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {shop.tagline}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="min-h-11 flex-1"
          onClick={() => onDashboard(shop)}
        >
          <LayoutDashboardIcon data-icon="inline-start" />
          Dashboard
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-11 flex-1 border-border/60"
          onClick={() => onVisualize(shop)}
        >
          <StoreIcon data-icon="inline-start" />
          Visualize
        </Button>
      </div>
    </div>
  )
}
