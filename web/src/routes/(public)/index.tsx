import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { createFileRoute } from '@tanstack/react-router'
import { MoveDown } from 'lucide-react'
import { publicData, useLayoutPublic } from '@/lib/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const Route = createFileRoute('/(public)/')({
  component: RouteComponent,
})

gsap.registerPlugin(SplitText)

function RouteComponent() {
  const headerHeight = useLayoutPublic((s) => s.headerHeight)
  const footerHeight = useLayoutPublic((s) => s.footerHeight)
  const offset = headerHeight + footerHeight
  const indexTitle = useRef<HTMLHeadingElement>(null)
  const indexDescription = useRef<HTMLParagraphElement>(null)
  const reasonsDiv = useRef<HTMLDivElement>(null)
  const buttonsDiv = useRef<HTMLDivElement>(null)
  const section2 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()

    if (indexTitle.current) {
      const split = new SplitText(indexTitle.current, { type: 'chars' })
      tl.from(split.chars, {
        opacity: 0,
        y: 20,
        stagger: 0.05,
        duration: 0.05,
        ease: 'power2.out',
      })
    }

    tl.to({}, { duration: 0.2 })

    if (indexDescription.current) {
      const split = new SplitText(indexDescription.current, { type: 'chars' })
      tl.from(split.chars, {
        opacity: 0,
        y: 10,
        stagger: 0.035,
        duration: 0.05,
        ease: 'power2.out',
      })
    }

    tl.to({}, { duration: 0.1 })

    if (reasonsDiv.current) {
      tl.from(reasonsDiv.current, {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: 'power3.out',
      })
    }

    if (buttonsDiv.current) {
      tl.fromTo(
        buttonsDiv.current,
        { opacity: 0, y: 5 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'back.out',
        },
      )
    }

    if (section2.current) {
      tl.fromTo(
        section2.current,
        { opacity: 0, y: 5 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'back.out',
        },
      )
    }
  }, [])

  const handleMoreInfoClick = () => {
    if (section2.current) {
      section2.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <div className="flex flex-col z-0">
      <section
        className="flex flex-col p-5 gap-10"
        style={{ minHeight: `calc(100vh - ${offset}px)` }}
      >
        <div className="flex flex-col gap-3">
          <h1
            ref={indexTitle}
            className="text-3xl font-mono tracking-tight font-semibold"
          >
            {publicData.indexTitle}
          </h1>
          <p
            ref={indexDescription}
            className="text-lg text-justify text-neutral-400"
          >
            {publicData.indexTitleDescription}
          </p>
        </div>
        <Accordion
          ref={reasonsDiv}
          type="single"
          collapsible
          defaultValue={publicData.reasons[1].title}
        >
          {publicData.reasons.map((r) => {
            return (
              <AccordionItem key={r.title} value={r.title}>
                <AccordionTrigger className="text-neutral-50 font-bold">
                  {r.title}
                </AccordionTrigger>
                <AccordionContent className="text-neutral-400">
                  {r.description}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>

        <div
          ref={buttonsDiv}
          className="flex mt-auto justify-between gap-4 items-center"
        >
          <Button
            onClick={() => {
              setTimeout(() => {
                window.open('https://t.me/usestorebot', '_blank')
              }, 200)
            }}
            className="flex items-center font-semibold text-shadow-sm text-sky-200"
            size={'sm'}
          >
            <img src="/icons/telegram.svg" alt="Telegram" className="w-5 h-5" />
            Open Store Bot
          </Button>
          <Button
            onClick={handleMoreInfoClick}
            variant={'ghost'}
            className="flex items-center text-sm text-neutral-500 font-semibold tracking-tight"
          >
            <MoveDown /> More Info
          </Button>
        </div>
      </section>
      <section
        ref={section2}
        className="flex flex-col"
        style={{ minHeight: `calc(100vh - ${offset}px)` }}
      >
        <div className="flex-1 flex flex-col justify-center items-center gap-10">
          <Card className="max-w-xs w-full bg-background ring ring-sky-800 border border-sky-950 rounded-sm py-3 ">
            <CardContent>
              <CardHeader className="p-0">
                <p className="text-xs text-neutral-700 font-mono">version</p>
              </CardHeader>
              <CardTitle className="flex justify-between items-center text-neutral-300 capitalize">
                {publicData.botInfo.versionName}
                <span className="text-sky-800 text-shadow-2xs text-sm font-black font-mono lowercase">
                  {publicData.botInfo.version}
                </span>
              </CardTitle>
            </CardContent>
          </Card>
          <Tabs defaultValue="vf" className="max-w-xs w-full">
            <TabsList variant={'line'} className="font-mono">
              <TabsTrigger className="after:bg-sky-950" value="vf">
                Version Features
              </TabsTrigger>
              <TabsTrigger className="after:bg-sky-950" value="vl">
                Version Logs
              </TabsTrigger>
            </TabsList>
            <TabsContent value="vf" className="mt-3">
              <Card className="w-full max-w-xs bg-background ring ring-sky-800 border border-sky-950 rounded-sm">
                <CardHeader>
                  <p className="text-xl font-mono text-sky-800">
                    {publicData.botInfo.versionLog.at(-1)?.version ?? ''}
                  </p>
                  <CardTitle className="capitalize">
                    {publicData.botInfo.versionLog.at(-1)?.versionName ?? ''}
                  </CardTitle>
                </CardHeader>
                <CardContent className="mt-3 text-neutral-400 text-sm flex flex-col gap-1">
                  <p className="text-xs text-neutral-700 font-mono">
                    features added
                  </p>
                  <div className="mt-auto">
                    {publicData.botInfo.versionLog
                      .at(-1)
                      ?.versionFeatures.map((f) => (
                        <p>{f}</p>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="vl" className="mt-3">
              <Card className="w-full max-w-xs bg-background ring ring-sky-800 border border-sky-950 rounded-sm">
                <CardContent>
                  <div className="mt-auto">
                    {publicData.botInfo.versionLog.map((v) => (
                      <div className="flex justify-between items-center">
                        <p className="text-neutral-300 text-sm capitalize font-semibold">
                          {v.versionName}
                        </p>

                        <p className="text-neutral-700 text-xs font-mono">
                          {v.version}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
