/**
 * Full shop dashboard route — owner controls for clients, products, setup.
 */
import { AppDashboard } from '#/components/app/dashboard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return <AppDashboard />
}
