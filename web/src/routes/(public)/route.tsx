import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Link,
  Outlet,
  createFileRoute,
  useNavigate,
} from '@tanstack/react-router'
import { useLayoutPublic } from '@/lib/data'

gsap.registerPlugin(ScrollTrigger)

export const Route = createFileRoute('/(public)')({
  component: RouteComponent,
})

function RouteComponent() {
  const navbarRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const setNavbarHeight = useLayoutPublic((s) => s.setHeaderHeight)
  const headerHeight = useLayoutPublic((s) => s.headerHeight)
  const setFooterHeight = useLayoutPublic((s) => s.setFooterHeight)
  const footerHeight = useLayoutPublic((s) => s.footerHeight)
  const setOffset = useLayoutPublic((s) => s.setOffset)

  useEffect(() => {
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight)
      gsap.fromTo(
        navbarRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 3, ease: 'power3.inOut' },
      )
    }
    if (footerRef.current) {
      setFooterHeight(footerRef.current.offsetHeight)
      gsap.fromTo(
        footerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 3, ease: 'power3.inOut' },
      )
    }
  }, [])

  useEffect(() => {
    if (headerHeight && footerHeight) {
      setOffset(headerHeight + footerHeight)
      console.log(`seted offset`)
    }
  }, [headerHeight, footerHeight])

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-t from-zinc-950 to-background">
      <Navbar ref={navbarRef} />
      {/* <BotLinks /> */}
      <main className="flex-1 flex flex-col items-center">
        <Outlet />
      </main>
      <Footer ref={footerRef} />
    </div>
  )
}

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
        scale: 0.5,
        boxShadow: '0 0 5px #0c4a6e, 0 0 5px #082f49',
        duration: 0.07,
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
    className="sticky top-0 z-50 bg-background font-mono flex items-center justify-center shadow border-b border-neutral-900"
  >
    <div className="flex w-full justify-between items-center p-5 max-w-5xl">
      <Link
        to="/"
        className="text-3xl tracking-wide font-semibold text-neutral-200"
      >
        StoreBot
      </Link>
      <HowToUseButton />
    </div>
  </header>
))

const Footer = React.forwardRef<HTMLDivElement>((_, ref) => (
  <footer
    ref={ref}
    className="sticky bottom-0 z-50 bg-background font-mono flex justify-center items-center shadow gap-3 p-5 border-t border-neutral-900 "
  >
    <Link
      to="/Pricing"
      className="text-base capitalize font-semibold text-neutral-300 hover:text-sky-800 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-sky-950/20"
    >
      Pricing
    </Link>
    <Link
      to="/About"
      className="text-base capitalize font-semibold text-neutral-300 hover:text-sky-800 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-sky-950/20"
    >
      about
    </Link>
    <Link
      to="/Terms"
      className="text-base capitalize font-semibold text-neutral-300 hover:text-sky-800 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-sky-950/20"
    >
      terms
    </Link>
  </footer>
))
