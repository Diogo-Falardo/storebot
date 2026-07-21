/**
 * AppLobby — main lobby shell used by the `/` route.
 *
 * Flow:
 *  1. Boot skeleton + auth (loads user)
 *  2. Home: profile + My Shop / Fav Shops cells
 *  3. My Shop → shop-gate (Dashboard | Shop)
 *  4. Sheets for dashboard, client storefront, favourites
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import gsap from 'gsap'

import { authentication, fake_INITDATA } from '#/server/authentication'
import { useFetchUser } from '#/server/users/user.function'
import type { SelectUser } from '#/db/schemas/user/user.types'

import { Avatar, AvatarBadge, AvatarFallback } from '#/components/ui/avatar'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card } from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'
import { ArrowLeftIcon, HeartIcon, MenuIcon, StoreIcon } from 'lucide-react'

import { ClientShopSheet } from './client-shop-sheet'
import { FavShopsSheet } from './fav-shops-sheet'
import { LobbySkeleton } from './lobby-skeleton'
import { MOCK_FAV_SHOPS, MOCK_MY_SHOP } from './mock-data'
import { MyShopSheet } from './my-shop-sheet'
import { ShopGateScreen } from './shop-gate-screen'
import { TelegramCell } from './telegram-cell'

/** Screens within the lobby shell */
type LobbyScreen = 'home' | 'shop-gate'

export function AppLobby() {
  const authenticator = useServerFn(authentication)
  const fetchUser = useServerFn(useFetchUser)

  const [booting, setBooting] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const [screen, setScreen] = useState<LobbyScreen>('home')
  const [dashboardOpen, setDashboardOpen] = useState(false)
  const [clientShopOpen, setClientShopOpen] = useState(false)
  const [favsOpen, setFavsOpen] = useState(false)
  const [user, setUser] = useState<SelectUser | null>(null)

  const rootRef = useRef<HTMLDivElement>(null)
  const homeRef = useRef<HTMLDivElement>(null)
  const gateRef = useRef<HTMLDivElement>(null)

  const onBootComplete = useCallback(() => setBooting(false), [])

  // Boot delay so skeleton is visible; auth can finish in parallel
  useEffect(() => {
    const t = window.setTimeout(onBootComplete, 1200)
    return () => window.clearTimeout(t)
  }, [onBootComplete])

  // Authenticate + load user once
  useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        const auth = await authenticator({ data: fake_INITDATA })
        const loaded = await fetchUser({ data: String(auth.userId) })
        if (!cancelled) setUser(loaded)
      } catch (error) {
        console.error(error)
        if (!cancelled) {
          setAuthError(
            error instanceof Error ? error.message : 'Authentication failed',
          )
        }
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [authenticator, fetchUser])

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
  const displayName = user?.username ?? 'Guest'
  const initials = displayName.slice(0, 2).toUpperCase()
  const handleLabel = user?.username ? `@${user.username}` : '@guest'

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
              <ArrowLeftIcon />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="text-primary"
              aria-label="Menu"
            >
              <MenuIcon />
            </Button>
          )}
          <h1 className="text-base font-semibold tracking-tight text-foreground">
            {isGate ? 'My Shop' : 'Telegram Shops'}
          </h1>
          <div className="size-9" aria-hidden />
        </div>
      </header>

      {authError && (
        <div className="mx-auto w-full max-w-lg px-3 pt-3">
          <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
            {authError}
          </p>
        </div>
      )}

      <div className="relative flex flex-1 flex-col overflow-hidden">
        {screen === 'home' && (
          <main
            ref={homeRef}
            className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 px-3 py-4 pb-8"
          >
            {/* Profile */}
            <section
              data-enter
              className="flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-6 shadow-none"
            >
              <Avatar className="size-20">
                <AvatarFallback className="bg-primary text-xl font-semibold text-primary-foreground">
                  {initials}
                </AvatarFallback>
                <AvatarBadge className="size-4 bg-chart-2" />
              </Avatar>

              <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-xl font-semibold text-foreground">
                  {displayName}
                </p>
                <p className="text-sm text-primary">{handleLabel}</p>
                <p className="text-xs text-muted-foreground">
                  last seen recently
                </p>
              </div>
            </section>

            {/* Store actions */}
            <div data-enter className="flex flex-col gap-2">
              <p className="px-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Store
              </p>
              <Card className="gap-0 overflow-hidden py-0 shadow-none">
                <TelegramCell
                  icon={<StoreIcon />}
                  iconClass="bg-primary text-primary-foreground"
                  title="My Shop"
                  subtitle="Dashboard or customer view"
                  onClick={goToShopGate}
                />
                <Separator />
                <TelegramCell
                  icon={<HeartIcon />}
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
              Mini App · demo store data
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

      {user && (
        <MyShopSheet
          open={dashboardOpen}
          onOpenChange={setDashboardOpen}
          shop={MOCK_MY_SHOP}
          userId={user.id}
        />
      )}

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
