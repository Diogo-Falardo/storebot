export type DashboardPanel =
  | 'home'
  | 'clients'
  | 'products'
  | 'shop-info'
  | 'payments'
  | 'shipping'

export const PANEL_TITLES: Record<DashboardPanel, string> = {
  home: 'Dashboard',
  clients: 'Clients',
  products: 'Products',
  'shop-info': 'Shop info',
  payments: 'Payments',
  shipping: 'Shipping',
}
