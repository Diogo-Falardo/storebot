/**
 * 403 / not allowed — e.g. not shop owner.
 */
import { ShieldOffIcon } from 'lucide-react'
import { TgState } from './tg-state'

export function TgForbidden({
  title = 'Access denied',
  description = 'You don’t have permission to view this screen.',
  onHome,
  fullPage = true,
}: {
  title?: string
  description?: string
  onHome?: () => void
  fullPage?: boolean
}) {
  return (
    <TgState
      fullPage={fullPage}
      icon={ShieldOffIcon}
      iconClassName="border-chart-3/30 bg-chart-3/10 text-chart-3"
      title={title}
      description={description}
      action={onHome ? { label: 'Go to lobby', onClick: onHome } : undefined}
    />
  )
}
