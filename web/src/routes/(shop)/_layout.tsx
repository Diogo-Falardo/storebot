import {
  Link,
  Outlet,
  createFileRoute,
  useLoaderData,
} from '@tanstack/react-router'
import { Settings, Store, TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import ShopUpdate from '@/components/shop/shopUpdate'

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
              className="select-none text-4xl font-bold tracking-wide"
            >
              {data.shopInfo.shopName}
            </Link>
            <div className="flex items-center gap-3">
              <Dialog>
                {/* representative dialog trigger */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={'outline'}
                      size={'icon-sm'}
                      className="cursor-pointer"
                    >
                      <Settings />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="p-2">
                    <DropdownMenuGroup>
                      {/* actual dialog trigger */}
                      <DialogTrigger asChild>
                        <DropdownMenuItem>
                          <Store />
                          Update Shop
                        </DropdownMenuItem>
                      </DialogTrigger>
                    </DropdownMenuGroup>
                    <DropdownMenuGroup>
                      <DropdownMenuItem variant="destructive">
                        <TrashIcon />
                        Delete Shop
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* update shop content */}
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Shop</DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <ShopUpdate />
                </DialogContent>
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
