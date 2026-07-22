/**
 * Sticky Telegram-style top bar for dashboard screens.
 */
import { Button } from '#/components/ui/button'
import { ArrowLeftIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export function DashboardHeader({
  title,
  onBack,
  right,
}: {
  title: string
  onBack?: () => void
  right?: ReactNode
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-lg items-center justify-between px-3">
        {onBack ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-primary"
            aria-label="Back"
            onClick={onBack}
          >
            <ArrowLeftIcon />
          </Button>
        ) : (
          <div className="size-9" aria-hidden />
        )}
        <h1 className="text-base font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <div className="flex size-9 items-center justify-center">{right}</div>
      </div>
    </header>
  )
}
