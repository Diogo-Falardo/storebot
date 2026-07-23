/**
 * Offline / connection banner or full state.
 */
import { WifiOffIcon } from 'lucide-react'
import { TgAlert } from './tg-alert'
import { TgState } from './tg-state'

export function TgOfflineBanner({
  onRetry,
}: {
  onRetry?: () => void
}) {
  return (
    <TgAlert
      variant="warning"
      title="You’re offline"
      description="Check your connection. Some actions won’t work until you’re back online."
      action={
        onRetry ? (
          <button
            type="button"
            className="text-sm font-medium text-primary"
            onClick={onRetry}
          >
            Retry
          </button>
        ) : undefined
      }
    />
  )
}

export function TgOffline({
  onRetry,
  fullPage = true,
}: {
  onRetry?: () => void
  fullPage?: boolean
}) {
  return (
    <TgState
      fullPage={fullPage}
      icon={WifiOffIcon}
      iconClassName="text-chart-3"
      title="No connection"
      description="Reconnect to the internet to keep using the mini app."
      action={onRetry ? { label: 'Retry', onClick: onRetry } : undefined}
    />
  )
}
