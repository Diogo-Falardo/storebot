import {
  type ReactNode,
} from 'react'
import { cn } from '#/lib/utils'
import { ChevronRightIcon } from 'lucide-react'


export function TelegramCell({
  icon,
  iconClass,
  title,
  subtitle,
  trailing,
  onClick,
}: {
  icon: ReactNode
  iconClass: string
  title: string
  subtitle: string
  trailing?: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 px-4 py-3.5 text-left',
        'transition-colors outline-none',
        'hover:bg-accent/60 active:bg-accent',
        'focus-visible:bg-accent focus-visible:ring-0',
      )}
    >
      <span
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-xl [&_svg]:size-5',
          iconClass,
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium text-foreground">
          {title}
        </span>
        <span className="block truncate text-sm text-muted-foreground">
          {subtitle}
        </span>
      </span>
      {trailing}
      <ChevronRightIcon className="size-5 shrink-0 text-muted-foreground" />
    </button>
  )
}
