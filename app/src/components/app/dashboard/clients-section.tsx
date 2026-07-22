/**
 * Clients control panel — ban / timeout, list of shop_clients.
 */
import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Separator } from '#/components/ui/separator'
import { Switch } from '#/components/ui/switch'
import { cn } from '#/lib/utils'
import { BanIcon, ClockIcon } from 'lucide-react'
import { useState } from 'react'
import {
  formatMemberSince,
  type ShopClient,
} from './mock-data'
import { TelegramSection } from './telegram-section'

export function ClientsSection({
  clients: initial,
  onChange,
}: {
  clients: ShopClient[]
  onChange?: (clients: ShopClient[]) => void
}) {
  const [clients, setClients] = useState(initial)

  const update = (id: string, patch: Partial<ShopClient>) => {
    setClients((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
      onChange?.(next)
      return next
    })
  }

  const active = clients.filter((c) => !c.banned).length
  const banned = clients.filter((c) => c.banned).length

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-border/60 bg-card px-3 py-3">
          <p className="text-xs text-muted-foreground uppercase">Active</p>
          <p className="text-2xl font-semibold tabular-nums">{active}</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card px-3 py-3">
          <p className="text-xs text-muted-foreground uppercase">Banned</p>
          <p className="text-2xl font-semibold tabular-nums">{banned}</p>
        </div>
      </div>

      <TelegramSection title="Members">
        {clients.map((client, i) => (
          <div key={client.id}>
            {i > 0 && <Separator />}
            <ClientRow
              client={client}
              onToggleBan={(banned) =>
                update(client.id, {
                  banned,
                  timeoutUntil: banned ? null : client.timeoutUntil,
                })
              }
              onTimeout={() =>
                update(client.id, {
                  timeoutUntil: new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000,
                  ).toISOString(),
                  banned: false,
                })
              }
              onClearTimeout={() =>
                update(client.id, { timeoutUntil: null })
              }
            />
          </div>
        ))}
      </TelegramSection>
    </div>
  )
}

function ClientRow({
  client,
  onToggleBan,
  onTimeout,
  onClearTimeout,
}: {
  client: ShopClient
  onToggleBan: (banned: boolean) => void
  onTimeout: () => void
  onClearTimeout: () => void
}) {
  const initials = client.username.slice(0, 2).toUpperCase()
  const timedOut =
    client.timeoutUntil != null &&
    new Date(client.timeoutUntil).getTime() > Date.now()

  return (
    <div className="flex flex-col gap-3 px-3 py-3.5">
      <div className="flex items-center gap-3">
        <Avatar className="size-11">
          <AvatarFallback
            className={cn(
              'text-sm font-semibold',
              client.banned
                ? 'bg-destructive/15 text-destructive'
                : 'bg-secondary text-secondary-foreground',
            )}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="truncate text-[15px] font-medium text-foreground">
              @{client.username}
            </p>
            {client.banned && <Badge variant="destructive">Banned</Badge>}
            {timedOut && !client.banned && (
              <Badge variant="secondary">Timeout</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Member since {formatMemberSince(client.memberSince)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
        <div className="flex items-center gap-2 text-sm text-foreground">
          <BanIcon className="size-4 text-muted-foreground" />
          Ban client
        </div>
        <Switch
          checked={client.banned}
          onCheckedChange={onToggleBan}
          aria-label={`Ban ${client.username}`}
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="flex-1"
          disabled={client.banned}
          onClick={onTimeout}
        >
          <ClockIcon data-icon="inline-start" />
          Timeout 7d
        </Button>
        {timedOut && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClearTimeout}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
