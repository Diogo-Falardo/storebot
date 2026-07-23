/**
 * Sticky Telegram-style lobby header.
 *
 * Props: username (optional greeting), className.
 *
 * Usage:
 *   <LobbyHeader username={user.username} />
 */

import { cn } from '#/lib/utils'

export function LobbyHeader({
  username,
  className,
}: {
  username?: string | null
  className?: string
}) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b border-border/60 bg-card/95 backdrop-blur-md',
        className,
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-lg flex-col items-center justify-center px-3">
        <h1 className="text-base font-semibold tracking-tight text-foreground">
          Telegram Shops
        </h1>
        {username ? (
          <p className="text-xs text-muted-foreground">
            Hi, @{username}
          </p>
        ) : null}
      </div>
    </header>
  )
}
