import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { createFileRoute } from '@tanstack/react-router'
import { publicData, useLayoutPublic } from '@/lib/data'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/(public)/(pages)/pricing')({
  component: RouteComponent,
})

function RouteComponent() {
  const offset = useLayoutPublic((s) => s.offset)
  const page = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (page.current) {
      gsap.fromTo(
        page.current,
        {
          opacity: 0,
          y: 0,
          duration: 2.5,
          ease: 'power1.inOut',
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
      ref={page}
      className="flex flex-col p-5 gap-10 w-full max-w-5xl "
      style={{ minHeight: `calc(100vh - ${offset}px)` }}
    >
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl font-mono tracking-tight font-semibold">
          {publicData.pricing.title}
        </h1>
        <p className="text-lg text-justify text-neutral-400">
          {publicData.pricing.description}
        </p>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          {publicData.pricing.plans.map((plan) => (
            <div
              key={plan.period}
              className="flex items-center justify-between border-b border-neutral-700 py-2"
            >
              <span className="font-mono text-lg">{plan.period}</span>
              <span className=" text-base">{plan.price}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-justify text-neutral-500 mt-4">
          Store activation payments are processed securely via Stripe. Stripe
          ensures your purchase is safe and protected.
        </p>
        <Button className="mt-2 cursor-pointer">Buy Store Activation</Button>
      </div>
    </div>
  )
}
