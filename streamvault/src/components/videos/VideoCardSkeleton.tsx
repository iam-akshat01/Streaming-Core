import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function VideoCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden border-border/60 bg-card">
      <Skeleton className="h-36 w-full rounded-none" />
      <CardHeader className="pb-2 pt-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-1" />
      </CardHeader>
      <CardContent className="flex-1 pb-3">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3 mt-1.5" />
        <Skeleton className="h-3 w-24 mt-3" />
      </CardContent>
      <CardFooter className="pt-0">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}
