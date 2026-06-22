import type { Metadata } from "next";
import { VideoSearch } from "@/components/videos/VideoSearch";
import { Video } from "lucide-react";

export const metadata: Metadata = {
  title: "My Videos",
  description:
    "View all videos you have uploaded to StreamVault. Search by your email address to see your library.",
};

export default function VideosPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
          <Video className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          My Videos
        </h1>
        <p className="mt-2 text-muted-foreground">
          Enter the email address you used to upload videos to see your library.
        </p>
      </div>

      <VideoSearch />
    </div>
  );
}
