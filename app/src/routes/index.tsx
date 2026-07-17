/**
 * App Lobby — Telegram Mini App style
 * Pure frontend: mock data + React state. Design tokens from styles.css.
 */
import { Avatar, AvatarFallback, AvatarBadge } from '#/components/ui/avatar'
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
import { Skeleton } from '#/components/ui/skeleton'
import { cn } from '#/lib/utils'
import { createFileRoute } from '@tanstack/react-router'
import gsap from 'gsap'
import {
  Activity,
  ArrowLeft,
  Box,
  ChevronRight,
  Heart,
  LayoutDashboard,
  Menu,
  Package,
  ShoppingBag,
  Star,
  Store,
  TrendingUp,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from 'react'

export const Route = createFileRoute('/')({ component: Lobby })

/** Screens within the lobby shell */
type LobbyScreen = 'home' | 'shop-gate'

// ─── Mock data ───────────────────────────────────────────────────────────────

type MockUser = {
  username: string
  displayName: string
  initials: string
  lastLogin: string
}

type MockShop = {
  id: string
  name: string
  category: string
  status: 'live' | 'draft' | 'paused'
}

type FavShop = {
  id: string
  name: string
  tagline: string
  rating: number
  items: number
  emoji: string
  /** When the user saved this shop */
  savedAt: string
  /** Whether the storefront is currently open */
  isOpen: boolean
}

const MOCK_USER: MockUser = {
  username: '@nova.merch',
  displayName: 'Nova Merch',
  initials: 'NM',
  lastLogin: 'last seen recently',
}

const MOCK_MY_SHOP: MockShop = {
  id: 'shop_01',
  name: 'Nova Merch Co.',
  category: 'Streetwear & Accessories',
  status: 'live',
}

/** Seed list — expanded so favourites sheet scrolling is easy to test */
const FAV_SHOP_SEEDS: Omit<FavShop, 'id' | 'savedAt' | 'isOpen'>[] = [
  { name: 'Lumen Goods', tagline: 'Minimal homeware', rating: 4.9, items: 126, emoji: '✦' },
  { name: 'Pixel Pantry', tagline: 'Digital snacks & tools', rating: 4.7, items: 84, emoji: '◈' },
  { name: 'Orbit Lab', tagline: 'Tech & gadgets', rating: 4.8, items: 210, emoji: '◎' },
  { name: 'Soft Form', tagline: 'Apparel studio', rating: 4.6, items: 67, emoji: '◇' },
  { name: 'Cedar & Co', tagline: 'Artisan goods', rating: 5.0, items: 42, emoji: '✧' },
  { name: 'Northwind Market', tagline: 'Organic groceries', rating: 4.5, items: 320, emoji: '◆' },
  { name: 'Velvet Room', tagline: 'Beauty & skincare', rating: 4.8, items: 95, emoji: '❖' },
  { name: 'Frame & Folio', tagline: 'Prints & stationery', rating: 4.4, items: 158, emoji: '▣' },
  { name: 'Trailhead Supply', tagline: 'Outdoor gear', rating: 4.9, items: 187, emoji: '▲' },
  { name: 'Circuit Bay', tagline: 'Electronics parts', rating: 4.3, items: 540, emoji: '⬡' },
  { name: 'Bloom Cart', tagline: 'Fresh flowers', rating: 4.7, items: 38, emoji: '✿' },
  { name: 'Keystone Books', tagline: 'Indie bookstore', rating: 4.9, items: 412, emoji: '▤' },
  { name: 'Harbor Roast', tagline: 'Specialty coffee', rating: 4.8, items: 56, emoji: '●' },
  { name: 'Mono Desk', tagline: 'Office essentials', rating: 4.2, items: 143, emoji: '▭' },
  { name: 'Petal & Paw', tagline: 'Pet supplies', rating: 4.6, items: 201, emoji: '♡' },
  { name: 'Ironclad Tools', tagline: 'DIY hardware', rating: 4.5, items: 278, emoji: '⚒' },
  { name: 'Sunset Vinyl', tagline: 'Records & audio', rating: 4.9, items: 89, emoji: '◎' },
  { name: 'Cloud Nine Toys', tagline: 'Kids & games', rating: 4.4, items: 165, emoji: '✧' },
  { name: 'Silk Route Spices', tagline: 'World pantry', rating: 4.7, items: 112, emoji: '◈' },
  { name: 'Aether Fitness', tagline: 'Activewear', rating: 4.6, items: 98, emoji: '⚡' },
  { name: 'Paper Crane Co', tagline: 'Gifts & wrapping', rating: 4.3, items: 74, emoji: '✦' },
  { name: 'Nova Optics', tagline: 'Eyewear', rating: 4.8, items: 61, emoji: '◉' },
  { name: 'Greenline Plants', tagline: 'Indoor plants', rating: 4.5, items: 133, emoji: '☘' },
  { name: 'Byte Boutique', tagline: 'Phone accessories', rating: 4.1, items: 247, emoji: '▣' },
  { name: 'Marble & Grain', tagline: 'Kitchenware', rating: 4.7, items: 119, emoji: '◇' },
]

const SAVED_LABELS = [
  'Saved today',
  'Saved 1d ago',
  'Saved 2d ago',
  'Saved 3d ago',
  'Saved 5d ago',
  'Saved 1w ago',
  'Saved 2w ago',
  'Saved 3w ago',
  'Saved 1mo ago',
  'Saved 2mo ago',
  'Saved 3mo ago',
]

const MOCK_FAV_SHOPS: FavShop[] = FAV_SHOP_SEEDS.map((seed, i) => ({
  ...seed,
  id: `fav_${i + 1}`,
  savedAt: SAVED_LABELS[i % SAVED_LABELS.length]!,
  isOpen: i % 5 !== 2,
}))

/** Product catalog for client storefront — long enough to stress-test scroll */
const MOCK_PRODUCTS: { name: string; price: string; tag: string | null }[] = [
  { name: 'Classic Hoodie', price: '$64', tag: 'Popular' },
  { name: 'Logo Cap', price: '$28', tag: 'New' },
  { name: 'Everyday Tee', price: '$32', tag: null },
  { name: 'Crew Socks 3-pack', price: '$18', tag: null },
  { name: 'Zip Track Jacket', price: '$89', tag: 'Popular' },
  { name: 'Cargo Joggers', price: '$72', tag: null },
  { name: 'Oversized Denim Shirt', price: '$58', tag: 'New' },
  { name: 'Ribbed Beanie', price: '$22', tag: null },
  { name: 'Canvas Tote', price: '$26', tag: null },
  { name: 'Leather Belt', price: '$45', tag: null },
  { name: 'Fleece Half-Zip', price: '$76', tag: 'Popular' },
  { name: 'Performance Shorts', price: '$38', tag: null },
  { name: 'Linen Camp Shirt', price: '$54', tag: 'New' },
  { name: 'Wool Scarf', price: '$42', tag: null },
  { name: 'Trail Runner Sneakers', price: '$118', tag: 'Popular' },
  { name: 'Court Low Sneakers', price: '$96', tag: null },
  { name: 'Nylon Crossbody', price: '$48', tag: null },
  { name: 'Insulated Bottle 32oz', price: '$34', tag: null },
  { name: 'Phone Crossbody Case', price: '$29', tag: 'New' },
  { name: 'Merino Base Layer', price: '$68', tag: null },
  { name: 'Quilted Vest', price: '$82', tag: null },
  { name: 'Relaxed Chinos', price: '$62', tag: null },
  { name: 'Pique Polo', price: '$44', tag: null },
  { name: 'Graphic Longsleeve', price: '$36', tag: null },
  { name: 'Packable Windbreaker', price: '$79', tag: 'Popular' },
  { name: 'Slip-On Mules', price: '$52', tag: null },
  { name: 'Structured Backpack', price: '$98', tag: 'New' },
  { name: 'Cotton Boxers 2-pack', price: '$24', tag: null },
  { name: 'Aviator Sunglasses', price: '$56', tag: null },
  { name: 'Silk Scrunchie Set', price: '$16', tag: null },
  { name: 'Waffle Lounge Pants', price: '$48', tag: null },
  { name: 'Heavyweight Crewneck', price: '$66', tag: 'Popular' },
  { name: 'Utility Work Shirt', price: '$59', tag: null },
  { name: 'Mini Pouch Wallet', price: '$31', tag: null },
  { name: 'Sport Ankle Socks', price: '$14', tag: null },
  { name: 'Rain Shell Jacket', price: '$124', tag: 'New' },
  { name: 'Corduroy Overshirt', price: '$71', tag: null },
  { name: 'Knit Fingerless Gloves', price: '$19', tag: null },
  { name: 'Weekend Duffel', price: '$88', tag: null },
  { name: 'Essential Tank', price: '$22', tag: null },
]

const DASHBOARD_STATS = [
  { label: 'Products', value: String(MOCK_PRODUCTS.length), delta: '+3 this week' },
  { label: 'Orders', value: '12', delta: 'Today' },
  { label: 'Revenue', value: '$2.8k', delta: '+18%' },
  { label: 'Visitors', value: '1.2k', delta: '7 days' },
] as const

// ─── Lobby ───────────────────────────────────────────────────────────────────

/**
 * Telegram Mini App lobby:
 * home → My Shop gate (Dashboard | Shop) → destination sheets
 */
function Lobby() {
  const [booting, setBooting] = useState(true)
  const [screen, setScreen] = useState<LobbyScreen>('home')
  const [dashboardOpen, setDashboardOpen] = useState(false)
  const [clientShopOpen, setClientShopOpen] = useState(false)
  const [favsOpen, setFavsOpen] = useState(false)

  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const homeRef = useRef<HTMLDivElement>(null)
  const gateRef = useRef<HTMLDivElement>(null)

  const onBootComplete = useCallback(() => setBooting(false), [])

  // Fake boot delay → hand off to UI
  useEffect(() => {
    const t = window.setTimeout(onBootComplete, 1200)
    return () => window.clearTimeout(t)
  }, [onBootComplete])

  // Entrance after boot (home only)
  useEffect(() => {
    if (booting || screen !== 'home' || !homeRef.current) return

    const ctx = gsap.context(() => {
      const items = homeRef.current?.querySelectorAll('[data-enter]')
      if (!items?.length) return
      gsap.fromTo(
        items,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.07,
          ease: 'power2.out',
        },
      )
    }, rootRef)

    return () => ctx.revert()
  }, [booting, screen])

  // Animate into shop-gate
  useEffect(() => {
    if (screen !== 'shop-gate' || !gateRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        gateRef.current,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.38, ease: 'power3.out' },
      )
      const cards = gateRef.current?.querySelectorAll('[data-gate-option]')
      if (cards?.length) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 18, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            stagger: 0.1,
            delay: 0.12,
            ease: 'power3.out',
          },
        )
      }
    }, gateRef)

    return () => ctx.revert()
  }, [screen])

  const goToShopGate = () => {
    if (!homeRef.current) {
      setScreen('shop-gate')
      return
    }
    gsap.to(homeRef.current, {
      opacity: 0,
      x: -28,
      duration: 0.28,
      ease: 'power2.in',
      onComplete: () => setScreen('shop-gate'),
    })
  }

  const goHome = () => {
    if (!gateRef.current) {
      setScreen('home')
      return
    }
    gsap.to(gateRef.current, {
      opacity: 0,
      x: 28,
      duration: 0.28,
      ease: 'power2.in',
      onComplete: () => setScreen('home'),
    })
  }

  if (booting) {
    return <LobbySkeleton />
  }

  const isGate = screen === 'shop-gate'

  return (
    <div
      ref={rootRef}
      className="flex min-h-dvh flex-col bg-background text-foreground"
    >
      {/* Telegram-style top bar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-lg items-center justify-between px-3">
          {isGate ? (
            <Button
              variant="ghost"
              size="icon"
              className="text-primary"
              aria-label="Back"
              onClick={goHome}
            >
              <ArrowLeft />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="text-primary"
              aria-label="Menu"
            >
              <Menu />
            </Button>
          )}
          <h1 className="text-base font-semibold tracking-tight text-foreground">
            {isGate ? 'My Shop' : 'Telegram Shops'}
          </h1>
          <div className="size-9" aria-hidden />
        </div>
      </header>

      <div ref={stageRef} className="relative flex flex-1 flex-col overflow-hidden">
        {screen === 'home' && (
          <main
            ref={homeRef}
            className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 px-3 py-4 pb-8"
          >
            {/* Profile — Telegram user card style */}
            <section
              data-enter
              className="flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-6 shadow-none"
            >
              <Avatar className="size-20">
                <AvatarFallback className="bg-primary text-xl font-semibold text-primary-foreground">
                  {MOCK_USER.initials}
                </AvatarFallback>
                <AvatarBadge className="size-4 bg-chart-2" />
              </Avatar>

              <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-xl font-semibold text-foreground">
                  {MOCK_USER.displayName}
                </p>
                <p className="text-sm text-primary">{MOCK_USER.username}</p>
                <p className="text-xs text-muted-foreground">
                  {MOCK_USER.lastLogin}
                </p>
              </div>
            </section>

            {/* Section: Store */}
            <div data-enter className="flex flex-col gap-2">
              <p className="px-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Store
              </p>
              <Card className="gap-0 overflow-hidden py-0 shadow-none">
                <TelegramCell
                  icon={<Store />}
                  iconClass="bg-primary text-primary-foreground"
                  title="My Shop"
                  subtitle="Dashboard or customer view"
                  onClick={goToShopGate}
                />
                <Separator />
                <TelegramCell
                  icon={<Heart />}
                  iconClass="bg-chart-4 text-primary-foreground"
                  title="Fav Shops"
                  subtitle={`${MOCK_FAV_SHOPS.length} saved storefronts`}
                  trailing={
                    <Badge variant="secondary">{MOCK_FAV_SHOPS.length}</Badge>
                  }
                  onClick={() => setFavsOpen(true)}
                />
              </Card>
            </div>

            <p
              data-enter
              className="px-1 text-center text-xs text-muted-foreground"
            >
              Mini App · mock data only
            </p>
          </main>
        )}

        {screen === 'shop-gate' && (
          <ShopGateScreen
            innerRef={gateRef}
            shop={MOCK_MY_SHOP}
            onDashboard={() => setDashboardOpen(true)}
            onShop={() => setClientShopOpen(true)}
          />
        )}
      </div>

      {/* Destinations after gate choice */}
      <MyShopSheet
        open={dashboardOpen}
        onOpenChange={setDashboardOpen}
        shop={MOCK_MY_SHOP}
      />
      <ClientShopSheet
        open={clientShopOpen}
        onOpenChange={setClientShopOpen}
        shop={MOCK_MY_SHOP}
      />
      <FavShopsSheet
        open={favsOpen}
        onOpenChange={setFavsOpen}
        shops={MOCK_FAV_SHOPS}
      />
    </div>
  )
}

// ─── My Shop gate (Dashboard | Shop) ─────────────────────────────────────────

/**
 * Intermediate screen after “My Shop”:
 * pick owner dashboard vs client storefront.
 */
function ShopGateScreen({
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

      {/* Wireframe: outer rounded shell + two stacked options */}
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
            <LayoutDashboard />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-bold tracking-wide text-foreground uppercase">
              Dashboard
            </span>
            <span className="mt-0.5 block text-sm text-muted-foreground">
              Manage products, orders & settings
            </span>
          </span>
          <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
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
            <ShoppingBag />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-bold tracking-wide text-foreground uppercase">
              Shop
            </span>
            <span className="mt-0.5 block text-sm text-muted-foreground">
              Preview storefront as customers see it
            </span>
          </span>
          <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
        </button>
      </Card>

      <p className="mt-auto pt-8 text-center text-xs text-muted-foreground">
        You can switch anytime from here
      </p>
    </div>
  )
}

// ─── Loading skeleton ────────────────────────────────────────────────────────

function LobbySkeleton() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <div className="flex h-14 items-center justify-center border-b border-border/60 bg-card px-3">
        <Skeleton className="h-4 w-36" />
      </div>
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-3 py-6">
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-card px-4 py-6">
          <Skeleton className="size-20 rounded-full" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-28" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="ml-3 h-3 w-14" />
          <Card className="gap-0 overflow-hidden py-0">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Skeleton className="size-10 rounded-xl" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Skeleton className="size-10 rounded-xl" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── Telegram settings cell ──────────────────────────────────────────────────

function TelegramCell({
  icon,
  iconClass,
  title,
  subtitle,
  trailing,
  onClick,
}: {
  icon: ReactNode
  iconClass: string
  title: string
  subtitle: string
  trailing?: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 px-4 py-3.5 text-left',
        'transition-colors outline-none',
        'hover:bg-accent/60 active:bg-accent',
        'focus-visible:bg-accent focus-visible:ring-0',
      )}
    >
      <span
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-xl [&_svg]:size-5',
          iconClass,
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium text-foreground">
          {title}
        </span>
        <span className="block truncate text-sm text-muted-foreground">
          {subtitle}
        </span>
      </span>
      {trailing}
      <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
    </button>
  )
}

// ─── My Shop sheet ───────────────────────────────────────────────────────────

function MyShopSheet({
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
        className="mx-auto max-h-[90dvh] max-w-lg gap-0 rounded-t-2xl p-0"
      >
        <SheetHeader className="border-b border-border/60 text-left">
          <div className="flex items-center gap-2">
            <SheetTitle>{shop.name}</SheetTitle>
            <Badge variant={shop.status === 'live' ? 'default' : 'secondary'}>
              {shop.status}
            </Badge>
          </div>
          <SheetDescription>{shop.category}</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 overflow-y-auto px-4 py-4">
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
                { icon: Package, label: 'Products' },
                { icon: ShoppingBag, label: 'Orders' },
                { icon: TrendingUp, label: 'Stats' },
                { icon: Box, label: 'Stock' },
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
                <Activity className="size-4 text-primary" />
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

        <SheetFooter className="border-t border-border/60">
          <Button className="w-full" onClick={() => onOpenChange(false)}>
            Open full dashboard
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// ─── Client shop sheet (storefront as customers see it) ──────────────────────

function ClientShopSheet({
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

// ─── Fav shops sheet — saved favourites list ─────────────────────────────────

/**
 * Shops the user has bookmarked. Telegram chat-list style:
 * one vertical list, tap to open storefront, heart = still favourited.
 */
function FavShopsSheet({
  open,
  onOpenChange,
  shops,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  shops: FavShop[]
}) {
  const [saved, setSaved] = useState(shops)

  // Sync when sheet re-opens with source mock data
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
                <Heart className="size-6" />
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
                    {/* Open storefront */}
                    <button
                      type="button"
                      className={cn(
                        'flex min-w-0 flex-1 items-center gap-3 px-3 py-3.5 text-left',
                        'transition-colors hover:bg-accent/50 active:bg-accent',
                        'outline-none focus-visible:bg-accent',
                      )}
                      onClick={() => {
                        // Mock: would navigate to that shop’s public storefront
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
                            <Star className="size-3 fill-primary text-primary" />
                            {shop.rating.toFixed(1)}
                          </span>
                          <span>·</span>
                          <span>{shop.items} items</span>
                          <span>·</span>
                          <span>{shop.savedAt}</span>
                        </span>
                      </span>
                      <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
                    </button>

                    {/* Unsave */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-chart-4"
                      aria-label={`Remove ${shop.name} from favourites`}
                      onClick={() => removeFavourite(shop.id)}
                    >
                      <Heart className="size-5 fill-current" />
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
