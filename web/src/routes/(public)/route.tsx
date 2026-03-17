import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Link,
  Outlet,
  createFileRoute,
  useNavigate,
} from '@tanstack/react-router'
// import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

gsap.registerPlugin(ScrollTrigger)

export const Route = createFileRoute('/(public)')({
  component: RouteComponent,
})

function RouteComponent() {
  const navbarRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (navbarRef.current) {
      gsap.fromTo(
        navbarRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 3, ease: 'power3.inOut' },
      )
    }
    if (footerRef.current) {
      gsap.fromTo(
        footerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 3, ease: 'power3.inOut' },
      )
    }
  }, [])

  return (
    <div className="min-h-screen bg-linear-to-t from-zinc-950 to-background flex flex-col justify-center  gap-3">
      <Navbar ref={navbarRef} />
      {/* <BotLinks /> */}
      <main className="p-3 flex-1 overflow-hidden">
        <ScrollArea className="h-full w-full">
          <Outlet />
        </ScrollArea>
      </main>
      <Footer ref={footerRef} />
    </div>
  )
}

// const BotLinks = () => {
//   const botLinksRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     if (botLinksRef.current) {
//       gsap.fromTo(
//         botLinksRef.current,
//         { y: 0, opacity: 0 },
//         { y: 0, opacity: 1, duration: 3, ease: 'power3.out' },
//       )
//     }
//   }, [])

//   return (
//     <div ref={botLinksRef} className="flex items-center justify-center gap-2">
//       <Button size={'sm'} className="text-xs tracking-wide">
//         <img className="w-5 h-5" src="/icons/telegram.svg" />
//         Telegram
//       </Button>
//     </div>
//   )
// }

const HowToUseButton = () => {
  const navigate = useNavigate()
  const btnRef = useRef<HTMLAnchorElement>(null)
  // animate flag so button dont crash on multiple clicks
  const animating = useRef(false)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (animating.current) return
    animating.current = true
    if (btnRef.current) {
      gsap.to(btnRef.current, {
        scale: 0.75,
        boxShadow: '0 0 5px #0c4a6e, 0 0 5px #082f49',
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut',
        onComplete: () => {
          animating.current = false
          navigate({ to: '/HowToUse' }) // Navigate after animation
        },
      })
    } else {
      animating.current = false
    }
  }

  return (
    <Link
      ref={btnRef}
      to="/HowToUse"
      className="text-base tracking-tighter font-semibold lowercase px-2 py-1 rounded-sm text-neutral-400 border ring bg-sky-950/70 ring-sky-800/25 border-sky-900/20 shadow-xs"
      onClick={handleClick}
    >
      how to use
    </Link>
  )
}

const Navbar = React.forwardRef<HTMLDivElement>((_, ref) => (
  <header
    ref={ref}
    className="sticky top-0 z-50 bg-background font-mono flex items-center justify-between shadow p-5 border-b border-neutral-900"
  >
    <Link
      to="/"
      className="text-3xl tracking-wide font-semibold text-neutral-200"
    >
      StoreBot
    </Link>
    <HowToUseButton />
  </header>
))

const Footer = React.forwardRef<HTMLDivElement>((_, ref) => (
  <footer
    ref={ref}
    className="sticky bottom-0 z-50 bg-background font-mono flex justify-center items-center shadow gap-3 p-5 border-t border-neutral-900 "
  >
    <Link
      to="/Pricing"
      className="text-base capitalize font-semibold text-neutral-300 hover:text-sky-400 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-sky-950/20"
    >
      Pricing
    </Link>
    <Link
      to="/About"
      className="text-base capitalize font-semibold text-neutral-300 hover:text-sky-400 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-sky-950/20"
    >
      about
    </Link>
    <Link
      to="/Terms"
      className="text-base capitalize font-semibold text-neutral-300 hover:text-sky-400 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-sky-950/20"
    >
      terms
    </Link>
  </footer>
))
