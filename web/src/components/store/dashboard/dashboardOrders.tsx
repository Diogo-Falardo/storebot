import { EllipsisIcon, ReceiptTextIcon } from 'lucide-react'
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
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import Orders from '../orders/orders'

const DashboardOrders = ({ storeId }: { storeId: string }) => {
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

  return (
    <div className="flex-1 py-2">
      {/* controller of the page content */}
      <Tabs className="px-2">
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
            <DropdownMenuContent align="end" className="flex flex-col gap-0.5">
              <DropdownMenuItem asChild>
                <TabsTrigger value="shipped">Shipped</TabsTrigger>
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
          {Array.isArray(orders) &&
            orders.length > 0 &&
            orders.map((order) => <div key={order.id}>{order.id}</div>)}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DashboardOrders
