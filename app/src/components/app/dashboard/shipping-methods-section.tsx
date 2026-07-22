/**
 * Shipping methods list (shop_shipping_methods).
 */
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Separator } from '#/components/ui/separator'
import { PlusIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import type { ShippingMethod } from './mock-data'
import { TelegramSection } from './telegram-section'

export function ShippingMethodsSection({
  methods: initial,
  shopId,
  onChange,
}: {
  methods: ShippingMethod[]
  shopId: string
  onChange?: (methods: ShippingMethod[]) => void
}) {
  const [methods, setMethods] = useState(initial)
  const [draft, setDraft] = useState('')

  const commit = (next: ShippingMethod[]) => {
    setMethods(next)
    onChange?.(next)
  }

  const add = () => {
    const method = draft.trim()
    if (!method) return
    commit([
      ...methods,
      { id: `ship_${crypto.randomUUID().slice(0, 8)}`, shopId, method },
    ])
    setDraft('')
  }

  const remove = (id: string) => {
    commit(methods.filter((m) => m.id !== id))
  }

  return (
    <div className="flex flex-col gap-4">
      <TelegramSection title="Shipping options">
        {methods.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            No shipping methods yet
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

      <TelegramSection title="Add method" cardClassName="p-3">
        <div className="flex gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="e.g. Free shipping over €50"
            className="border-border/60"
            onKeyDown={(e) => {
              if (e.key === 'Enter') add()
            }}
          />
          <Button type="button" size="icon" onClick={add} aria-label="Add">
            <PlusIcon />
          </Button>
        </div>
      </TelegramSection>
    </div>
  )
}
