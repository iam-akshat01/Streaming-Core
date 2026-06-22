import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Play, Clock } from "lucide-react";
import type { Video } from "@/types";
import { cn, formatDate, getStatusLabel, getStatusVariant } from "@/lib/utils";

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const isReady = video.status === "READY";

  return (
    <Card className="card-hover flex flex-col overflow-hidden border-border/60 bg-card">
      {/* Thumbnail placeholder */}
      <div className="relative h-36 bg-gradient-to-br from-accent/20 to-primary/10 flex items-center justify-center">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full transition-transform",
            isReady
              ? "bg-primary/20 ring-2 ring-primary/30"
              : "bg-muted/30 ring-2 ring-border"
          )}
        >
          {isReady ? (
            <Play className="h-5 w-5 fill-primary text-primary ml-0.5" />
          ) : (
            <Clock className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        {/* Status badge overlay */}
        <div className="absolute top-2 right-2">
          <Badge variant={getStatusVariant(video.status)} className="text-xs">
            {getStatusLabel(video.status)}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2 pt-4">
        <h3
          className="line-clamp-2 text-sm font-semibold leading-snug text-foreground"
          title={video.title}
        >
          {video.title}
        </h3>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        {video.description && (
          <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
            {video.description}
          </p>
        )}
        <p className="mt-2 text-xs text-muted-foreground">
          {formatDate(video.uploadedAt)}
        </p>
      </CardContent>

      <CardFooter className="pt-0">
        {isReady ? (
          <Button
            size="sm"
            className="w-full gap-1.5"
            nativeButton={false}
            render={<Link href={`/watch/${video.id}`} />}
          >
            <Play className="h-3.5 w-3.5" />
            Watch Video
          </Button>
        ) : (
          <Button size="sm" variant="secondary" className="w-full gap-1.5" disabled>
            <Clock className="h-3.5 w-3.5" />
            Not Ready
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
