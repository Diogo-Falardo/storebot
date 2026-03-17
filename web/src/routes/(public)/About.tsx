import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/About')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(public)/About"!</div>
}
