/**
 * =============================================================================
 * TgAlert
 * =============================================================================
 *
 * WHAT IT IS
 * ----------
 * An inline Telegram-style banner for in-page / in-form feedback.
 * Soft tinted surface, optional title + body, optional dismiss.
 * Not a toast system and not a modal — it sits in the document flow.
 *
 * WHEN TO USE
 * -----------
 * - Form submit success or failure under the form (e.g. shop info save)
 * - Page-level notices (“You’re offline”, “Changes pending”)
 * - Inline warnings that must stay visible until dismissed or fixed
 *
 * WHEN NOT TO USE
 * ---------------
 * - Transient toasts that float and auto-hide (use a toast library)
 * - Blocking confirmations (use Dialog / AlertDialog)
 * - Full-page crash / not-found screens (use TgNotFound or error page)
 *
 * HOW TO USE
 * ----------
 * // Success after save
 * <TgAlert
 *   variant="success"
 *   title="Saved"
 *   description="Shop information updated."
 *   onClose={() => setOk(null)}
 * />
 *
 * // Error from server
 * <TgAlert variant="destructive" title="Update failed">
 *   {errorMessage}
 * </TgAlert>
 *
 * // Info with custom icon
 * <TgAlert variant="info" title="Tip" icon={<InfoIcon className="size-5" />}>
 *   You can change currency anytime.
 * </TgAlert>
 *
 * PROPS
 * -----
 * - variant?: 'info' | 'success' | 'warning' | 'destructive' (default: info)
 * - title?: string — semibold first line
 * - description?: string — muted second line (or use children as body)
 * - children?: ReactNode — body content; shown under title/description
 * - icon?: ReactNode — replaces default Lucide icon for the variant
 * - onClose?: () => void — shows a small dismiss control when set
 * - className?: string — outer wrapper extras
 *
 * DESIGN / LOGIC
 * --------------
 * - Token-only colors (primary / chart / destructive tints on soft fills)
 * - Hierarchy: icon | title → description/children | dismiss
 * - a11y: role="alert" for warning/destructive (assertive); role="status"
 *   for info/success (polite) so screen readers aren’t over-interrupted
 * - Dismiss is optional so permanent notices don’t force a close control
 * - Dense padding and rounded-2xl match Telegram grouped cells
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
    box: 'border-primary/25 bg-primary/10',
    icon: 'text-primary',
    Icon: InfoIcon,
  },
  success: {
    box: 'border-chart-2/30 bg-chart-2/10',
    icon: 'text-chart-2',
    Icon: CheckCircle2Icon,
  },
  warning: {
    box: 'border-chart-3/35 bg-chart-3/10',
    icon: 'text-chart-3',
    Icon: AlertTriangleIcon,
  },
  destructive: {
    box: 'border-destructive/30 bg-destructive/10',
    icon: 'text-destructive',
    Icon: XCircleIcon,
  },
} as const

export type TgAlertVariant = keyof typeof variants

export type TgAlertProps = {
  variant?: TgAlertVariant
  title?: string
  description?: string
  children?: ReactNode
  icon?: ReactNode
  onClose?: () => void
  className?: string
}

export function TgAlert({
  variant = 'info',
  title,
  description,
  children,
  icon,
  onClose,
  className,
}: TgAlertProps) {
  const v = variants[variant]
  const DefaultIcon = v.Icon
  const assertive = variant === 'warning' || variant === 'destructive'

  return (
    <div
      role={assertive ? 'alert' : 'status'}
      className={cn(
        'flex gap-3 rounded-2xl border px-3.5 py-3 text-foreground',
        v.box,
        className,
      )}
    >
      <span className={cn('mt-0.5 shrink-0', v.icon)} aria-hidden>
        {icon ?? <DefaultIcon className="size-5" />}
      </span>

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
          <div
            className={cn(
              'text-sm text-muted-foreground',
              (title || description) && 'mt-1',
            )}
          >
            {children}
          </div>
        ) : null}
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
