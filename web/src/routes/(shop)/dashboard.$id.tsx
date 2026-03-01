import { z } from 'zod'
import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { deleteShop, getUserShopInfo } from '@/server/shop/shop.functions'
import { telegramVerification } from '@/server/telegram/telegram.function'
import ErrorWrapper from '@/components/errorWrapper'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useGetShopProducts } from '@/server/shop/products/product.hook'
import { Spinner } from '@/components/ui/spinner'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Package, Settings, Store, Trash2 } from 'lucide-react'
import ProductAdd from '@/components/shop/products/productAdd'
import ProductCardADM from '@/components/shop/products/productCard.admin'
import ProductCategory from '@/components/shop/products/productCategory'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import ShopUpdate from '@/components/shop/shopUpdate'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

type ShopInfo = {
  shopType: 'public' | 'private'
  shopName: string
  shopCurrency: 'USD' | 'EUR' | 'GBP' | 'CHF'
  id: string
  userId: string
}

export function getTelegramInitData() {
  if (typeof window === 'undefined') return ''
  return (window as any)?.Telegram?.WebApp?.initData ?? ''
  // return 'user={"id":7824653895,"first_name":"Test","last_name":"User","username":"testuser"}'
}

export const shopLoader = createServerFn({ method: 'GET' })
  .inputValidator((data: { shopId: string; initData?: string }) => data)
  .handler(async ({ data }) => {
    console.log(data)
    if (!data.initData)
      throw new Error('What are you looking for couldnt be found')

    if (!data.shopId)
      throw new Error('What are you looking for couldnt be found')

    console.log(data)

    // if there is data
    if (typeof data.initData === 'string' && data.initData.length > 0) {
      // gets tgUser Object
      const tgUser = await telegramVerification({
        data: { initData: data.initData },
      })
      const uuidValidation = z.uuid().safeParse(tgUser.userId)
      if (uuidValidation.success) {
        // userId validated
        const userId = uuidValidation.data
        // shop info from telegram
        try {
          const shopInfo = await getUserShopInfo({
            data: { userId: userId, shopId: data.shopId },
          })
          console.log(shopInfo)
          return { shopInfo: shopInfo, userId: userId }
        } catch (err: any) {
          throw new Error(err.message)
        }
      }
    }
    // try {
    //   const shopInfo = await getUserShopInfo({
    //     data: {
    //       userId: 'bf8d62b5-08f3-11f1-a9f8-644ed72189d4',
    //       shopId: data.shopId,
    //     },
    //   })

    //   console.log('SHOP INFO', shopInfo)

    //   return { shopInfo: shopInfo }
    // } catch (err: any) {
    //   console.error(err)
    //   throw new Error(err.message)
    // }
  })

export function DashboardErrorComponent({ error }: { error: Error }) {
  return <ErrorWrapper errorTitle={error.message} errorDescription="" />
}

export const Route = createFileRoute('/(shop)/dashboard/$id')({
  // loader: async ({ params }) => {
  //   const shop = await shopLoader({
  //     data: { shopId: params.id, initData: getTelegramInitData() },
  //   })
  //   console.log(shopLoader)

  //   return shop
  // },
  errorComponent: DashboardErrorComponent,
  component: RouteComponent,
})

function RouteComponent() {
  // const loaderData = Route.useLoaderData()

  // if (!loaderData) {
  //   return (
  //     <div className="w-full h-full flex justify-center items-center">
  //       <Spinner /> Loading....
  //     </div>
  //   )
  // }

  // const { shopInfo } = loaderData
  // const { userId, id: shopId } = shopInfo

  const { id } = Route.useParams()
  const [shopInfo, setShopInfo] = useState<ShopInfo | null>(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const initData = getTelegramInitData()
        if (!initData) throw new Error('Telegram initData missing')
        const result = await shopLoader({ data: { shopId: id, initData } })
        if (result) {
          setShopInfo(result.shopInfo)
        }
      } catch (err: any) {
        toast.error(err.message ?? 'Error loading shop')
      }
    }
    fetchShop()
  }, [id])

  // Always call the hook, but only pass valid args if shopInfo is available
  const { data, isLoading } = useGetShopProducts(
    shopInfo
      ? { userId: shopInfo.userId, shopId: shopInfo.id }
      : // fallback values to avoid undefined
        { userId: '', shopId: '' },
  )

  if (error) return <DashboardErrorComponent error={error} />
  if (!shopInfo) return <Spinner />

  const [open, setOpen] = useState(false)
  // required hooks
  const queryClient = useQueryClient()
  const router = useRouter()
  const deleted = useServerFn(deleteShop)

  const deleteUserShop = async () => {
    try {
      const result = await deleted({
        data: {
          userId: shopInfo.userId,
          shopId: shopInfo.id,
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
              {shopInfo.shopName}
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
                    shopId={shopInfo.id}
                    userId={shopInfo.userId}
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
        <div className="w-full lg:max-w-7xl flex justify-between">
          <Tabs defaultValue={'product'} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="product" className="cursor-pointer">
                Products
              </TabsTrigger>
              <TabsTrigger value="orders" className="cursor-pointer">
                Orders
              </TabsTrigger>
            </TabsList>
            <TabsContent value="product">
              <div className="w-full h-full p-4">
                {/* while products are loading */}
                {isLoading && (
                  <div>
                    <Spinner />
                    Loading your products
                  </div>
                )}
                {!isLoading && data && data.length > 0 ? (
                  <div className="flex flex-col gap-5">
                    <div className="flex justify-end gap-2">
                      <ProductAdd
                        userId={shopInfo.userId}
                        shopId={shopInfo.id}
                      />
                      <ProductCategory shopId={shopInfo.id} />
                    </div>
                    {/* products display grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {data.map((product) => (
                        <ProductCardADM key={product.id} {...product} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant={'icon'}>
                        <Package />
                      </EmptyMedia>
                      <EmptyTitle>No products yet</EmptyTitle>
                      <EmptyDescription>
                        You haven&apos;t inserted any product yet. Add your
                        first product
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <ProductAdd
                        userId={shopInfo.userId}
                        shopId={shopInfo.id}
                      />
                    </EmptyContent>
                  </Empty>
                )}
              </div>
            </TabsContent>
            <TabsContent value="orders"></TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
