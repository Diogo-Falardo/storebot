import { Dispatch, SetStateAction, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useForm } from '@tanstack/react-form'
import { useServerFn } from '@tanstack/react-start'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { sf_create_Category } from '@/server/category/category.functions'
import { create_CATEGORY } from '@/db/schemas/category.schema'

interface ProductCategoryAddProps {
  storeId: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const ProductCategorysAdd = ({
  storeId,
  open,
  setOpen,
}: ProductCategoryAddProps) => {
  const addCategory = useServerFn(sf_create_Category)
  const closeDialogRef = useRef<HTMLButtonElement>(null)

  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues: {
      categoryName: '',
    },
    validators: {
      onSubmit: create_CATEGORY,
    },
    onSubmit: async ({ value }) => {
      try {
        await addCategory({
          data: { storeId, category: value.categoryName },
        })
        toast.success(`NEW Category: ${value.categoryName}`)
        queryClient.invalidateQueries({ queryKey: ['categorys', storeId] })
        closeDialogRef.current?.click()
      } catch (err: any) {
        toast.error(err.message ?? 'Error adding category.')
      }
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new category</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <form
            className="flex-1"
            id="add-category-method-form"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup>
              <form.Field
                name="categoryName"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="New Category"
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
        </div>
        <DialogFooter>
          <DialogClose ref={closeDialogRef} asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button form="add-category-method-form" type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ProductCategorysAdd
