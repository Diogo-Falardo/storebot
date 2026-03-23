import StoreConfig from './settings/storeConfig'
import StoreShippingMethod from './settings/storeShippingMethods'
import StorePaymentMethod from './settings/storePaymentMethods'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const DashboardSettings = ({
  userId,
  storeId,
}: {
  userId: string
  storeId: string
}) => {
  return (
    <div className="flex flex-col gap-4 py-2">
      {/* store configuration */}
      <StoreConfig userId={userId} storeId={storeId} />
      {/* methods */}
      <Tabs defaultValue="Payment" className="flex-1">
        <TabsList variant={'line'}>
          <TabsTrigger
            className="text-lg font-sans text-neutral-500"
            value="Shipping"
          >
            Shipping Methods
          </TabsTrigger>
          <TabsTrigger
            className="text-lg dark:data-[state=active]:border-primary font-sans text-neutral-500"
            value="Payment"
          >
            Payment Methods
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Shipping" className="mt-2 px-2 h-full">
          <StoreShippingMethod userId={userId} storeId={storeId} />
        </TabsContent>
        <TabsContent value="Payment" className="mt-2 px-2 h-full">
          <StorePaymentMethod userId={userId} storeId={storeId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DashboardSettings
