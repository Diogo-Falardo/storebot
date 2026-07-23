/**
 * Payment methods — list + TanStack Form to add (shop_payment_methods).
 */
import { Button } from '#/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Separator } from '#/components/ui/separator'
import { useForm } from '@tanstack/react-form'
import { PlusIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import { formSchema, methodFormSchema } from './form-schemas'
import type { PaymentMethod } from './mock-data'
import { TelegramSection } from './telegram-section'

export function PaymentMethodsSection({
  methods: initial,
  shopId,
  onChange,
}: {
  methods: PaymentMethod[]
  shopId: string
  onChange?: (methods: PaymentMethod[]) => void
}) {
  const [methods, setMethods] = useState(initial)

  const commit = (next: PaymentMethod[]) => {
    setMethods(next)
    onChange?.(next)
  }

  const remove = (id: string) => {
    commit(methods.filter((m) => m.id !== id))
  }

  const form = useForm({
    defaultValues: {
      method: '',
    },
    validators: {
      onSubmit: formSchema(methodFormSchema),
    },
    onSubmit: async ({ value, formApi }) => {
      const parsed = methodFormSchema.parse(value)
      commit([
        ...methods,
        {
          id: `pay_${crypto.randomUUID().slice(0, 8)}`,
          shopId,
          method: parsed.method,
        },
      ])
      formApi.reset()
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <TelegramSection title="Accepted payments">
        {methods.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            No payment methods yet
          </p>
        ) : (
          methods.map((m, i) => (
            <div key={m.id}>
              {i > 0 && <Separator />}
              <div className="flex items-center gap-2 px-3 py-3">
                <p className="min-w-0 flex-1 text-[15px] text-foreground">
                  {m.method}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  aria-label={`Remove ${m.method}`}
                  onClick={() => remove(m.id)}
                >
                  <Trash2Icon />
                </Button>
              </div>
            </div>
          ))
        )}
      </TelegramSection>

      <form
        id="add-payment-method-form"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <TelegramSection title="Add method" cardClassName="p-4">
          <FieldGroup className="flex flex-col gap-3">
            <form.Field
              name="method"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Payment method</FieldLabel>
                    <div className="flex gap-2">
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="e.g. Crypto (USDT)"
                        className="border-border/60"
                        autoComplete="off"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        aria-label="Add payment method"
                        disabled={form.state.isSubmitting}
                      >
                        <PlusIcon />
                      </Button>
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>
        </TelegramSection>
      </form>
    </div>
  )
}
