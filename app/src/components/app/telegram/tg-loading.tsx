/**
 * Loading states — full page or inline.
 *
 * @example
 * <TgLoading fullPage label="Opening shop…" />
 * <TgLoading />
 */
import { Skeleton } from '#/components/ui/skeleton'
import { cn } from '#/lib/utils'
import { Loader2Icon } from 'lucide-react'

export function TgLoading({
  label = 'Loading…',
  fullPage = false,
  className,
}: {
  label?: string
  fullPage?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        fullPage ? 'min-h-dvh bg-background' : 'py-12',
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2Icon className="size-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

/** Skeleton layout for Telegram settings-style pages */
export function TgPageSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-3 py-4">
      <Skeleton className="h-14 w-full rounded-2xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-2xl" />
      ))}
    </div>
  )
}
