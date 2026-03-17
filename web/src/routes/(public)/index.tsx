import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

export const Route = createFileRoute('/(public)/')({
  component: RouteComponent,
})

gsap.registerPlugin(SplitText)

function RouteComponent() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const paragraphRefs = useRef<Array<HTMLParagraphElement | null>>([])

  useEffect(() => {
    if (headingRef.current) {
      const split = new SplitText(headingRef.current, { type: 'chars' })
      gsap.from(split.chars, {
        opacity: 0,
        y: 40,
        stagger: 0.05,
        duration: 0.8,
        ease: 'power2.out',
      })
    }
    paragraphRefs.current.forEach((el) => {
      if (el) {
        const split = new SplitText(el, { type: 'words' })
        gsap.from(split.words, {
          opacity: 0,
          y: 20,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power2.out',
        })
      }
    })
  }, [])

  // Helper to assign refs
  const setParagraphRef = (el: HTMLParagraphElement | null, idx: number) => {
    paragraphRefs.current[idx] = el
  }

  return (
    <div className="flex flex-col gap-6 md:gap-10 max-w-4xl mx-auto px-4 py-12 md:py-20 text-center md:text-left">
      <div className="space-y-4">
        <h1
          ref={headingRef}
          className="text-neutral-50 text-4xl md:text-5xl font-bold tracking-tight font-sans"
        >
          Why Store Bot?
        </h1>
        <p
          ref={(el) => setParagraphRef(el, 0)}
          className="text-neutral-300 text-xl md:text-2xl font-sans leading-relaxed"
        >
          Sell digital products the effortless way — entirely inside Telegram.
        </p>
      </div>

      <div className="space-y-8 text-neutral-400 text-lg font-sans leading-relaxed">
        <p ref={(el) => setParagraphRef(el, 1)}>
          Your store lives 100% inside Telegram — no external website, no
          hosting, no domains needed. Customers access and buy directly in
          private chats or shared links.
        </p>

        <ul className="space-y-6 list-none text-left md:text-left">
          <li className="flex items-start gap-4">
            <span className="text-cyan-400 text-2xl font-bold">•</span>
            <div>
              <strong className="text-neutral-200">Private by default</strong>
              <br />
              <p ref={(el) => setParagraphRef(el, 2)}>
                You decide who sees your store. Share privately with specific
                people or groups — only those you allow get access. Perfect for
                exclusive offers, memberships, or controlled sales.
              </p>
            </div>
          </li>

          <li className="flex items-start gap-4">
            <span className="text-cyan-400 text-2xl font-bold">•</span>
            <div>
              <strong className="text-neutral-200">
                No fees from us — 100% yours
              </strong>
              <br />
              <p ref={(el) => setParagraphRef(el, 3)}>
                StoreBot takes zero commission, zero platform cut, zero
                transaction fees. Every cent (or crypto equivalent) from your
                sales goes straight to you.
              </p>
            </div>
          </li>

          <li className="flex items-start gap-4">
            <span className="text-cyan-400 text-2xl font-bold">•</span>
            <div>
              <strong className="text-neutral-200">
                Your rules, your methods
              </strong>
              <br />
              <p ref={(el) => setParagraphRef(el, 4)}>
                Full freedom: choose whatever payment method works for you
                (crypto wallets, bank transfers, cash apps, etc.). Handle
                delivery your way — instant file links, access codes, or manual
                for digital goods. No forced integrations.
              </p>
            </div>
          </li>

          <li className="flex items-start gap-4">
            <span className="text-cyan-400 text-2xl font-bold">•</span>
            <div>
              <strong className="text-neutral-200">
                Maximum customization
              </strong>
              <br />
              <p ref={(el) => setParagraphRef(el, 5)}>
                Make your shop truly yours. Customize products, descriptions,
                images, buttons, layout, messages — as much as possible within
                Telegram's native interface. No rigid templates holding you
                back.
              </p>
            </div>
          </li>
        </ul>

        <p
          ref={(el) => setParagraphRef(el, 6)}
          className="text-neutral-300 text-xl font-sans mt-10"
        >
          Built for creators, sellers, and makers who want simple, private,
          fee-free digital selling — right where your audience already is.
        </p>
      </div>

      {/* Optional small CTA */}
      <div className="mt-8">
        <Link
          to="/HowToUse"
          className="inline-block px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition text-lg"
        >
          See How to Get Started →
        </Link>
      </div>
    </div>
  )
}
