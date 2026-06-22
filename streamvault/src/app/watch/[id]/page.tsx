import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getStreamUrl } from "@/lib/api/videos";
import { HLSPlayer } from "@/components/watch/HLSPlayer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";

interface WatchPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: WatchPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const { title } = await getStreamUrl(id);
    return {
      title: title || `Video ${id}`,
      description: `Watch "${title}" on StreamVault`,
    };
  } catch {
    return { title: "Watch Video" };
  }
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { id } = await params;

  if (!id || isNaN(Number(id))) {
    notFound();
  }

  let title = "";
  let streamingUrl = "";
  let fetchError = "";

  try {
    const data = await getStreamUrl(id);
    title = data.title;
    streamingUrl = data.streamingUrl;
  } catch (err) {
    fetchError =
      err instanceof Error ? err.message : "Failed to load video stream.";
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 gap-1.5 -ml-1"
        nativeButton={false}
        render={<Link href="/videos" />}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Videos
      </Button>

      {fetchError ? (
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Unable to load video</AlertTitle>
            <AlertDescription>{fetchError}</AlertDescription>
          </Alert>
          <p className="text-sm text-muted-foreground">
            The video may still be processing or the ID may be invalid. Please
            try again in a few minutes.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          <HLSPlayer src={streamingUrl} title={title} />
        </div>
      )}
    </div>
  );
}
