import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { createFileRoute } from '@tanstack/react-router'
import { publicData, useLayoutPublic } from '@/lib/data'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/(public)/(pages)/how-to-use')({
  component: RouteComponent,
})

gsap.registerPlugin(SplitText)

function RouteComponent() {
  const headerHeight = useLayoutPublic((s) => s.headerHeight)
  const footerHeight = useLayoutPublic((s) => s.footerHeight)
  const offset = headerHeight + footerHeight
  const howtToUseTitle = useRef<HTMLHeadingElement>(null)
  const howToUseDescription = useRef<HTMLParagraphElement>(null)
  const commands = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    const tl = gsap.timeline()
    if (howtToUseTitle.current) {
      const split = new SplitText(howtToUseTitle.current, { type: 'chars' })
      tl.from(split.chars, {
        opacity: 0,
        y: 20,
        stagger: 0.05,
        duration: 0.05,
        ease: 'power2.out',
      })
    }

    tl.to({}, { duration: 0.2 })

    if (howToUseDescription.current) {
      const split = new SplitText(howToUseDescription.current, {
        type: 'chars',
      })
      tl.from(split.chars, {
        opacity: 0,
        y: 20,
        stagger: 0.05,
        duration: 0.05,
        ease: 'power2.out',
      })
    }

    if (commands.current.length > 0) {
      tl.fromTo(
        commands.current.filter(Boolean),
        {
          opacity: 0,
          y: 20,
          stagger: 2,
          boxShadow: '0 0 5px 10px #0c4a6e, 0 0 15px 10px #082f49',
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.5,
          duration: 0.5,
          boxShadow: '0 0 1px 1px #0c4a6e, 0 0 1px 1px #082f49',
        },
      )
    }
  }, [])

  return (
    <div
      className="flex flex-col p-5 gap-5 w-full max-w-5xl "
      style={{ minHeight: `calc(100vh - ${offset}px)` }}
    >
      <div className="w-full flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h1
            ref={howtToUseTitle}
            className="text-3xl font-mono tracking-tight font-semibold"
          >
            {publicData.howToUse.title}
          </h1>
        </div>
        <p
          ref={howToUseDescription}
          className="text-lg text-justify text-neutral-400"
        >
          {publicData.howToUse.description}
        </p>
      </div>
      <div className="w-full p-1 h-full flex-1 flex flex-col gap-5">
        {publicData.howToUse.steps.map((command, i) => {
          return (
            <Card
              ref={(el) => {
                commands.current[i] = el
              }}
              key={command.command}
              className="w-full p-2 gap-0 bg-background ring ring-sky-800 border border-sky-950 rounded-sm"
            >
              <CardHeader className="p-1">
                <CardTitle>{command.command}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{command.text}</CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
