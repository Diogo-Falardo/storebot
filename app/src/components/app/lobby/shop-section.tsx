/**
 * Telegram grouped section: muted label (+ optional count) + card shell.
 * GSAP: light section enter only — does not stagger every favorite row.
 *
 * Props: title, count?, children, animate?, className?
 *
 * Usage:
 *   <ShopSection title="Favorite shops" count={60}>{rows}</ShopSection>
 */

import { Card } from '#/components/ui/card'
import { cn } from '#/lib/utils'
import gsap from 'gsap'
import { useEffect, useRef, type ReactNode } from 'react'

export function ShopSection({
  title,
  count,
  children,
  animate = true,
  className,
}: {
  title: string
  count?: number
  children: ReactNode
  animate?: boolean
  className?: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!animate || !rootRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rootRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
      )
    }, rootRef)

    return () => ctx.revert()
  }, [animate])

  return (
    <div ref={rootRef} className={cn('flex flex-col gap-2', className)}>
      <p className="px-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {title}
        {typeof count === 'number' ? (
          <span className="font-normal normal-case tracking-normal text-muted-foreground/80">
            {' '}
            · {count}
          </span>
        ) : null}
      </p>
      <Card className="gap-0 overflow-hidden border-border/60 py-0 shadow-none">
        {children}
      </Card>
    </div>
  )
}
