import React, { useEffect, useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { ReceiptTextIcon } from 'lucide-react'
import { formatDate } from '../dashboard/orders/orderCard.dashboard'
import OrderInfo from './orders/orderInfo'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Spinner } from '@/components/ui/spinner'
import { use_get_OrdersFromTelegramUserId } from '@/lib/hooks/order.hooks'
import {
  sf_get_StorePaymentMethodNameFromMethodId,
  sf_get_StoreShippingMethodNameFromMethodId,
} from '@/server/store/store.functions'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

const StoreOrders = ({
  storeId,
  telegramUserId,
  storeCurrency,
}: {
  storeId: string
  telegramUserId: number
  storeCurrency?: string | null
}) => {
  const { data: userOrders, isLoading: loadingUserOrders } =
    use_get_OrdersFromTelegramUserId({ storeId, telegramUserId })
  const shippingMethod = useServerFn(sf_get_StoreShippingMethodNameFromMethodId)
  const paymentMethod = useServerFn(sf_get_StorePaymentMethodNameFromMethodId)
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
    <div className="flex flex-col flex-1 min-h-0 pb-5">
      <ScrollArea className="flex-1 h-full min-h-0 p-2">
        <div className="flex flex-col h-full gap-3">
          {loadingUserOrders && (
            <div className="w-full h-full gap-2 flex justify-center items-center">
              <Spinner />
              Loading your orders
            </div>
          )}
          {userOrders && userOrders.length > 0 && userOrders !== 'no orders' ? (
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
                  <OrderInfo
                    storeId={storeId}
                    storeCurrency={storeCurrency}
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
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ReceiptTextIcon />
                </EmptyMedia>
                <EmptyTitle>No orders available</EmptyTitle>
                <EmptyDescription>
                  There are currently no orders. New orders will appear here as
                  you complete your first order.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
export default StoreOrders
