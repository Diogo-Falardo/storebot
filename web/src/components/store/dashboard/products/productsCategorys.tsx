import { useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { toast } from 'sonner'
import { Tags, X } from 'lucide-react'
import { useGetstoreCategorys } from '@/lib/hooks/shop/category.hook'
import { sf_DeleteCategory } from '@/server/store/products/category/productCategory.functions'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardTitle } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyTitle } from '@/components/ui/empty'

const ProductsCategorys = ({ storeId }: { storeId: string }) => {
  // load current payment methods
  const { data, isLoading } = useGetstoreCategorys({ storeId })

  const queryClient = useQueryClient()

  const [deletingId, setDeletingId] = useState<string | null>(null)

  const deleteCategory = useServerFn(sf_DeleteCategory)

  const useDeleteCategory = async (categoryId: string) => {
    setDeletingId(categoryId)
    try {
      await deleteCategory({
        data: { storeId, categoryId },
      })
      queryClient.invalidateQueries({ queryKey: ['categorys', storeId] })
      toast.success('Category deleted!')
      await new Promise((res) => setTimeout(res, 500))
    } catch (err) {
      toast.error('Error deleting category!')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={'secondary'}>
          <Tags />
          Categorys
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="py-2 px-1 border-primary/50 ring ring-primary bg-background"
      >
        {/* new category */}

        {/* current categorys */}
        <div className="flex justify-center">
          {isLoading && (
            <div>
              <Spinner />
              Loading Categorys
            </div>
          )}
          {data && typeof data !== 'string' && data.length > 0 ? (
            <ScrollArea className="max-h-50 w-full">
              <div className="flex flex-col gap-2">
                {data.map((category) => (
                  <Card
                    key={category.id}
                    className="w-full p-1 rounded-sm bg-primary/5 border-primary/30"
                  >
                    <div className="px-1 select-none flex flex-row justify-between items-center text-neutral-400">
                      <CardTitle className="capitalize font-medium cursor-pointer w-full">
                        {category.category}
                      </CardTitle>
                      <Button
                        variant={'ghost'}
                        className="text-destructive"
                        size={'icon-xs'}
                        onClick={() => useDeleteCategory(category.id)}
                        disabled={deletingId === category.id}
                      >
                        {deletingId === category.id ? <Spinner /> : <X />}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <Empty>
              <EmptyTitle className="text-base">
                No Product Categories Yet
              </EmptyTitle>
              <EmptyDescription>
                Add your first product category to help customers easily browse
                and discover your products.
              </EmptyDescription>
            </Empty>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ProductsCategorys
