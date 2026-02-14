import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { createServerFn } from '@tanstack/react-start'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { createContext, useContext } from 'react'
import { Toaster } from 'sonner'
import appCss from '../styles.css?url'
import type { QueryClient } from '@tanstack/react-query'
import TanStackQueryDevtools from '@/integrations/tanstack-query/devtools'
import ClerkProvider from '@/integrations/clerk/provider'
import { getOrCreateDbUser } from '@/server/user/user.function'

interface MyRouterContext {
  queryClient: QueryClient
}

const UserContext = createContext<{ userId?: string } | null>(null)
export const useUserContext = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserContext must be used within RootDocument')
  }
  return context
}

const loadRootData = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const userId = await getOrCreateDbUser()
    return { userId }
  } catch (err) {
    return { userId: undefined }
  }
})

export const Route = createRootRouteWithContext<MyRouterContext>()({
  loader: async () => {
    return await loadRootData()
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Kira',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { userId } = Route.useLoaderData()
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <ClerkProvider>
          <UserContext.Provider value={{ userId }}>
            <Toaster />
            {children}
            <TanStackDevtools
              config={{
                position: 'bottom-right',
              }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
                TanStackQueryDevtools,
              ]}
            />
          </UserContext.Provider>
        </ClerkProvider>
        <Scripts />
      </body>
    </html>
  )
}
