/**
 * Mock “visualize shop” bottom sheet (client-view stub).
 *
 * Props: open, onOpenChange, shop (ShopPreview | null).
 *
 * Usage:
 *   <ShopPreviewSheet open={!!preview} onOpenChange={…} shop={preview} />
 */

import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '#/components/ui/sheet'
import type { ShopPreview } from './types'

export function ShopPreviewSheet({
  open,
  onOpenChange,
  shop,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  shop: ShopPreview | null
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="mx-auto flex max-h-[85dvh] max-w-lg flex-col gap-0 overflow-hidden rounded-t-2xl border-border/60 p-0"
      >
        <SheetHeader className="shrink-0 border-b border-border/60 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <SheetTitle>{shop?.name ?? 'Shop'}</SheetTitle>
            <Badge variant="secondary">
              {shop?.kind === 'owned' ? 'Your shop' : 'Favorite'}
            </Badge>
          </div>
          <SheetDescription>
            {shop?.tagline ?? 'Mock storefront preview'}
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4">
            <div className="flex h-24 items-end rounded-xl bg-primary/10 px-3 py-3">
              <div>
                <p className="text-base font-semibold text-foreground">
                  {shop?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Customer view (mock)
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              This is a lightweight preview only. Real storefront products and
              checkout will load here later.
            </p>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li className="rounded-xl bg-muted/50 px-3 py-2.5">
                Sample product A · —
              </li>
              <li className="rounded-xl bg-muted/50 px-3 py-2.5">
                Sample product B · —
              </li>
              <li className="rounded-xl bg-muted/50 px-3 py-2.5">
                Sample product C · —
              </li>
            </ul>
          </div>
        </div>

        <SheetFooter className="shrink-0 border-t border-border/60">
          <Button
            type="button"
            className="w-full min-h-11"
            onClick={() => onOpenChange(false)}
          >
            Close preview
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
