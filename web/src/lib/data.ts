import { create } from 'zustand'

export const publicData = {
  indexTitle: 'Why to Use StoreBot?',
  indexTitleDescription:
    'Build and run your digital store entirely inside Telegram — private, fee-free, and completely under your control.',
  reasons: [
    {
      title: '100% Safe — Only Works Inside Telegram',
      description:
        'Your store opens exclusively in private chats with Telegram’s verified init data. No external websites, no fake accounts, no unauthorized access. Maximum protection for you and your customers.',
    },
    {
      title: 'Zero Fees — You Keep 100% of Every Sale',
      description:
        'StoreBot takes nothing. No commission, no platform cut, no hidden charges. Every cash (or crypto) you earn goes straight to you.',
    },
    {
      title: 'Your Payment & Shipping Methods',
      description:
        'Use whatever you want: bank transfer, crypto, Mbway, cash apps, or anything else. No forced gateways. Full freedom for you and your buyers.',
    },
    {
      title: 'Easy Sharing & Private Access',
      description:
        'Share your store in any group or channel with one tap. Customers open it directly in their private chat — safe, exclusive, and built for higher conversions.',
    },
    {
      title: 'Add & Manage Products in Seconds',
      description:
        'Upload photo, name, price, description and category instantly. Edit, hide or delete anytime — all from a clean dashboard.',
    },
    {
      title: 'Real-Time Order Management',
      description:
        'See every order instantly, change status (Shipped, Pending…), add delivery notes and send notifications — all in one place.',
    },
  ] as const,

  pricing: {
    title: 'Store Activation Pricing',
    description:
      'Choose how long you want your store to stay active. Pay once and use it for the full period.',
    plans: [
      { period: '1 Day', price: '€1.50' },
      { period: '1 Week', price: '€5' },
      { period: '1 Month', price: '€10' },
      { period: '3 Months', price: '€25' },
      { period: '1 Year', price: '€80' },
    ] as const,
  },

  howToUse: {
    title: 'How to Use StoreBot',
    description:
      'Everything you need to know to get started and manage your store today.',
    steps: [
      { command: '/create', text: 'Create your store.' },
      { command: '/dashboard', text: 'Open your full management dashboard.' },
      { command: '/shop', text: 'Open your store.' },
      { command: '/share', text: 'Share your store in groups or channels.' },
      { command: '/activate', text: 'Activate or extend your store.' },
      { command: '/openshop', text: 'Open any store by store ID.' },
      { command: '/pricing', text: 'See current activation prices.' },
    ] as const,
  },

  about: {
    title: 'About StoreBot',
    description:
      'StoreBot is a modern platform designed to empower creators, entrepreneurs, and businesses to sell digital products directly within Telegram. Our mission is to provide a secure, seamless, and cost-effective solution for digital commerce, eliminating unnecessary complexity and fees.',

    mainStory:
      'StoreBot enables you to launch and manage your digital store in the environment where your audience already engages, Telegram.',
    barriers: [
      'No complicated website setups',
      'No recurring platform fees',
      'No commission on your sales',
    ],
    highlights: [
      'Full control over your products, pricing, and customer relationships',
      'Private by default for a safe and exclusive experience',
      'Built with robust security and privacy standards',
    ],
    securityNote:
      'StoreBot leverages Telegram’s secure infrastructure. Stores can only be accessed in private chats with verified init data, protecting both owners and customers from unauthorized access.',
  },

  terms: {
    title: 'Terms & Responsibilities',
    description: 'By using StoreBot you agree to the following terms:',
    points: [
      'StoreBot is not responsible for the products sold by store owners.',
      'StoreBot does not verify the legitimacy, quality, or safety of any items listed.',
      'StoreBot is not liable for any fraud, theft, disputes, or losses resulting from transactions.',
      'Each store owner is fully responsible for their content and must comply with all applicable laws.',
      'StoreBot only provides the technical infrastructure for store creation and management.',
    ] as const,
  },

  botInfo: {
    version: 'v1.1',
    versionName: 'Mission Saved',
    versionLog: [
      {
        version: 'v1.1',
        versionName: 'Mission Saved',
        versionFeatures: ['Upgraded UI', 'Fixed minor bugs'] as const,
      },
      {
        version: 'v1.0',
        versionName: 'Mission has started',
        versionFeatures: ['Store Creation and Management'] as const,
      },
    ] as const,
  },
}

type LayoutState = {
  headerHeight: number
  footerHeight: number
  offset: number
  setHeaderHeight: (h: number) => void
  setFooterHeight: (h: number) => void
  setOffset: (n: number) => void
}

interface LayoutExtendedState extends LayoutState {
  productInfoActive: string | null // product id
  productInfoActiveCategoryId: string | null
  setProductInfoActive: (pId: string | null) => void
  setProductInfoActiveCategoryId: (cId: string | null) => void
}

/**
 * this const was created with the intention of storing the height that:
 * its between the header and footer so every section can have the
 * proper space
 */
export const useLayoutPublic = create<LayoutExtendedState>((set) => ({
  headerHeight: 0,
  footerHeight: 0,
  offset: 0,
  productInfoActive: null,
  productInfoActiveCategoryId: null,
  setHeaderHeight: (h: number) => set({ headerHeight: h }),
  setFooterHeight: (h: number) => set({ footerHeight: h }),
  setOffset: (n: number) => set({ offset: n }),
  setProductInfoActive: (pId: string | null) => set({ productInfoActive: pId }),
  setProductInfoActiveCategoryId: (cId: string | null) =>
    set({ productInfoActiveCategoryId: cId }),
}))

export const useLayoutDashboard = create<LayoutExtendedState>((set) => ({
  headerHeight: 0,
  footerHeight: 0,
  offset: 0,
  productInfoActive: null,
  productInfoActiveCategoryId: null,
  setHeaderHeight: (h: number) => set({ headerHeight: h }),
  setFooterHeight: (h: number) => set({ footerHeight: h }),
  setOffset: (n: number) => set({ offset: n }),
  setProductInfoActive: (pId: string | null) => set({ productInfoActive: pId }),
  setProductInfoActiveCategoryId: (cId: string | null) =>
    set({ productInfoActiveCategoryId: cId }),
}))
