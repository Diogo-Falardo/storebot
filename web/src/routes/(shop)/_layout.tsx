import {
  Link,
  Outlet,
  createFileRoute,
  useLoaderData,
} from '@tanstack/react-router'
import { Settings, Plus, Package, ShoppingCart } from 'lucide-react'
import { UserButton } from '@clerk/clerk-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Dialog, DialogTrigger } from '@/components/ui/dialog'

export const Route = createFileRoute('/(shop)/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  const data = useLoaderData({ from: '/(shop)/_layout/dashboard/$id' })

  return (
    <div className="min-h-screen grid grid-rows-[auto,1fr,auto]">
      <header className="p-4">
        <nav className="w-full flex justify-center">
          <div className="w-full lg:max-w-7xl flex items-center justify-between">
            <Link
              to="/"
              className="select-none text-4xl font-bold tracking-widest"
            >
              Kira
            </Link>
            <div className="flex items-center gap-3">
              <UserButton />
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant={'outline'} size={'icon-sm'}>
                    <Settings />
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </div>
        </nav>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
      <footer className="p-4"></footer>
    </div>
  )
}
