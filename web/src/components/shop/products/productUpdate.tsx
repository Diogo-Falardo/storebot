import { useForm } from '@tanstack/react-form'
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
import { Button } from '@/components/ui/button'
import { useQueryClient } from '@tanstack/react-query'
import { productUpdateFormSchema } from '@/db/schemas/product.schema'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useServerFn } from '@tanstack/react-start'
import { serverUpdateProductFromShop } from '@/server/shop/products/product.functions'
import { toast } from 'sonner'
import { useRouter } from '@tanstack/react-router'
import { useRef } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useGetShopCategorys } from '@/server/shop/products/category/productCategory.hook'

type productProps = {
  id: string
  shopId: string
  productName?: string
  productPrice?: string
  productDesc?: string | null
}

const ProductUpdate = (product: productProps) => {
  const { data, isLoading } = useGetShopCategorys({ shopId: product.shopId })
  const queryClient = useQueryClient()
  const closeDialogRef = useRef<HTMLButtonElement>(null)

  const update = useServerFn(serverUpdateProductFromShop)

  const form = useForm({
    defaultValues: {
      productName: product.productName,
      productPrice: product.productPrice,
      productDesc: product.productDesc ?? '',
      categoryId: 'none',
      id: product.id,
      shopId: product.shopId,
    },
    validators: {
      onSubmit: productUpdateFormSchema,
    },
    onSubmit: async ({ value }) => {
      const _payload = {
        ...value,
      }
      const payload = productUpdateFormSchema.parse(_payload)

      try {
        const service = await update({ data: { dto: payload } })
        toast.success(service)
        queryClient.invalidateQueries({ queryKey: ['products'] })
        closeDialogRef.current?.click()
      } catch (err: any) {
        toast.error(err.message ?? 'Error while updating product')
      }
    },
  })
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>update product</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>update Product</DialogTitle>
          <DialogDescription>
            You are updating: {product.productName}
          </DialogDescription>
        </DialogHeader>
        <form
          id="update-product-form"
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
                      placeholder={product.productName}
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
                      placeholder={product.productPrice}
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
                    <FieldDescription>{product.productDesc}</FieldDescription>
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
            {/* product category */}
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
                          data &&
                          data.map((category) => (
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
            <Button ref={closeDialogRef} variant={'outline'}>
              Cancel
            </Button>
          </DialogClose>
          <Button form="update-product-form" type="submit">
            update product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ProductUpdate
