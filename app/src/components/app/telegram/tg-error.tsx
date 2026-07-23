/**
 * Error / failure state (API crash, failed mutation).
 *
 * @example
 * <TgError message={error.message} onRetry={() => refetch()} />
 */
import { Button } from '#/components/ui/button'
import { OctagonAlertIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { TgState } from './tg-state'

export function TgError({
  title = 'Something went wrong',
  message,
  onRetry,
  onHome,
  fullPage = false,
  children,
}: {
  title?: string
  message?: string
  onRetry?: () => void
  onHome?: () => void
  fullPage?: boolean
  children?: ReactNode
}) {
  return (
    <TgState
      fullPage={fullPage}
      icon={OctagonAlertIcon}
      iconClassName="border-destructive/25 bg-destructive/10 text-destructive"
      title={title}
      description={message ?? 'An unexpected error occurred. Please try again.'}
      action={
        onRetry
          ? { label: 'Try again', onClick: onRetry }
          : undefined
      }
      secondaryAction={
        onHome ? { label: 'Go to lobby', onClick: onHome } : undefined
      }
    >
      {children}
    </TgState>
  )
}

/** Compact inline error for forms / sheets */
export function TgErrorInline({
  message,
  onRetry,
  className,
}: {
  message: string
  onRetry?: () => void
  className?: string
}) {
  return (
    <div
      className={
        className ??
        'flex flex-col items-center gap-2 rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-4 text-center'
      }
    >
      <p className="text-sm text-destructive">{message}</p>
      {onRetry ? (
        <Button type="button" size="sm" variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </div>
  )
}
