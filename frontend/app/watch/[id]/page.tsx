'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { HLSPlayer } from '@/components/hls-player';
import { apiClient } from '@/lib/api-client';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function WatchPage() {
  const params = useParams();
  const id = params.id as string;
  const [title, setTitle] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStreamUrl = async () => {
      try {
        setLoading(true);
        setError('');

        const videoId = parseInt(id, 10);
        if (isNaN(videoId)) {
          setError('Invalid video ID');
          setLoading(false);
          return;
        }

        const response = await apiClient.getStreamUrl(videoId);
        setTitle(response.title);
        setStreamUrl(response.streamingUrl);
      } catch (err) {
        console.error('Fetch stream error:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load video. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStreamUrl();
  }, [id]);

  return (
    <div className="min-h-screen bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          href="/my-videos"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to videos
        </Link>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-600 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">Error Loading Video</p>
              <p className="text-sm text-red-200 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-8">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-red-600 border-t-transparent"></div>
              <p className="text-gray-400">Loading video...</p>
            </div>
          </div>
        )}

        {/* Player */}
        {!loading && streamUrl && (
          <>
            <div className="mb-8">
              <HLSPlayer streamUrl={streamUrl} title={title} />
            </div>

            {/* Video Info */}
            <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-6">
              <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Video ID</p>
                  <p className="text-lg font-semibold text-white">{id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <p className="text-lg font-semibold text-green-400">Playing</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Format</p>
                  <p className="text-lg font-semibold text-white">HLS</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Quality</p>
                  <p className="text-lg font-semibold text-white">Adaptive</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
