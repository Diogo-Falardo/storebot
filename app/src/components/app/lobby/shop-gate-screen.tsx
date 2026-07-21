import { type Ref } from 'react'
import { Card } from '#/components/ui/card'
import { cn } from '#/lib/utils'
import {
  ChevronRightIcon,
  LayoutDashboardIcon,
  ShoppingBagIcon,
} from 'lucide-react'
import type { MockShop } from './mock-data'
export type { MockShop }

/**
 * Intermediate screen after “My Shop”:
 * choose owner dashboard vs customer storefront.
 */
export function ShopGateScreen({
  innerRef,
  shop,
  onDashboard,
  onShop,
}: {
  innerRef?: Ref<HTMLDivElement>
  shop: MockShop
  onDashboard: () => void
  onShop: () => void
}) {

  return (
    <div
      ref={innerRef}
      className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-6"
      style={{ opacity: 0 }}
    >
      <div className="mb-6 flex flex-col gap-1 px-1">
        <p className="text-sm text-muted-foreground">{shop.name}</p>
        <h2 className="text-xl font-semibold text-foreground">
          Where do you want to go?
        </h2>
      </div>

      <Card className="gap-3 p-3 shadow-none">
        <button
          type="button"
          data-gate-option
          onClick={onDashboard}
          className={cn(
            'flex w-full items-center gap-4 rounded-2xl border border-border/60',
            'bg-card px-4 py-5 text-left transition-colors',
            'hover:bg-accent/50 active:bg-accent',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          )}
          style={{ opacity: 0 }}
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground [&_svg]:size-6">
            <LayoutDashboardIcon />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-bold tracking-wide text-foreground uppercase">
              Dashboard
            </span>
            <span className="mt-0.5 block text-sm text-muted-foreground">
              Manage products, orders & settings
            </span>
          </span>
          <ChevronRightIcon className="size-5 shrink-0 text-muted-foreground" />
        </button>

        <button
          type="button"
          data-gate-option
          onClick={onShop}
          className={cn(
            'flex w-full items-center gap-4 rounded-2xl border border-border/60',
            'bg-card px-4 py-5 text-left transition-colors',
            'hover:bg-accent/50 active:bg-accent',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          )}
          style={{ opacity: 0 }}
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-chart-2 text-primary-foreground [&_svg]:size-6">
            <ShoppingBagIcon />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-bold tracking-wide text-foreground uppercase">
              Shop
            </span>
            <span className="mt-0.5 block text-sm text-muted-foreground">
              Preview storefront as customers see it
            </span>
          </span>
          <ChevronRightIcon className="size-5 shrink-0 text-muted-foreground" />
        </button>
      </Card>

      <p className="mt-auto pt-8 text-center text-xs text-muted-foreground">
        You can switch anytime from here
      </p>
    </div>
  )
}
