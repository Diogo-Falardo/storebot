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
import { useRouter } from '@tanstack/react-router'

const addProduct = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { userId: string; dto: productDtoExtendedType }) => data,
  )
  .handler(async ({ data }) => {
    return await addProductToShop(data.userId, data.dto.shopId, data.dto)
  })

const ProductAdd = ({ userId, shopId }: { userId: string; shopId: string }) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const add = useServerFn(addProduct)

  const form = useForm({
    defaultValues: {
      productName: '',
      productPrice: '',
      productDesc: '',
      visible: 1,
    },
    validators: {
      onSubmit: productDto,
    },
    onSubmit: async ({ value }) => {
      console.log('Here')
      const _payload = {
        shopId,
        ...value,
      }

      const payload = productDtoExtend.parse(_payload)
      console.log('Parsed paylod:', payload)

      try {
        await add({ data: { userId, dto: payload } })
        toast.success('Added' + value.productName)
        queryClient.invalidateQueries({ queryKey: ['products'] })
        router.invalidate()
      } catch (err: any) {
        console.error('Error:', err)
        toast.error(err.message ?? 'Error while adding product')
      }
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>add product</Button>
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
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
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
