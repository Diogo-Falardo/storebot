import { useRef } from 'react'
import { motion } from 'motion/react'
import { Construction, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function UnderConstruction() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      ref={containerRef}
      className="min-h-screen flex flex-col p-10 gap-55 items-center justify-center overflow-hidden bg-linear-to-b from-neutral-900 to-neutral-950 "
    >
      <div className="w-full h-full flex flex-col justify-center items-center gap-5">
        <motion.div
          className="drop-shadow-2xl"
          transition={{ type: 'spring' }}
          animate={{ scale: 2 }}
        >
          <Store />
        </motion.div>
        <motion.h1
          className="font-bold text-5xl"
          animate={{ scale: 1.35, transition: { duration: 2 } }}
        >
          Store Bot
        </motion.h1>

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
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: -1, opacity: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            Open Store Bot
          </motion.button>
        </Button>
      </div>

      <div className="w-full text-center text-xl flex flex-col justify-center items-center gap-2 animate-pulse">
        <motion.div animate={{ scale: 1.2 }}>
          <Construction className="" />
        </motion.div>
        <p>Website currently under construction.</p>
      </div>
    </motion.div>
  )
}
