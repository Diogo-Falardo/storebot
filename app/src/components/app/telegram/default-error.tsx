import { useNavigate, useRouter, type ErrorComponentProps } from '@tanstack/react-router'
import { TgError } from './tg-error'

/** Wired as router `defaultErrorComponent` */
export function DefaultError({ error, reset }: ErrorComponentProps) {
  const navigate = useNavigate()
  const router = useRouter()
  const message =
    error instanceof Error ? error.message : 'Unexpected application error'

  return (
    <TgError
      fullPage
      title="Something broke"
      message={message}
      onRetry={() => {
        reset()
        void router.invalidate()
      }}
      onHome={() => void navigate({ to: '/' })}
    />
  )
}
