/**
 * `/` route — mounts the Telegram Mini App lobby.
 * All lobby UI lives under `components/app/lobby`.
 */
import { AppLobby } from '#/components/app/lobby'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: AppLobby })
