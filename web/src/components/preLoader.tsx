import { Spinner } from './ui/spinner'

const PreLoader = () => {
  return (
    <div className="min-h-screen flex justify-center items center gap-2 text-neutral-500 text-mono text-sm">
      <Spinner /> storebot.cc
    </div>
  )
}

export default PreLoader
