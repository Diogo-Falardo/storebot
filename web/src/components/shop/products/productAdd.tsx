import { useRef } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { useRouter } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { PackagePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { sf_AddProductToShop } from '@/server/shop/products/product.functions'
import { CREATE_PRODUCT_SCHEMA } from '@/schemas/product.schema'
import { useGetShopCategorys } from '@/lib/hooks/shop/category.hook'

const ProductAdd = ({ userId, shopId }: { userId: string; shopId: string }) => {
  const router = useRouter()
  // load current categories
  const { data: categories, isLoading } = useGetShopCategorys({ shopId })

  const queryClient = useQueryClient()
  const closeDialogRef = useRef<HTMLButtonElement>(null)

  const add = useServerFn(sf_AddProductToShop)

  const form = useForm({
    defaultValues: {
      productName: '',
      productPrice: '',
      productDesc: '',
      categoryId: 'none',
      visible: 1,
    },
    validators: {
      onSubmit: CREATE_PRODUCT_SCHEMA,
    },
    onSubmit: async ({ value }) => {
      try {
        await add({ data: { userId, shopId, dto: value } })
        toast.success('Added' + value.productName)
        console.log(`
          
          ADDED THE CURRENT PRODUCT:
          
          PRODUCT NAME: ${value.productName}
          
          `)
        queryClient.invalidateQueries({ queryKey: ['products'] })
        router.invalidate()
        closeDialogRef.current?.click()
      } catch (err: any) {
        console.error(err)
        toast.error(err.message ?? 'Error while adding product')
      }
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PackagePlus />
          add product
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Add what ever you want to sell on your shop!
          </DialogDescription>
        </DialogHeader>
        <form
          id="add-product-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            {/* product name */}
            <form.Field
              name="productName"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Product Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Protein Cookie"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            {/* product price */}
            <form.Field
              name="productPrice"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Product Price</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="5.99"
                      autoComplete="off"
                      inputMode="decimal"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            {/* product description */}
            <form.Field
              name="productDesc"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Product Description
                    </FieldLabel>
                    <FieldDescription>
                      Small Description for your product...
                    </FieldDescription>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Super Delicious"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            <form.Field
              name="categoryId"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Product Category
                    </FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {isLoading && <div>Loading...</div>}
                        {!isLoading &&
                          categories &&
                          categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.category}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
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
            form="add-product-form"
            type="submit"
            disabled={form.state.isSubmitting}
          >
            {form.state.isSubmitting ? 'Adding...' : 'add product'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ProductAdd
