/**
 * Telegram settings-style section: uppercase label + grouped card.
 */
import { Card } from '#/components/ui/card'
import { cn } from '#/lib/utils'
import type { ReactNode } from 'react'

export function TelegramSection({
  title,
  children,
  className,
  cardClassName,
}: {
  title?: string
  children: ReactNode
  className?: string
  cardClassName?: string
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {title ? (
        <p className="px-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {title}
        </p>
      ) : null}
      <Card
        className={cn(
          'gap-0 overflow-hidden border-border/60 py-0 shadow-none',
          cardClassName,
        )}
      >
        {children}
      </Card>
    </div>
  )
}
