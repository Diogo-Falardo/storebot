import { useForm } from '@tanstack/react-form'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CirclePlus, Package, X } from 'lucide-react'
import { addCategorySchema } from '@/db/schemas/category.schema'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useGetShopCategorys } from '@/server/shop/products/category/productCategory.hook'
import { Spinner } from '@/components/ui/spinner'
import { useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import {
  createCategory,
  serverDeleteCategory,
} from '@/server/shop/products/category/productCategory.functions'
import { toast } from 'sonner'
import { useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

const ProductCategory = ({ shopId }: { shopId: string }) => {
  const { data, isLoading } = useGetShopCategorys({ shopId })
  const queryClient = useQueryClient()
  const closeDialogRef = useRef<HTMLButtonElement>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const addCategory = useServerFn(createCategory)
  const deleteCategory = useServerFn(serverDeleteCategory)

  const form = useForm({
    defaultValues: {
      category: '',
    },
    validators: {
      onSubmit: addCategorySchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await addCategory({ data: { shopId, category: value.category } })
        toast.success('Added category: ' + value.category)
        queryClient.invalidateQueries({ queryKey: ['categorys'] })
        closeDialogRef.current?.click()
      } catch (err: any) {
        console.error('Error: ', err)
        toast.error(err.message ?? 'Error while adding products')
      }
    },
  })

  const useDeleteCategory = async (categoryId: string) => {
    setDeletingId(categoryId)
    try {
      await deleteCategory({
        data: { shopId, categoryId },
      })
      queryClient.invalidateQueries({ queryKey: ['categorys'] })
      toast.success('Category deleted')
      await new Promise((res) => setTimeout(res, 500))
    } catch (err) {
      toast.error('Couldnt delete category')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>
          <Package />
          products category
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <PopoverHeader>
          {/* add category button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={'secondary'}>
                <CirclePlus />
                add category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Category</DialogTitle>
                <DialogDescription>
                  Create a category to organize your products
                </DialogDescription>
              </DialogHeader>
              <form
                id="add-product-category-form"
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
                          <FieldLabel htmlFor={field.name}>
                            Category Name
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="Cookies"
                            autoComplete="off"
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
              <DialogFooter>
                <DialogClose asChild>
                  <Button ref={closeDialogRef} variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  form="add-product-category-form"
                  type="submit"
                  disabled={form.state.isSubmitting}
                >
                  {form.state.isSubmitting ? 'Adding...' : 'add category'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PopoverHeader>
        {/* current categorys */}
        <div className="flex justify-center pt-2">
          {isLoading && (
            <div>
              <Spinner />
              Loading categorys
            </div>
          )}
          {data && data.length > 0 ? (
            <ScrollArea className="max-h-50 w-full pr-2">
              <div className="flex flex-col gap-2">
                {data.map((category) => (
                  <div>
                    <div
                      key={category.id}
                      className={`flex justify-between items-center`}
                    >
                      <Badge
                        variant={'ghost'}
                        className="text-base font-medium"
                      >
                        {category.category}
                      </Badge>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => useDeleteCategory(category.id)}
                        disabled={deletingId === category.id}
                      >
                        {deletingId === category.id ? <Spinner /> : <X />}
                      </Button>
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p>no categorys yet</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ProductCategory
