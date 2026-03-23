import { useState } from 'react'
import { EllipsisVertical, Search } from 'lucide-react'
import ProductsCategorys from './products/productsCategorys'
import ProductsCategorysAdd from './products/productsCategorysAdd'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useGetstoreProducts } from '@/lib/hooks/shop/product.hook'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const DashboardDashboard = ({
  userId,
  storeId,
}: {
  userId: string
  storeId: string
}) => {
  const [openProductsCategoryAdd, setOpenProductsCategoryAdd] =
    useState<boolean>(false)

  // store products
  const { data: products, isLoading: productsLoading } = useGetstoreProducts({
    userId,
    storeId,
  })

  return (
    <div className="flex flex-col gap-4 py-2">
      {/* search bar and buttons */}
      <div className="flex gap-2">
        <Input placeholder="search" />
        <Button>
          <Search />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={'outline'}>
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>products</DropdownMenuLabel>
              <DropdownMenuItem>
                <Button onClick={() => setOpenProductsCategoryAdd(true)}>
                  add category
                </Button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* dropdowm items */}
        <ProductsCategorysAdd
          storeId={storeId}
          open={openProductsCategoryAdd}
          setOpen={setOpenProductsCategoryAdd}
        />
      </div>
      {/* categorys */}
      <div className="flex justify-end">
        <ProductsCategorys storeId={storeId} />
      </div>
    </div>
  )
}

export default DashboardDashboard
