import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/Terms')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(public)/Terms"!</div>
}
