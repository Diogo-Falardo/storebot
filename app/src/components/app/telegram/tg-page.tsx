/**
 * Simple page shell: optional sticky title bar + scroll body.
 * Matches lobby / dashboard header feel.
 */
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'
import { ArrowLeftIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export function TgPage({
  title,
  onBack,
  right,
  children,
  className,
  bodyClassName,
}: {
  title?: string
  onBack?: () => void
  right?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <div
      className={cn(
        'flex min-h-dvh flex-col bg-background text-foreground',
        className,
      )}
    >
      {(title || onBack || right) && (
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
            <div className="flex size-9 items-center justify-center">
              {right}
            </div>
          </div>
        </header>
      )}
      <main
        className={cn(
          'mx-auto w-full max-w-lg flex-1 px-3 py-4 pb-10',
          bodyClassName,
        )}
      >
        {children}
      </main>
    </div>
  )
}
