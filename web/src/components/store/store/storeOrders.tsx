import React, { useState } from 'react'
import { ReceiptTextIcon } from 'lucide-react'
import { formatDate } from '../dashboard/orders/orderTable.dashboard'
import OrderInfo from './orders/orderInfo'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Spinner } from '@/components/ui/spinner'
import { use_get_OrdersFromTelegramUserId } from '@/lib/hooks/order.hooks'
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
  const [openOrderId, setOpenOrderId] = useState<string | null>(null)

  return (
    <div className="flex flex-col flex-1 min-h-0 pb-5">
      <ScrollArea className="flex-1 h-full min-h-0 p-2">
        <div className="flex flex-col h-full gap-3 p-1">
          {loadingUserOrders && (
            <div className="w-full h-full gap-2 flex justify-center items-center">
              <Spinner />
              Loading your orders
            </div>
          )}
          {userOrders && userOrders.length > 0 ? (
            userOrders
              .sort(
                (a, b) =>
                  new Date(b.orderCreatedAt).getTime() -
                  new Date(a.orderCreatedAt).getTime(),
              )
              .map((order) => (
                <React.Fragment key={order.orderId}>
                  <Card className="rounded-sm gap-2 p-2.5 bg-background ring ring-primary border-primary/50">
                    <CardHeader className="p-0  w-full flex items-center justify-between">
                      <CardTitle>{formatDate(order.orderCreatedAt)}</CardTitle>
                      <Badge className="rounded-sm bg-neutral-300 roudend text-black">
                        {order.orderStatus}
                      </Badge>
                    </CardHeader>
                    <CardDescription className="p-0">
                      <Badge className="bg-neutral-800 text-neutral-200 rounded-sm">
                        {order.orderId}
                      </Badge>
                    </CardDescription>
                    <CardContent className="p-0 flex flex-col gap-2">
                      <div className="w-full flex flex-col text-sm gap-2">
                        <h1 className="flex font-semibold text-neutral-300 items-center gap-2">
                          Payment Method:
                          <Badge className="rounded bg-emerald-900 text-white">
                            {order.orderPaymentMethodName}
                          </Badge>
                        </h1>
                        <h1 className="flex font-semibold text-neutral-300 items-center gap-2">
                          Shipping Method:
                          <Badge className="rounded bg-cyan-900 text-white">
                            {order.orderShippingMethodName}
                          </Badge>
                        </h1>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setOpenOrderId(order.orderId)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                  <OrderInfo
                    storeId={storeId}
                    storeCurrency={storeCurrency}
                    orderId={order.orderId}
                    orderDate={order.orderCreatedAt}
                    orderIdentifier={order.orderIdentifier}
                    orderDeliveryInstruction={order.orderDeliveryInstruction}
                    orderCustomMessage={order.orderCustomMessage ?? null}
                    open={openOrderId === order.orderId}
                    onOpenChange={(open) =>
                      setOpenOrderId(open ? order.orderId : null)
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
