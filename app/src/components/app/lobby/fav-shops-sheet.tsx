/**
 * Saved favourite shops list — Telegram chat-list style.
 * Tap a row to open storefront (mock); heart removes from list.
 */
import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card } from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '#/components/ui/sheet'
import { cn } from '#/lib/utils'
import { ChevronRightIcon, HeartIcon, StarIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FavShop } from './mock-data'

export function FavShopsSheet({
  open,
  onOpenChange,
  shops,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  shops: FavShop[]
}) {
  const [saved, setSaved] = useState(shops)

  useEffect(() => {
    if (open) setSaved(shops)
  }, [open, shops])

  const removeFavourite = (id: string) => {
    setSaved((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="mx-auto flex max-h-[90dvh] max-w-lg flex-col gap-0 overflow-hidden rounded-t-2xl p-0"
      >
        <SheetHeader className="shrink-0 border-b border-border/60 text-left">
          <SheetTitle>Favourite shops</SheetTitle>
          <SheetDescription>
            {saved.length === 0
              ? 'No saved shops yet'
              : `${saved.length} shop${saved.length === 1 ? '' : 's'} you saved`}
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3">
          {saved.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                <HeartIcon className="size-6" />
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-foreground">
                  Nothing saved
                </p>
                <p className="text-sm text-muted-foreground">
                  Tap the heart on any storefront to keep it here for quick
                  access.
                </p>
              </div>
            </div>
          ) : (
            <Card className="gap-0 overflow-hidden border-border/60 py-0 shadow-none">
              {saved.map((shop, i) => (
                <div key={shop.id}>
                  {i > 0 && <Separator />}
                  <div className="flex items-center gap-1 pr-1">
                    <button
                      type="button"
                      className={cn(
                        'flex min-w-0 flex-1 items-center gap-3 px-3 py-3.5 text-left',
                        'transition-colors hover:bg-accent/50 active:bg-accent',
                        'outline-none focus-visible:bg-accent',
                      )}
                      onClick={() => {
                        console.log('Open favourite shop', shop.id)
                      }}
                    >
                      <Avatar className="size-11">
                        <AvatarFallback className="bg-secondary text-base">
                          {shop.emoji}
                        </AvatarFallback>
                      </Avatar>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-[15px] font-medium text-foreground">
                            {shop.name}
                          </span>
                          <Badge
                            variant={shop.isOpen ? 'default' : 'secondary'}
                            className="shrink-0 text-[10px]"
                          >
                            {shop.isOpen ? 'Open' : 'Closed'}
                          </Badge>
                        </span>
                        <span className="mt-0.5 block truncate text-sm text-muted-foreground">
                          {shop.tagline}
                        </span>
                        <span className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-0.5">
                            <StarIcon className="size-3 fill-primary text-primary" />
                            {shop.rating.toFixed(1)}
                          </span>
                          <span>·</span>
                          <span>{shop.items} items</span>
                          <span>·</span>
                          <span>{shop.savedAt}</span>
                        </span>
                      </span>
                      <ChevronRightIcon className="size-5 shrink-0 text-muted-foreground" />
                    </button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-chart-4"
                      aria-label={`Remove ${shop.name} from favourites`}
                      onClick={() => removeFavourite(shop.id)}
                    >
                      <HeartIcon className="size-5 fill-current" />
                    </Button>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </div>

        {saved.length > 0 && (
          <SheetFooter className="shrink-0 border-t border-border/60">
            <p className="w-full text-center text-xs text-muted-foreground">
              Tap a shop to open · filled heart removes it · scroll for more
            </p>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
