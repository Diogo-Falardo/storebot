import { useForm } from '@tanstack/react-form'
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
import {
  productDto,
  productDtoExtend,
  productDtoExtendedType,
  productExtendedSchema,
  productExtendedSchemaType,
} from '@/db/schemas/product.schema'
import { addProductToShop } from '@/server/shop/products/products.server'
import { useQueryClient } from '@tanstack/react-query'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useRef } from 'react'
import { PackagePlus } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'
import { useGetShopCategorys } from '@/server/shop/products/category/productCategory.hook'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const addProduct = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { userId: string; dto: productDtoExtendedType }) => data,
  )
  .handler(async ({ data }) => {
    return await addProductToShop(data.userId, data.dto.shopId, data.dto)
  })

const ProductAdd = ({ userId, shopId }: { userId: string; shopId: string }) => {
  const { data: categories, isLoading } = useGetShopCategorys({ shopId })
  const queryClient = useQueryClient()
  const closeDialogRef = useRef<HTMLButtonElement>(null)

  const add = useServerFn(addProduct)

  const form = useForm({
    defaultValues: {
      productName: '',
      productPrice: '',
      productDesc: '',
      categoryId: 'none',
      visible: 1,
    },
    validators: {
      onSubmit: productDto,
    },
    onSubmit: async ({ value }) => {
      const _payload = {
        shopId,
        ...value,
      }

      const payload = productDtoExtend.parse(_payload)

      try {
        await add({ data: { userId, dto: payload } })
        toast.success('Added' + value.productName)
        queryClient.invalidateQueries({ queryKey: ['products'] })
        closeDialogRef.current?.click()
      } catch (err: any) {
        console.error('Error: ', err)
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
