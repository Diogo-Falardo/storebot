import { useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { PackageSearch, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'
import { Button } from '../../ui/button'
import { Field, FieldError, FieldGroup } from '../../ui/field'
import InputEndInlineButtonDemo from '../../shadcn-studio/input/input-31'
import { Spinner } from '../../ui/spinner'
import { ScrollArea } from '../../ui/scroll-area'
import { Empty, EmptyDescription, EmptyTitle } from '../../ui/empty'
import { Card, CardTitle } from '../../ui/card'
import { useGetShopCategorys } from '@/lib/hooks/shop/category.hook'
import {
  sf_CreateCategory,
  sf_DeleteCategory,
} from '@/server/shop/products/category/productCategory.functions'
import { CREATE_CATEGORY_SCHEMA } from '@/schemas/category.schema'

const ProductCategoryAdd = ({ shopId }: { shopId: string }) => {
  // load current payment methods
  const { data, isLoading } = useGetShopCategorys({ shopId })

  const queryClient = useQueryClient()

  const [deletingId, setDeletingId] = useState<string | null>(null)

  const addCategory = useServerFn(sf_CreateCategory)
  const deleteCategory = useServerFn(sf_DeleteCategory)

  const form = useForm({
    defaultValues: {
      category: '',
    },
    validators: {
      onSubmit: CREATE_CATEGORY_SCHEMA,
    },
    onSubmit: async ({ value }) => {
      try {
        await addCategory({
          data: { shopId, category: value.category },
        })
        toast.success(`NEW Category: ${value.category}`)
        queryClient.invalidateQueries({ queryKey: ['categorys', shopId] })
      } catch (err: any) {
        toast.error(err.message ?? 'Error adding category.')
      }
    },
  })

  const useDeleteCategory = async (categoryId: string) => {
    setDeletingId(categoryId)
    try {
      await deleteCategory({
        data: { shopId, categoryId },
      })
      queryClient.invalidateQueries({ queryKey: ['categorys', shopId] })
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
        <Button>
          <PackageSearch />
          Product Categorys
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        {/* new category */}
        <div className="flex items-center gap-2">
          <form
            className="flex-1"
            id="add-payment-method-form"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup>
              <form.Field
                name="category"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <InputEndInlineButtonDemo
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="New Category"
                        autoComplete="off"
                        icon={<PackageSearch />}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            </FieldGroup>
          </form>
        </div>
        {/* current categorys */}
        <div className="flex justify-center pt-2">
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
                  <Card key={category.id} className="w-full p-1 rounded-sm">
                    <div className="px-0.5 flex flex-row justify-between items-center">
                      <CardTitle className="capitalize font-medium">
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
              <EmptyTitle className="text-base">No Categories</EmptyTitle>
              <EmptyDescription className="">
                Please add at least one product category so your customers can
                easily browse and discover your products. Well-organized
                categories improve navigation and enhance the overall shopping
                experience.
              </EmptyDescription>
            </Empty>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ProductCategoryAdd
