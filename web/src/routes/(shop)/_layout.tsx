import { useState } from 'react'
import {
  Link,
  Outlet,
  createFileRoute,
  useLoaderData,
} from '@tanstack/react-router'
import { Settings, Store, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import ShopUpdate from '@/components/shop/shopUpdate'

export const Route = createFileRoute('/(shop)/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  const data = useLoaderData({ from: '/(shop)/_layout/dashboard/$id' })
  const [open, setOpen] = useState(false)

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
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                  <Button
                    variant={'outline'}
                    size={'icon-sm'}
                    className="cursor-pointer"
                  >
                    <Settings />
                  </Button>
                </DialogTrigger>
                {/* update shop content */}
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Shop</DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <ShopUpdate
                    shopId={data.shopInfo.id}
                    userId={data.shopInfo.userId}
                    onSuccess={() => setOpen(false)}
                  />
                  <DialogFooter>
                    <Button variant={'destructive'}>
                      <Trash />
                      Delete Shop
                    </Button>
                    <Button form="update-shop-form" type="submit">
                      <Store />
                      Update Shop
                    </Button>
                  </DialogFooter>
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
