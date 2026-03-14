import { Outlet, createFileRoute } from '@tanstack/react-router'
import Navbar from '@/components/navbar'
import UnderConstruction from '@/components/underConstruction'

export const Route = createFileRoute('/(public)')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    // <div className="min-h-screen grid grid-rows-[auto,1fr,auto]">
    //   <header className="p-4">
    //     <Navbar />
    //   </header>
    //   <main className="p-6">
    //     <Outlet />
    //   </main>
    //   <footer className="p-4"></footer>
    // </div>
    <UnderConstruction />
  )
}
