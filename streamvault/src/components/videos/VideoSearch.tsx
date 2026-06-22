"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { VideoCard } from "./VideoCard";
import { VideoCardSkeleton } from "./VideoCardSkeleton";
import { getVideosByEmail } from "@/lib/api/videos";
import type { Video } from "@/types";
import { Search, XCircle, VideoOff, Loader2 } from "lucide-react";

type State = "idle" | "loading" | "loaded" | "error";

export function VideoSearch() {
  const [email, setEmail] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [searchedEmail, setSearchedEmail] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^\S+@\S+\.\S+$/.test(trimmed)) {
      setErrorMsg("Please enter a valid email address.");
      setState("error");
      return;
    }

    setState("loading");
    setErrorMsg("");
    setSearchedEmail(trimmed);

    try {
      const data = await getVideosByEmail(trimmed);
      setVideos(data);
      setState("loaded");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch videos.";
      setErrorMsg(message);
      setState("error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Search form */}
      <form
        onSubmit={handleSearch}
        className="rounded-xl border border-border bg-card p-5"
      >
        <Label htmlFor="email-search" className="mb-2 block text-sm font-medium">
          Email Address
        </Label>
        <div className="flex gap-3">
          <Input
            id="email-search"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1"
            disabled={state === "loading"}
          />
          <Button type="submit" disabled={state === "loading"} className="gap-2 shrink-0">
            {state === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Search
          </Button>
        </div>
      </form>

      {/* Error */}
      {state === "error" && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}

      {/* Loading skeletons */}
      {state === "loading" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Results */}
      {state === "loaded" && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {videos.length === 0
                ? "No results"
                : `${videos.length} video${videos.length !== 1 ? "s" : ""} for`}{" "}
              <span className="font-medium text-foreground">{searchedEmail}</span>
            </p>
          </div>

          {videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
              <VideoOff className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm font-medium text-muted-foreground">
                No videos found for this email
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Upload your first video to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
