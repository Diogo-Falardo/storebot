/**
 * Dashboard home — overview stats + Telegram nav cells into sub-panels.
 */
import { Badge } from '#/components/ui/badge'
import { Separator } from '#/components/ui/separator'
import { TelegramCell } from '#/components/app/lobby/telegram-cell'
import {
  CreditCardIcon,
  PackageIcon,
  StoreIcon,
  TruckIcon,
  UsersIcon,
} from 'lucide-react'
import type { Product, ShopClient, ShopInfo } from './mock-data'
import { StatTile } from './stat-tile'
import { TelegramSection } from './telegram-section'
import type { DashboardPanel } from './types'

export function DashboardHome({
  shop,
  clients,
  products,
  onOpen,
}: {
  shop: ShopInfo
  clients: ShopClient[]
  products: Product[]
  onOpen: (panel: DashboardPanel) => void
}) {
  const activeClients = clients.filter((c) => !c.banned).length
  const listed = products.filter((p) => !p.hidden).length
  const oos = products.filter((p) => p.outOfStock).length

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-2xl border border-border/60 bg-card px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium tracking-wide text-primary uppercase">
              Your shop
            </p>
            <h2 className="mt-0.5 truncate text-xl font-semibold text-foreground">
              {shop.name}
            </h2>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {shop.description}
            </p>
          </div>
          <Badge variant="secondary">{shop.currency}</Badge>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-2">
        <StatTile label="Clients" value={activeClients} hint="Active members" />
        <StatTile label="Products" value={listed} hint={`${oos} out of stock`} />
      </div>

      <TelegramSection title="Manage">
        <TelegramCell
          icon={<UsersIcon />}
          iconClass="bg-primary text-primary-foreground"
          title="Clients"
          subtitle="Ban, timeout, membership"
          trailing={<Badge variant="secondary">{clients.length}</Badge>}
          onClick={() => onOpen('clients')}
        />
        <Separator />
        <TelegramCell
          icon={<PackageIcon />}
          iconClass="bg-chart-3 text-primary-foreground"
          title="Products"
          subtitle="Catalog, stock, visibility"
          trailing={<Badge variant="secondary">{products.length}</Badge>}
          onClick={() => onOpen('products')}
        />
      </TelegramSection>

      <TelegramSection title="Shop setup">
        <TelegramCell
          icon={<StoreIcon />}
          iconClass="bg-chart-2 text-primary-foreground"
          title="Shop information"
          subtitle="Name, description, currency"
          onClick={() => onOpen('shop-info')}
        />
        <Separator />
        <TelegramCell
          icon={<CreditCardIcon />}
          iconClass="bg-chart-5 text-primary-foreground"
          title="Payment methods"
          subtitle="How customers pay"
          onClick={() => onOpen('payments')}
        />
        <Separator />
        <TelegramCell
          icon={<TruckIcon />}
          iconClass="bg-chart-4 text-primary-foreground"
          title="Shipping methods"
          subtitle="Delivery options"
          onClick={() => onOpen('shipping')}
        />
      </TelegramSection>
    </div>
  )
}
