/**
 * Products control panel — hide / out-of-stock toggles aligned with schema.
 */
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Separator } from '#/components/ui/separator'
import { Switch } from '#/components/ui/switch'
import { PlusIcon, SearchIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  formatPrice,
  type Currency,
  type Product,
} from './mock-data'
import { TelegramSection } from './telegram-section'

export function ProductsSection({
  products: initial,
  currency,
  onChange,
}: {
  products: Product[]
  currency: Currency
  onChange?: (products: Product[]) => void
}) {
  const [products, setProducts] = useState(initial)
  const [query, setQuery] = useState('')

  const update = (id: string, patch: Partial<Product>) => {
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
      onChange?.(next)
      return next
    })
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    )
  }, [products, query])

  const visible = products.filter((p) => !p.hidden).length
  const oos = products.filter((p) => p.outOfStock).length

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2">
        <Metric label="Total" value={products.length} />
        <Metric label="Listed" value={visible} />
        <Metric label="OOS" value={oos} />
      </div>

      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products"
          className="border-border/60 bg-card pl-9"
        />
      </div>

      <Button type="button" className="w-full" variant="default">
        <PlusIcon data-icon="inline-start" />
        Add product
      </Button>

      <TelegramSection title="Catalog">
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No products match “{query}”
          </p>
        ) : (
          filtered.map((product, i) => (
            <div key={product.id}>
              {i > 0 && <Separator />}
              <ProductRow
                product={product}
                currency={currency}
                onToggleHidden={(hidden) => update(product.id, { hidden })}
                onToggleOos={(outOfStock) =>
                  update(product.id, { outOfStock })
                }
              />
            </div>
          ))
        )}
      </TelegramSection>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card px-3 py-3">
      <p className="text-xs text-muted-foreground uppercase">{label}</p>
      <p className="text-xl font-semibold tabular-nums">{value}</p>
    </div>
  )
}

function ProductRow({
  product,
  currency,
  onToggleHidden,
  onToggleOos,
}: {
  product: Product
  currency: Currency
  onToggleHidden: (hidden: boolean) => void
  onToggleOos: (outOfStock: boolean) => void
}) {
  return (
    <div className="flex flex-col gap-3 px-3 py-3.5">
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-sm font-semibold text-secondary-foreground">
          {product.name.slice(0, 1)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="truncate text-[15px] font-medium text-foreground">
              {product.name}
            </p>
            {product.hidden && <Badge variant="secondary">Hidden</Badge>}
            {product.outOfStock && (
              <Badge variant="outline">Out of stock</Badge>
            )}
          </div>
          <p className="text-sm text-primary">
            {formatPrice(product.price, currency)}
          </p>
          {product.description ? (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {product.description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <ToggleRow
          label="Hidden from shop"
          checked={product.hidden}
          onCheckedChange={onToggleHidden}
        />
        <ToggleRow
          label="Out of stock"
          checked={product.outOfStock}
          onCheckedChange={onToggleOos}
        />
      </div>
    </div>
  )
}

function ToggleRow({
  label,
  checked,
  onCheckedChange,
}: {
  label: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
      <span className="text-sm text-foreground">{label}</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}
