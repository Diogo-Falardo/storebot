/**
 * Customer storefront preview — product list as buyers would see it.
 */
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '#/components/ui/sheet'
import { MOCK_PRODUCTS, type MockShop } from './mock-data'

export function ClientShopSheet({
  open,
  onOpenChange,
  shop,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  shop: MockShop
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="mx-auto flex max-h-[90dvh] max-w-lg flex-col gap-0 overflow-hidden rounded-t-2xl p-0"
      >
        <SheetHeader className="shrink-0 border-b border-border/60 text-left">
          <div className="flex items-center gap-2">
            <SheetTitle>{shop.name}</SheetTitle>
            <Badge variant="secondary">Customer view</Badge>
          </div>
          <SheetDescription>
            Preview how buyers browse your storefront · {MOCK_PRODUCTS.length}{' '}
            products
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
          <div className="flex flex-col gap-4">
            <Card className="gap-2 overflow-hidden py-0 shadow-none">
              <div className="flex h-28 items-end bg-primary/15 px-4 py-3">
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    {shop.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{shop.category}</p>
                </div>
              </div>
              <CardContent className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-muted-foreground">
                  Open · ships worldwide
                </span>
                <Badge variant="outline">Mock catalog</Badge>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Products ({MOCK_PRODUCTS.length})
              </p>
              <Card className="gap-0 overflow-hidden py-0 shadow-none">
                {MOCK_PRODUCTS.map((p, i) => (
                  <div key={`${p.name}-${i}`}>
                    {i > 0 && <Separator />}
                    <div className="flex items-center gap-3 px-4 py-3.5">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-sm font-semibold text-secondary-foreground">
                        {p.name.slice(0, 1)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {p.name}
                        </p>
                        <p className="text-sm text-primary">{p.price}</p>
                      </div>
                      {p.tag && <Badge variant="secondary">{p.tag}</Badge>}
                      <Button size="sm" variant="secondary">
                        Add
                      </Button>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </div>

        <SheetFooter className="shrink-0 border-t border-border/60">
          <Button className="w-full" onClick={() => onOpenChange(false)}>
            Close preview
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
