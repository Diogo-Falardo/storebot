import { useServerFn } from '@tanstack/react-start'
import { useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { sf_UpdateProductFromShop } from '@/server/shop/products/product.functions'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CREATE_PRODUCT_SCHEMA } from '@/schemas/product.schema'
import { useGetShopCategorys } from '@/lib/hooks/shop/category.hook'

type productProps = {
  id: string
  shopId: string
  productName?: string
  productPrice?: string
  productDesc?: string | null
  categoryId?: string | null
}

const ProductUpdate = (product: productProps) => {
  // get current shop categorys
  const { data, isLoading } = useGetShopCategorys({ shopId: product.shopId })

  const queryClient = useQueryClient()
  const closeDialogRef = useRef<HTMLButtonElement>(null)

  // server fn
  const update = useServerFn(sf_UpdateProductFromShop)

  const form = useForm({
    defaultValues: {
      productName: product.productName ?? '',
      productPrice: product.productPrice ?? '',
      productDesc: product.productDesc ?? '',
      categoryId: product.categoryId ?? 'null',
      visible: 1,
    },
    validators: {
      onSubmit: CREATE_PRODUCT_SCHEMA,
    },
    onSubmit: async ({ value }) => {
      try {
        const service = await update({
          data: { shopId: product.shopId, productId: product.id, dto: value },
        })
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
        <Button className="w-full">update product</Button>
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
