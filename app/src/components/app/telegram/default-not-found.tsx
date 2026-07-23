import { useNavigate, useRouter } from '@tanstack/react-router'
import { TgNotFound } from './tg-not-found'

/** Wired as router `defaultNotFoundComponent` */
export function DefaultNotFound() {
  const navigate = useNavigate()
  const router = useRouter()

  return (
    <TgNotFound
      fullPage
      onHome={() => void navigate({ to: '/' })}
      onBack={() => router.history.back()}
    />
  )
}
