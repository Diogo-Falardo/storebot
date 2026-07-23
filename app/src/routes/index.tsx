import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'
import { authentication, FAKE_INITDATA } from '#/server/authentication'
import type { OutputUser } from '#/db/schemas/user/user.types'
import { fetchCurrentUser } from '#/server/users/user.function'
import { TgAlert } from '#/components/app/telegram/tg-alert'
import { LobbyPage } from '#/components/app/lobby/lobby-page'

export const Route = createFileRoute('/')({
  component: Lobby,
})

function Lobby() {
  const _authentication = useServerFn(authentication)
  const fetchUser = useServerFn(fetchCurrentUser)
  const [user, setUser] = useState<OutputUser>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    let cancelled = false

    const auth = async () => {
      try {
        const auth = await _authentication({ data: FAKE_INITDATA })
        if (auth !== 'ok') {
          if (!cancelled) setError('Authentication failed!')
          return
        }

        const me = await fetchUser()
        if (!cancelled) setUser(me)
      } catch (error) {
        console.error('route.lobby', error)
        if (!cancelled) setError('Authentication failed!')
      }
    }
    auth()

    return () => {
      cancelled = true
    }
  }, [_authentication, fetchUser])

  if (user) {
    console.log(user)
  }

  // Auth error — keep TgAlert; do not mount lobby
  if (error) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background p-6 text-foreground">
        <TgAlert
          variant="destructive"
          title="Sign-in failed"
          description={error}
          onClose={() => setError(undefined)}
          className="w-full max-w-sm"
        />
      </main>
    )
  }

  // Loading while user is undefined and no error
  if (!user) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center bg-background text-sm text-muted-foreground">
        Connecting…
      </main>
    )
  }

  return <LobbyPage user={user} />
}
