'use client';

import { useEffect, useRef, useState } from 'react';
import HLS from 'hls.js';

interface HLSPlayerProps {
  streamUrl: string;
  title: string;
}

export function HLSPlayer({ streamUrl, title }: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset states
    setIsLoading(true);
    setError(null);

    // Check if HLS is supported
    if (HLS.isSupported()) {
      const hls = new HLS({
        autoStartLoad: true,
        enableWorker: true,
        defaultAudioCodec: 'mp4a.40.2',
      });

      hls.on(HLS.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
      });

      hls.on(HLS.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
        if (data.fatal) {
          switch (data.type) {
            case HLS.ErrorTypes.NETWORK_ERROR:
              setError('Network error loading stream. Please try again.');
              break;
            case HLS.ErrorTypes.MEDIA_ERROR:
              setError('Media error. The video cannot be played.');
              break;
            default:
              setError('Error loading video. Please try again.');
          }
        }
      });

      try {
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } catch (err) {
        console.error('Error initializing HLS:', err);
        setError('Error initializing video player.');
      }

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Fallback for Safari
      video.src = streamUrl;
      setIsLoading(false);
    } else {
      setError('Your browser does not support HLS streaming.');
    }
  }, [streamUrl]);

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden">
      <div className="relative w-full bg-black aspect-video">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-red-600 border-t-transparent"></div>
              <p className="text-sm text-gray-400">Loading video...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center">
              <p className="text-red-500 font-semibold mb-2">Playback Error</p>
              <p className="text-gray-400 text-sm">{error}</p>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          className="w-full h-full"
          controls
          playsInline
          title={title}
        />
      </div>
    </div>
  );
}
