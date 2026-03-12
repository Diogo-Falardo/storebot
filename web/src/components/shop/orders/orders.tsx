import React, { useEffect, useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { ReceiptText } from 'lucide-react'
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
import { Empty } from '@/components/ui/empty'
import { Badge } from '@/components/ui/badge'
import {
  sf_GetPaymentMethodName,
  sf_GetShippingMethodName,
} from '@/server/shop/shop.functions'
import { Label } from '@/components/ui/label'

const Orders = ({
  shopId,
  telegramUserId,
  shopCurrency,
}: {
  shopId: string
  telegramUserId: number
  shopCurrency?: string | null
}) => {
  const { data: userOrders, isLoading: loadingUserOrders } =
    useGetOrdersFromTelegramUser({ shopId, telegramUserId })

  const shippingMethod = useServerFn(sf_GetShippingMethodName)
  const paymentMethod = useServerFn(sf_GetPaymentMethodName)

  // states
  const [shippingMethodName, setShippingMethodName] = useState<string>('')
  const [paymentMethodName, setPaymentMethodName] = useState<string>('')
  const [openOrderId, setOpenOrderId] = useState<string | null>(null)

  useEffect(() => {
    if (userOrders && userOrders !== 'no orders' && userOrders.length > 0) {
      // Example: fetch for the first order (or loop for all)
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
        <SheetHeader>
          <SheetTitle>My Orders </SheetTitle>
        </SheetHeader>
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
                userOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <Card className="p-2">
                      <CardContent className="p-0">
                        <CardHeader className="p-0 w-full">
                          <div className="flex justify-between">
                            <CardTitle>
                              {order.orderIdentifier.length > 6
                                ? `${order.orderIdentifier.slice(0, 6)}...`
                                : order.orderIdentifier}
                            </CardTitle>
                            <Badge className="rounded-sm">
                              {order.orderStatus}
                            </Badge>
                          </div>
                        </CardHeader>
                        <div className="w-full text-sm gap-4">
                          <h1 className="flex items-center gap-2 font-bold ">
                            Order Date:
                            <span className="font-normal">
                              {formatDate(order.createdAt)}
                            </span>
                          </h1>
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
                      shopId={shopId}
                      shopCurrency={shopCurrency}
                      orderId={order.id}
                      orderDate={order.createdAt}
                      orderIdentifier={order.orderIdentifier}
                      orderDeliveryInstruction={order.orderDeliveryInstruction}
                      orderCustomMessage={order.orderCustomMessage}
                      open={openOrderId === order.id}
                      onOpenChange={(open) =>
                        setOpenOrderId(open ? order.id : null)
                      }
                    />
                  </React.Fragment>
                ))
              ) : (
                <Empty></Empty>
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}

const InfoOrders = ({
  shopId,
  shopCurrency,
  orderId,
  orderDate,
  orderIdentifier,
  orderDeliveryInstruction,
  orderCustomMessage,
  open,
  onOpenChange,
}: {
  shopId: string
  shopCurrency?: string | null
  orderId: string
  orderDate: string
  orderIdentifier: string
  orderDeliveryInstruction: string
  orderCustomMessage: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  // states
  const [total, setTotal] = useState<number>(0)

  // load the products from each order
  const { data: products, isLoading: productsIsLoading } =
    useGetProductsFromOrders({ shopId, orderId })

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
      <SheetContent className="flex flex-col h-full">
        {/* header */}
        {/* uses to render */}
        <SheetHeader>
          <SheetTitle>{orderIdentifier}</SheetTitle>
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

        {/* BODY OF THE ORDER
        
        - total of the oder
        - orderDeliveryInstruction
        - products ordered
        */}
        <div className="px-4 flex flex-col gap-4 flex-1 overflow-auto">
          <h1 className="text-lg flex gap-2 font-normal">
            TOTAL:
            <span className="font-medium">
              {total.toFixed(2)}
              <span className="ml-1">{shopCurrency}</span>
            </span>
          </h1>

          <Label className="text-xl">Delivery Instructions</Label>
          <p className="text-neutral-400">{orderDeliveryInstruction}</p>

          <Label>Products Requested</Label>
          {/* 
          WHILE PRODUCTS ARE LOADING
          */}
          {productsIsLoading && (
            <div className="flex flex-1 justify-center items-center">
              <div className="flex gap-1">
                <Spinner /> Loading products..
              </div>
            </div>
          )}
          {/* 
          LOADED PRODUCTS
          */}
          {!productsIsLoading && products && products !== 'No Products' && (
            <ScrollArea className="flex flex-1 gap-2">
              {/* TOP OF THE SCROLL AREA */}
              <div className="flex flex-col gap-2">
                {products.map((product) => (
                  <Card>
                    <CardContent className="flex gap-2">
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
                            {product.productPrice} {shopCurrency}
                          </CardDescription>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
          {/* container  */}
          {/* renders order custom message */}
          <div className="mb-5">
            <Label>Order Custom message</Label>
            <p className="min-h-20">
              {orderCustomMessage ??
                `If shop admin addes a custom order message you will see here`}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default Orders
