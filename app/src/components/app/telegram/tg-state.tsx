/**
 * Centered empty / status block used by NotFound, Empty, Error, Forbidden, etc.
 */
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export function TgState({
  icon: Icon,
  iconClassName,
  title,
  description,
  children,
  action,
  secondaryAction,
  className,
  fullPage = false,
}: {
  icon: LucideIcon
  iconClassName?: string
  title: string
  description?: string
  children?: ReactNode
  action?: { label: string; onClick: () => void } | ReactNode
  secondaryAction?: { label: string; onClick: () => void } | ReactNode
  className?: string
  /** Fill viewport (route-level screens) */
  fullPage?: boolean
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 text-center',
        fullPage ? 'min-h-dvh bg-background' : 'py-12',
        className,
      )}
    >
      <div
        className={cn(
          'mb-4 flex size-16 items-center justify-center rounded-full',
          'border border-border/60 bg-card text-muted-foreground',
          iconClassName,
        )}
      >
        <Icon className="size-7" />
      </div>
      <h2 className="text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      {description ? (
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-3 max-w-sm">{children}</div> : null}
      {(action || secondaryAction) && (
        <div className="mt-5 flex w-full max-w-xs flex-col gap-2">
          {renderAction(action, 'default')}
          {renderAction(secondaryAction, 'secondary')}
        </div>
      )}
    </div>
  )
}

function renderAction(
  action: { label: string; onClick: () => void } | ReactNode | undefined,
  variant: 'default' | 'secondary',
) {
  if (!action) return null
  if (typeof action === 'object' && action !== null && 'label' in action) {
    return (
      <Button
        type="button"
        variant={variant}
        className="w-full"
        onClick={action.onClick}
      >
        {action.label}
      </Button>
    )
  }
  return action
}
