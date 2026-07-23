/**
 * 404 / missing resource — Telegram Mini App style.
 *
 * @example
 * <TgNotFound />
 * <TgNotFound title="Shop not found" onHome={() => navigate({ to: '/' })} />
 */
import { SearchXIcon } from 'lucide-react'
import { TgState } from './tg-state'

export function TgNotFound({
  title = 'Page not found',
  description = 'This screen doesn’t exist or the link is broken.',
  onHome,
  onBack,
  fullPage = true,
}: {
  title?: string
  description?: string
  onHome?: () => void
  onBack?: () => void
  fullPage?: boolean
}) {
  return (
    <TgState
      fullPage={fullPage}
      icon={SearchXIcon}
      iconClassName="text-muted-foreground"
      title={title}
      description={description}
      action={
        onHome
          ? { label: 'Go to lobby', onClick: onHome }
          : undefined
      }
      secondaryAction={
        onBack ? { label: 'Go back', onClick: onBack } : undefined
      }
    />
  )
}
