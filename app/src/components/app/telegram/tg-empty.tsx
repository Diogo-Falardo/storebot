/**
 * Empty list / no data state.
 *
 * @example
 * <TgEmpty title="No products" description="Add your first product" action={{ label: 'Add', onClick }} />
 */
import { InboxIcon, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { TgState } from './tg-state'

export function TgEmpty({
  icon = InboxIcon,
  title = 'Nothing here yet',
  description = 'When you add something, it will show up in this list.',
  action,
  children,
  fullPage = false,
  className,
}: {
  icon?: LucideIcon
  title?: string
  description?: string
  action?: { label: string; onClick: () => void } | ReactNode
  children?: ReactNode
  fullPage?: boolean
  className?: string
}) {
  return (
    <TgState
      fullPage={fullPage}
      className={className}
      icon={icon}
      title={title}
      description={description}
      action={action}
    >
      {children}
    </TgState>
  )
}
