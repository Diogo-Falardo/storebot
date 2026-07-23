/**
 * Inline Telegram-style alert / banner.
 *
 * @example
 * <TgAlert variant="error" title="Failed" description="Try again" />
 * <TgAlert variant="success" onClose={() => setShow(false)}>Saved</TgAlert>
 */
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
  XCircleIcon,
  XIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'

const variants = {
  info: {
    box: 'border-primary/25 bg-primary/10 text-foreground',
    icon: 'text-primary',
    Icon: InfoIcon,
  },
  success: {
    box: 'border-chart-2/30 bg-chart-2/10 text-foreground',
    icon: 'text-chart-2',
    Icon: CheckCircle2Icon,
  },
  warning: {
    box: 'border-chart-3/35 bg-chart-3/10 text-foreground',
    icon: 'text-chart-3',
    Icon: AlertTriangleIcon,
  },
  error: {
    box: 'border-destructive/30 bg-destructive/10 text-foreground',
    icon: 'text-destructive',
    Icon: XCircleIcon,
  },
} as const

export type TgAlertVariant = keyof typeof variants

export function TgAlert({
  variant = 'info',
  title,
  description,
  children,
  onClose,
  className,
  action,
}: {
  variant?: TgAlertVariant
  title?: string
  description?: string
  children?: ReactNode
  onClose?: () => void
  className?: string
  action?: ReactNode
}) {
  const v = variants[variant]
  const Icon = v.Icon

  return (
    <div
      role="alert"
      className={cn(
        'flex gap-3 rounded-2xl border px-3.5 py-3',
        v.box,
        className,
      )}
    >
      <Icon className={cn('mt-0.5 size-5 shrink-0', v.icon)} />
      <div className="min-w-0 flex-1">
        {title ? (
          <p className="text-sm font-semibold text-foreground">{title}</p>
        ) : null}
        {description ? (
          <p
            className={cn(
              'text-sm text-muted-foreground',
              title && 'mt-0.5',
            )}
          >
            {description}
          </p>
        ) : null}
        {children ? (
          <div className={cn('text-sm', (title || description) && 'mt-1')}>
            {children}
          </div>
        ) : null}
        {action ? <div className="mt-2">{action}</div> : null}
      </div>
      {onClose ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="shrink-0 text-muted-foreground"
          aria-label="Dismiss"
          onClick={onClose}
        >
          <XIcon />
        </Button>
      ) : null}
    </div>
  )
}
