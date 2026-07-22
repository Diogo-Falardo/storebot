/**
 * Owner dashboard preview sheet — stats, quick actions, recent activity.
 */
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { sfCreateShop } from '#/server/shops/shops.function'

import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '#/components/ui/sheet'
import {
  ActivityIcon,
  BoxIcon,
  PackageIcon,
  ShoppingBagIcon,
  TrendingUpIcon,
} from 'lucide-react'
import { DASHBOARD_STATS, type MockShop } from './mock-data'

export function MyShopSheet({
  open,
  onOpenChange,
  shop,
  userId
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  shop: MockShop
  userId: string
}) {
  const navigate = useNavigate()
  const createShop = useServerFn(sfCreateShop)
  useEffect(() => {
    const _createShop = async () => {
      await createShop({ data: userId })
    }

    void _createShop()
  }, [createShop, userId])

  const openFullDashboard = () => {
    onOpenChange(false)
    void navigate({ to: '/dashboard' })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="mx-auto flex max-h-[90dvh] max-w-lg flex-col gap-0 overflow-hidden rounded-t-2xl p-0"
      >
        <SheetHeader className="shrink-0 border-b border-border/60 text-left">
          <div className="flex items-center gap-2">
            <SheetTitle>{shop.name}</SheetTitle>
            <Badge variant={shop.status === 'live' ? 'default' : 'secondary'}>
              {shop.status}
            </Badge>
          </div>
          <SheetDescription>{shop.category}</SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
              {DASHBOARD_STATS.map((stat) => (
                <Card key={stat.label} className="gap-1 py-3 shadow-none">
                  <CardHeader className="px-3 py-0">
                    <CardDescription className="text-xs uppercase">
                      {stat.label}
                    </CardDescription>
                    <CardTitle className="text-2xl tabular-nums">
                      {stat.value}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 py-0">
                    <p className="text-xs text-primary">{stat.delta}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Quick actions
              </p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { icon: PackageIcon, label: 'Products' },
                  { icon: ShoppingBagIcon, label: 'Orders' },
                  { icon: TrendingUpIcon, label: 'Stats' },
                  { icon: BoxIcon, label: 'Stock' },
                ].map(({ icon: Icon, label }) => (
                  <Button
                    key={label}
                    variant="secondary"
                    className="h-auto flex-col gap-1.5 py-3 [&_svg]:size-5"
                  >
                    <Icon />
                    <span className="text-[11px] font-medium">{label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Card className="gap-3 py-4 shadow-none">
              <CardHeader className="px-4 py-0">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <ActivityIcon className="size-4 text-primary" />
                  Recent activity
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2.5 px-4 py-0 text-sm text-muted-foreground">
                <div className="flex justify-between gap-3">
                  <span>Order #1042 · Hoodie XL</span>
                  <span className="shrink-0 text-xs">2m</span>
                </div>
                <Separator />
                <div className="flex justify-between gap-3">
                  <span>New review · 5★</span>
                  <span className="shrink-0 text-xs">18m</span>
                </div>
                <Separator />
                <div className="flex justify-between gap-3">
                  <span>Stock low · Cap Black</span>
                  <Badge variant="destructive" className="shrink-0">
                    Alert
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <SheetFooter className="shrink-0 border-t border-border/60">
          <Button className="w-full" onClick={openFullDashboard}>
            Open full dashboard
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
