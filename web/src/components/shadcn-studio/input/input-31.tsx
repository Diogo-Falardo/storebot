import { useId } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type InputEndInlineButtonDemoProps = React.ComponentProps<typeof Input> & {
  icon?: React.ReactNode
}

const InputEndInlineButtonDemo = (props: InputEndInlineButtonDemoProps) => {
  const { icon } = props
  const id = props.id ?? useId()

  return (
    <div className="w-full max-w-xs space-y-2">
      <div className="relative">
        <Input id={id} {...props} className={`pr-9 ${props.className ?? ''}`} />
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
        >
          {icon}
        </Button>
      </div>
    </div>
  )
}

export default InputEndInlineButtonDemo
