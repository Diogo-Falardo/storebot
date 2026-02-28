import { createServerFn, useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { and, eq } from 'drizzle-orm'
import {
  Link,
  Outlet,
  createFileRoute,
  useLoaderData,
  useRouter,
} from '@tanstack/react-router'
import { Settings, Store, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  userShopOwnershipSchema,
  validateUserShopOwnership,
} from '@/server/user/user.server'
import { db } from '@/db'
import { shops } from '@/db/schema'
import { useQueryClient } from '@tanstack/react-query'
import { DashboardErrorComponent } from './_layout.dashboard.$id'

export const Route = createFileRoute('/(shop)/_layout')({
  component: RouteComponent,
  errorComponent: DashboardErrorComponent,
})

const deleteShop = createServerFn({ method: 'POST' })
  .inputValidator((data: { shopId: string; userId: string }) => data)
  .handler(async ({ data }) => {
    const ids = {
      userId: data.userId,
      shopId: data.shopId,
    }

    userShopOwnershipSchema.parse(ids)

    const isOwner = await validateUserShopOwnership(ids)

    if (!isOwner) {
      throw new Error('not authorized')
    }

    try {
      await db
        .delete(shops)
        .where(and(eq(shops.userId, ids.userId), eq(shops.id, ids.shopId)))

      return true
    } catch (err: any) {
      console.error(err)
      toast.error(err.message ?? 'Error while deleting shop')
    }
  })

function RouteComponent() {
  const data = useLoaderData({ from: '/(shop)/_layout/dashboard/$id' })

  if (!data) {
    return
  }

  const [open, setOpen] = useState(false)
  // required hooks
  const queryClient = useQueryClient()
  const router = useRouter()
  const deleted = useServerFn(deleteShop)

  const deleteUserShop = async () => {
    try {
      const result = await deleted({
        data: {
          userId: data.shopInfo.userId,
          shopId: data.shopInfo.id,
        },
      })
      if (result) {
        toast.success('Shop and its related data got deleted!')
        // invalidate all querys related to the shop
        queryClient.invalidateQueries({ queryKey: ['shop'] })
        router.invalidate()

        router.navigate({ to: '/' })
      }
    } catch (err: any) {
      toast.error(err.message ?? 'Error while deleting shop')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 max-h-20">
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
                <DialogTrigger asChild>
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
                    {/* delete dialog */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant={'destructive'}>
                          <Trash2 />
                          Delete Shop
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent size="sm">
                        <AlertDialogHeader>
                          <AlertDialogMedia className="bg-destructive">
                            <Trash2 />
                          </AlertDialogMedia>
                          <AlertDialogTitle>
                            Delete shop?
                            <AlertDialogDescription>
                              This will delete this shop and all respective
                              data!
                            </AlertDialogDescription>
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel variant="outline">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            onClick={() => deleteUserShop()}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
      {/* das */}
      <main className="p-6 w-full flex flex-1  overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
