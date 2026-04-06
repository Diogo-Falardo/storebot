import { EllipsisIcon, ReceiptTextIcon } from 'lucide-react'
import OrderTableDashboard from './orders/orderTable.dashboard'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { use_get_StoreOrdersFromStoreId } from '@/lib/hooks/order.hooks'
import { Spinner } from '@/components/ui/spinner'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

const DashboardOrders = ({
  storeId,
  storeCurrency,
}: {
  storeId: string
  storeCurrency: string
}) => {
  const { data: orders, isLoading: ordersIsLoading } =
    use_get_StoreOrdersFromStoreId({ storeId })

  if (ordersIsLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <Spinner /> loading orders...
      </div>
    )
  }

  if (orders && orders.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant={'icon'}>
            <ReceiptTextIcon />
          </EmptyMedia>
          <EmptyTitle>No Orders Yet</EmptyTitle>
          <EmptyDescription>
            Start promoting your store to attract your first customers and grow
            your business!
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (orders) {
    console.log(orders)
  }

  return (
    <div className="flex-1 py-2">
      {/* controller of the page content */}
      <Tabs className="px-2" defaultValue="all">
        <TabsList className="w-full">
          <TabsTrigger className="p-2" value="all">
            All
          </TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={'ghost'} size={'icon'}>
                <EllipsisIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col gap-1">
              <DropdownMenuItem asChild>
                <TabsTrigger
                  className=" ring ring-neutral-800"
                  value="awaiting_payment"
                >
                  Awaiting Payment
                </TabsTrigger>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <TabsTrigger className=" ring ring-neutral-800" value="shipped">
                  Shipped
                </TabsTrigger>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <TabsTrigger value="completed" className="bg-green-800">
                  Completed
                </TabsTrigger>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <TabsTrigger value="failed" className=" bg-red-800">
                  Failed
                </TabsTrigger>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TabsList>
        <TabsContent value="all">
          {orders && orders.length > 0 && (
            <OrderTableDashboard
              storeId={storeId}
              storeCurrency={storeCurrency}
              orders={orders}
              tableCaption="List of All Orders"
            />
          )}
        </TabsContent>
        <TabsContent value="pending">
          {orders && orders.length > 0 && (
            <OrderTableDashboard
              storeId={storeId}
              storeCurrency={storeCurrency}
              orders={orders.filter((order) => order.orderStatus === 'pending')}
              tableCaption="List of All Pending Orders"
            />
          )}
        </TabsContent>
        <TabsContent value="in_progress">
          {orders && orders.length > 0 && (
            <OrderTableDashboard
              storeId={storeId}
              storeCurrency={storeCurrency}
              orders={orders.filter(
                (order) => order.orderStatus === 'in_progress',
              )}
              tableCaption="List of In Progress Orders"
            />
          )}
        </TabsContent>
        <TabsContent value="awaiting_payment">
          {orders && orders.length > 0 && (
            <OrderTableDashboard
              storeId={storeId}
              storeCurrency={storeCurrency}
              orders={orders.filter(
                (order) => order.orderStatus === 'awaiting_payment',
              )}
              tableCaption="List of Awaiting Payment Orders"
            />
          )}
        </TabsContent>
        <TabsContent value="shipped">
          {orders && orders.length > 0 && (
            <OrderTableDashboard
              storeId={storeId}
              storeCurrency={storeCurrency}
              orders={orders.filter((order) => order.orderStatus === 'shipped')}
              tableCaption="List of Shipped Orders"
            />
          )}
        </TabsContent>
        <TabsContent value="completed">
          {orders && orders.length > 0 && (
            <OrderTableDashboard
              storeId={storeId}
              storeCurrency={storeCurrency}
              orders={orders.filter(
                (order) => order.orderStatus === 'completed',
              )}
              tableCaption="List of Completed Orders"
            />
          )}
        </TabsContent>
        <TabsContent value="failed">
          {orders && orders.length > 0 && (
            <OrderTableDashboard
              storeId={storeId}
              storeCurrency={storeCurrency}
              orders={orders.filter((order) => order.orderStatus === 'failed')}
              tableCaption="List of Failed Orders"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DashboardOrders
