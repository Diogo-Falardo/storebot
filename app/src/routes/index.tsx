import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

/**
 * Blank entry route — rebuild UI intentionally from here.
 * Server, schemas, and `components/ui` are still available.
 */
function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-2 bg-background p-6 text-center text-foreground">
      <h1 className="text-lg font-semibold">Storebot</h1>
      <p className="text-sm text-muted-foreground">UI reset — start from components.</p>
    </main>
  )
}
