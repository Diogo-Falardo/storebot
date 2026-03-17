import { useRef } from 'react'

import { Construction, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function UnderConstruction() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col p-10 gap-55 items-center justify-center overflow-hidden bg-linear-to-b from-neutral-900 to-neutral-950 "
    >
      <div className="w-full h-full flex flex-col justify-center items-center gap-5">
        <div className="drop-shadow-2xl">
          <Store />
        </div>
        <h1 className="font-bold text-5xl">Store Bot</h1>

        <p className="w-full text-center font-semibold text-neutral-200">
          Store Bot allows you to create and manage your digital store directly
          inside Telegram.
        </p>

        <Button
          className="px-10 py-6 text-xl"
          onClick={() => {
            setTimeout(() => {
              window.open('https://t.me/usestorebot', '_blank')
            }, 200)
          }}
          asChild
        >
          <button>Open Store Bot</button>
        </Button>
      </div>

      <div className="w-full text-center text-xl flex flex-col justify-center items-center gap-2 animate-pulse">
        <div>
          <Construction className="" />
        </div>
        <p>Website currently under construction.</p>
      </div>
    </div>
  )
}
