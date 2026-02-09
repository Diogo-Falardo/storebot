import { SignIn } from '@clerk/clerk-react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/sign-in/$')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SignIn signUpUrl="/auth/sign-up" />
}
