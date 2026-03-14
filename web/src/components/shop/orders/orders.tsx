import React, { useEffect, useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { ReceiptText, ShoppingBag } from 'lucide-react'
import { formatDate } from './orderCard.admin'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  useGetOrdersFromTelegramUser,
  useGetProductsFromOrders,
} from '@/lib/hooks/order.hooks'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Spinner } from '@/components/ui/spinner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  sf_GetPaymentMethodName,
  sf_GetShippingMethodName,
} from '@/server/store/store.functions'

const Orders = ({
  storeId,
  telegramUserId,
  storeCurrency,
}: {
  storeId: string
  telegramUserId: number
  storeCurrency?: string | null
}) => {
  // hook
  const { data: userOrders, isLoading: loadingUserOrders } =
    useGetOrdersFromTelegramUser({ storeId, telegramUserId })
  // server fn
  const shippingMethod = useServerFn(sf_GetShippingMethodName)
  const paymentMethod = useServerFn(sf_GetPaymentMethodName)
  // states
  const [shippingMethodName, setShippingMethodName] = useState<string>('')
  const [paymentMethodName, setPaymentMethodName] = useState<string>('')
  const [openOrderId, setOpenOrderId] = useState<string | null>(null)

  useEffect(() => {
    if (userOrders && userOrders !== 'no orders' && userOrders.length > 0) {
      shippingMethod({
        data: { shippingMethodId: userOrders[0].orderShippingMethod },
      }).then(setShippingMethodName)
      paymentMethod({
        data: { paymentMethodId: userOrders[0].orderPaymentMethod },
      }).then(setPaymentMethodName)
    }
  }, [userOrders])

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <ReceiptText />
          Orders
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        {/* header */}
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl">
            <ShoppingBag />
            My Orders{' '}
          </SheetTitle>
        </SheetHeader>
        {/* container 1 */}
        {/* load order from user */}
        <div className="flex flex-col flex-1 min-h-0 pb-5">
          <ScrollArea className="flex-1 h-full min-h-0 p-2">
            <div className="flex flex-col h-full gap-3">
              {loadingUserOrders && (
                <div className="w-full h-full gap-2 flex justify-center items-center">
                  <Spinner />
                  Loading your orders
                </div>
              )}
              {userOrders &&
              userOrders.length > 0 &&
              userOrders !== 'no orders' ? (
                userOrders
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime(),
                  )
                  .map((order) => (
                    <React.Fragment key={order.id}>
                      <Card className="p-2 rounded-sm">
                        <CardContent className="p-0">
                          {/* order header */}
                          {/* render date, status, id */}
                          <CardHeader className="p-0 w-full">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between">
                              <CardTitle>
                                <Badge className="rounded-sm bg-neutral-300 roudend text-black">
                                  {order.orderStatus}
                                </Badge>
                              </CardTitle>
                              <Badge className="bg-neutral-800 text-neutral-200 rounded-sm">
                                {order.id}
                              </Badge>
                            </div>
                            <h1 className="py-2 text-base font-medium">
                              {formatDate(order.createdAt)}
                            </h1>
                          </CardHeader>
                          <div className="w-full flex flex-col text-sm gap-2">
                            <h1 className="flex items-center gap-2">
                              Payment Method
                              <Badge className="rounded bg-emerald-900 text-white">
                                {paymentMethodName}
                              </Badge>
                            </h1>
                            <h1 className="flex items-center gap-2">
                              Shipping Method
                              <Badge className="rounded bg-cyan-900 text-white">
                                {shippingMethodName}
                              </Badge>
                            </h1>
                          </div>
                          {/* Add a button to open InfoOrders */}
                          <Button
                            className="mt-2"
                            variant="outline"
                            onClick={() => setOpenOrderId(order.id)}
                          >
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                      {/* InfoOrders for this order */}
                      <InfoOrders
                        storeId={storeId}
                        storeCurrency={storeCurrency}
                        orderId={order.id}
                        orderDate={order.createdAt}
                        orderIdentifier={order.orderIdentifier}
                        orderDeliveryInstruction={
                          order.orderDeliveryInstruction
                        }
                        orderCustomMessage={order.orderCustomMessage}
                        open={openOrderId === order.id}
                        onOpenChange={(open) =>
                          setOpenOrderId(open ? order.id : null)
                        }
                      />
                    </React.Fragment>
                  ))
              ) : (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <ReceiptText />
                    </EmptyMedia>
                    <EmptyTitle>No orders available</EmptyTitle>
                    <EmptyDescription>
                      There are currently no orders. New orders will appear here
                      as you complete your first order.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}

const InfoOrders = ({
  storeId,
  storeCurrency,
  orderId,
  orderDate,
  orderIdentifier,
  orderDeliveryInstruction,
  orderCustomMessage,
  open,
  onOpenChange,
}: {
  storeId: string
  storeCurrency?: string | null
  orderId: string
  orderDate: string
  orderIdentifier: string
  orderDeliveryInstruction: string
  orderCustomMessage: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const [total, setTotal] = useState<number>(0)

  // load the products from each order
  const { data: products, isLoading: productsIsLoading } =
    useGetProductsFromOrders({ storeId, orderId })

  useEffect(() => {
    if (
      products !== 'No Products' &&
      Array.isArray(products) &&
      products.length > 0
    ) {
      let ptotal = 0
      products.forEach((product) => {
        ptotal += Number(product.productPrice)
      })
      setTotal(ptotal)
    }
  }, [products])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <span />
      </SheetTrigger>
      <SheetContent className="flex flex-col h-full gap-0 p-3">
        {/* header */}
        {/* uses to render */}
        <SheetHeader className="p-0">
          <SheetTitle>Order for: {orderIdentifier}</SheetTitle>
          <SheetDescription className="flex flex-col">
            <h1 className="font-bold">
              Order Id: <span className="font-normal">{orderId}</span>
            </h1>
            <h1 className="font-bold">
              Order Date:{' '}
              <span className="font-normal">{formatDate(orderDate)}</span>
            </h1>
          </SheetDescription>
        </SheetHeader>

        {/* container 1 */}
        {/* displays total, shows delivery instructions */}
        <div className="flex flex-col gap-4 flex-1 pt-3 overflow-auto">
          <Label className="text-lg flex items-center gap-2 font-normal text-white">
            TOTAL :
            <span className="font-medium">
              {total.toFixed(2)}
              <span className="ml-1">{storeCurrency}</span>
            </span>
          </Label>

          <Label className="text-xl">Delivery Instructions</Label>
          <p className="text-neutral-400">{orderDeliveryInstruction}</p>

          <Label>Products Requested</Label>
          {/* while ordered products are laoding */}
          {productsIsLoading && (
            <div className="flex flex-1 justify-center items-center">
              <div className="flex gap-1">
                <Spinner /> Loading products..
              </div>
            </div>
          )}
          {/* products are loaded */}
          {!productsIsLoading && products && products !== 'No Products' && (
            <ScrollArea className="flex flex-1 gap-2">
              <div className="flex flex-col gap-2">
                {products.map((product) => (
                  <Card className="p-2 rounded-sm">
                    <CardContent className="flex gap-2 p-0">
                      {/* LEFT SIDE 

                    - produt image
                    */}
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          className="h-15 w-15 rounded object-cover"
                        />
                      )}
                      {/* BODY OF PRODUCTS
                    
                    - product name
                    - product price
                    */}
                      <div className="flex flex-1 justify-between">
                        <div className="flex flex-col">
                          <CardTitle>{product.productName}</CardTitle>
                          <CardDescription>
                            {product.productPrice} {storeCurrency}
                          </CardDescription>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        {/* container 2 */}
        {/* renders order custom message */}
        <div className="mb-5 flex flex-col gap-4">
          <Label className="text-xl">Order Notification Message</Label>
          <p className="min-h-20 border p-1 rounded">
            {orderCustomMessage ?? (
              <div className="">
                <p className="text-base">No additional information</p>
                <p className="text-sm text-neutral-400">
                  There are no custom updates or messages for this order at the
                  moment.
                </p>
              </div>
            )}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default Orders
