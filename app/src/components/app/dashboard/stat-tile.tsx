import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { cn } from '#/lib/utils'

export function StatTile({
  label,
  value,
  hint,
  className,
}: {
  label: string
  value: string | number
  hint?: string
  className?: string
}) {
  return (
    <Card className={cn('gap-1 border-border/60 py-3 shadow-none', className)}>
      <CardHeader className="px-3 py-0">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
      </CardHeader>
      {hint ? (
        <CardContent className="px-3 py-0">
          <p className="text-xs text-primary">{hint}</p>
        </CardContent>
      ) : null}
    </Card>
  )
}
