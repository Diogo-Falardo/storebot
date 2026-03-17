import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/HowToUse')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(public)/howtouse"!</div>
}
