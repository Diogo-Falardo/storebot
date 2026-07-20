import { Skeleton } from "#/components/ui/skeleton"
import { Separator } from "#/components/ui/separator"
import { Card } from "#/components/ui/card"

export function LobbySkeleton() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <div className="flex h-14 items-center justify-center border-b border-border/60 bg-card px-3">
        <Skeleton className="h-4 w-36" />
      </div>
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-3 py-6">
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-card px-4 py-6">
          <Skeleton className="size-20 rounded-full" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-28" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="ml-3 h-3 w-14" />
          <Card className="gap-0 overflow-hidden py-0">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Skeleton className="size-10 rounded-xl" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Skeleton className="size-10 rounded-xl" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
