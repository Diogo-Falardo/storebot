/**
 * =============================================================================
 * TgNotFound
 * =============================================================================
 *
 * WHAT IT IS
 * ----------
 * A quiet, Telegram Mini App–style “not found” / missing-screen state.
 * Centered icon + title + short description, optionally one primary action
 * (e.g. “Go home”). Looks like a native empty settings screen, not a crash.
 *
 * WHEN TO USE
 * -----------
 * - TanStack Router `defaultNotFoundComponent` (unknown routes)
 * - Missing resource UI inside a page (“Shop not found”)
 * - Soft empty destination when a deep link is invalid
 *
 * WHEN NOT TO USE
 * ---------------
 * - API/runtime failures → use an error component, not this
 * - Empty lists that are valid but have zero items → empty-state UI
 * - Permission denied → forbidden / access UI
 *
 * HOW TO USE
 * ----------
 * // Router default (full viewport)
 * <TgNotFound
 *   actionLabel="Go home"
 *   onAction={() => navigate({ to: '/' })}
 * />
 *
 * // Inside a page / sheet (no min-height shell)
 * <TgNotFound
 *   fullPage={false}
 *   title="Shop not found"
 *   description="This store is unavailable or the link is wrong."
 * />
 *
 * // Title only, no button
 * <TgNotFound title="Nothing here" />
 *
 * PROPS
 * -----
 * - title?: string — heading (default: "Page not found")
 * - description?: string — muted supporting line
 * - actionLabel?: string — button label; ignored without onAction
 * - onAction?: () => void — click handler; button only if both set
 * - className?: string — extra classes on the outer wrapper
 * - fullPage?: boolean — true (default): min-h-dvh centered shell;
 *   false: compact block for embedding
 *
 * DESIGN / LOGIC
 * --------------
 * - Telegram iOS density: no glass, gradients, or heavy motion
 * - Theme tokens only (background, card, muted-foreground, border)
 * - Large tap target via shadcn Button when action is present
 * - Action is opt-in so pure “display only” not-found stays calm
 * - SearchX icon signals “missing” without alarming like an error octagon
 */

import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'
import { SearchXIcon } from 'lucide-react'

export type TgNotFoundProps = {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
  /** When true (default), fills the viewport for route-level use */
  fullPage?: boolean
}

export function TgNotFound({
  title = 'Page not found',
  description = 'This screen doesn’t exist or the link is broken.',
  actionLabel,
  onAction,
  className,
  fullPage = true,
}: TgNotFoundProps) {
  const showAction = Boolean(actionLabel && onAction)

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 text-center',
        fullPage ? 'min-h-dvh bg-background' : 'py-12',
        className,
      )}
      role="status"
    >
      <div
        className={cn(
          'mb-4 flex size-16 items-center justify-center rounded-full',
          'border border-border/60 bg-card text-muted-foreground',
        )}
        aria-hidden
      >
        <SearchXIcon className="size-7" />
      </div>

      <h1 className="text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h1>

      {description ? (
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}

      {showAction ? (
        <Button
          type="button"
          className="mt-5 min-h-11 w-full max-w-xs"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
