import { Link } from '@tanstack/react-router'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog'
import { buttonVariants } from './ui/button'

type ErrorWrapperProps = {
  errorTitle?: string
  errorDescription?: string
}

const ErrorWrapper = ({
  errorTitle = 'Oh no! Something went wrong.',
  errorDescription = "We couldn't detect what actually went wrong here!",
}: ErrorWrapperProps) => {
  return (
    <AlertDialog open={true}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>{errorTitle}</AlertDialogTitle>
          <AlertDialogDescription>{errorDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => window.location.reload()}
            className={buttonVariants({ variant: 'secondary' })}
          >
            Try to reload
          </AlertDialogAction>
          <AlertDialogAction asChild>
            <Link to="/">Go Home</Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ErrorWrapper
