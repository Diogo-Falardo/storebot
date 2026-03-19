import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { createFileRoute } from '@tanstack/react-router'
import { publicData, useLayoutPublic } from '@/lib/data'

export const Route = createFileRoute('/(public)/About')({
  component: RouteComponent,
})

function RouteComponent() {
  const offset = useLayoutPublic((s) => s.offset)
  const aboutPage = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (aboutPage.current) {
      gsap.fromTo(
        aboutPage.current,
        {
          opacity: 0,
          y: 0,
        },
        {
          opacity: 1,
          y: 15,
          duration: 1,
          ease: 'power2.out',
        },
      )
    }
  }, [])

  return (
    <div
      ref={aboutPage}
      className="flex flex-col p-5 gap-10 w-full max-w-5xl "
      style={{ minHeight: `calc(100vh - ${offset}px)` }}
    >
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl font-mono tracking-tight font-semibold">
          {publicData.about.title}
        </h1>
        <p className="text-lg text-justify text-neutral-400">
          {publicData.about.description}
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <h2 className="text-lg tracking-wide font-medium text-neutral-200 mt-2 mb-2">
          {publicData.about.mainStory}
        </h2>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-base text-neutral-300">
            Barriers removed:
          </span>
          <ul className="list-disc ml-6 text-neutral-400">
            {publicData.about.barriers.map((barrier, i) => (
              <li key={i} className="mb-1">
                {barrier}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <span className="font-mono text-base text-neutral-300">
            Platform Highlights:
          </span>
          <ul className="list-disc ml-6 text-neutral-400">
            {publicData.about.highlights.map((highlight, i) => (
              <li key={i} className="mb-1">
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-base tracking-wide font-medium text-neutral-400">
        {publicData.about.securityNote}
      </p>
    </div>
  )
}
