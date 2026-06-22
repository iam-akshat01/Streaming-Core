"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface HLSPlayerProps {
  src: string;
  title: string;
}

type PlayerState = "loading" | "ready" | "error";

export function HLSPlayer({ src, title }: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    const handleError = (message: string) => {
      setPlayerState("error");
      setErrorMessage(message);
    };

    // Cleanup previous instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90,
      });

      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setPlayerState("ready");
        // Don't autoplay — let the user initiate
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // Try to recover
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              handleError(
                `Fatal streaming error: ${data.details || "Unknown error"}`
              );
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari native HLS support
      video.src = src;
      video.addEventListener("loadedmetadata", () => setPlayerState("ready"), {
        once: true,
      });
      video.addEventListener(
        "error",
        () => handleError("Failed to load video stream."),
        { once: true }
      );
    } else {
      handleError(
        "Your browser does not support HLS streaming. Please use Chrome, Firefox, or Safari."
      );
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src]);

  return (
    <div className="space-y-4">
      {/* Player wrapper */}
      <div className="video-container relative aspect-video w-full shadow-2xl shadow-black/50">
        {/* Loading overlay */}
        {playerState === "loading" && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 rounded-lg">
            <div className="flex flex-col items-center gap-3 text-white">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-white/70">Loading stream…</p>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          controls
          aria-label={title}
          preload="metadata"
          className="h-full w-full rounded-lg bg-black"
          style={{ display: playerState === "error" ? "none" : "block" }}
        />
      </div>

      {/* Error state */}
      {playerState === "error" && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Playback Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
