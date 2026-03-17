import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/Pricing')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(public)/Pricing"!</div>
}
