import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { createFileRoute } from '@tanstack/react-router'
import { publicData, useLayoutPublic } from '@/lib/data'

export const Route = createFileRoute('/(public)/(pages)/terms')({
  component: RouteComponent,
})

function RouteComponent() {
  const offset = useLayoutPublic((s) => s.offset)
  const page = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (page.current) {
      gsap.fromTo(
        page.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
      )
    }
  }, [])

  return (
    <div
      ref={page}
      className="flex flex-col p-5 gap-10 w-full max-w-5xl "
      style={{ minHeight: `calc(100vh - ${offset}px)` }}
    >
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl font-mono tracking-tight font-semibold">
          {publicData.terms.title}
        </h1>
        <p className="text-lg text-justify text-neutral-400">
          {publicData.terms.description}
        </p>
      </div>

      <ul className="flex flex-col gap-3 font-bold tracking-wide text-neutral-300">
        {publicData.terms.points.map((p) => (
          <li key={p} className="mb-1">
            {p}
          </li>
        ))}
      </ul>
    </div>
  )
}
