/**
 * AppDashboard — full owner control surface (Telegram Mini App style).
 *
 * Panels: home overview, clients, products, shop info, payments, shipping.
 * Data starts as mock matching `db/schema.ts`; swap for server fns later.
 *
 * Preview vs full:
 *  - Lobby `MyShopSheet` stays a lightweight glance + CTA
 *  - This component is the complete dashboard experience
 */
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ClientsSection } from './clients-section'
import { DashboardHeader } from './dashboard-header'
import { DashboardHome } from './dashboard-home'
import {
  MOCK_CLIENTS,
  MOCK_PAYMENTS,
  MOCK_PRODUCTS,
  MOCK_SHIPPING,
  MOCK_SHOP,
  type PaymentMethod,
  type Product,
  type ShippingMethod,
  type ShopClient,
  type ShopInfo,
} from './mock-data'
import { PaymentMethodsSection } from './payment-methods-section'
import { ProductsSection } from './products-section'
import { ShippingMethodsSection } from './shipping-methods-section'
import { ShopInfoSection } from './shop-info-section'
import { PANEL_TITLES, type DashboardPanel } from './types'

export function AppDashboard({
  /** Optional back target (default: lobby `/`) */
  onExit,
}: {
  onExit?: () => void
} = {}) {
  const navigate = useNavigate()
  const [panel, setPanel] = useState<DashboardPanel>('home')

  // Local working copy of shop domain (mock → real API later)
  const [shop, setShop] = useState<ShopInfo>(MOCK_SHOP)
  const [clients, setClients] = useState<ShopClient[]>(MOCK_CLIENTS)
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [payments, setPayments] = useState<PaymentMethod[]>(MOCK_PAYMENTS)
  const [shipping, setShipping] = useState<ShippingMethod[]>(MOCK_SHIPPING)

  const goBack = () => {
    if (panel !== 'home') {
      setPanel('home')
      return
    }
    if (onExit) {
      onExit()
      return
    }
    void navigate({ to: '/' })
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <DashboardHeader title={PANEL_TITLES[panel]} onBack={goBack} />

      <main className="mx-auto w-full max-w-lg flex-1 px-3 py-4 pb-10">
        {panel === 'home' && (
          <DashboardHome
            shop={shop}
            clients={clients}
            products={products}
            onOpen={setPanel}
          />
        )}

        {panel === 'clients' && (
          <ClientsSection clients={clients} onChange={setClients} />
        )}

        {panel === 'products' && (
          <ProductsSection
            products={products}
            currency={shop.currency}
            onChange={setProducts}
          />
        )}

        {panel === 'shop-info' && (
          <ShopInfoSection shop={shop} onSave={setShop} />
        )}

        {panel === 'payments' && (
          <PaymentMethodsSection
            methods={payments}
            shopId={shop.id}
            onChange={setPayments}
          />
        )}

        {panel === 'shipping' && (
          <ShippingMethodsSection
            methods={shipping}
            shopId={shop.id}
            onChange={setShipping}
          />
        )}
      </main>
    </div>
  )
}

export { PANEL_TITLES }
export type { DashboardPanel }
