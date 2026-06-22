'use client';

import { useState, useEffect } from 'react';
import { VideoCard } from '@/components/video-card';
import { apiClient } from '@/lib/api-client';
import { Video } from '@/lib/types';
import { Search, AlertCircle } from 'lucide-react';

export default function MyVideosPage() {
  const [email, setEmail] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const result = await apiClient.getVideosByEmail(email.trim());
      setVideos(result);
      setSearched(true);
    } catch (err) {
      console.error('Search error:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to fetch videos. Please try again.'
      );
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">My Videos</h1>
          <p className="text-gray-400">
            Search for your videos by email address
          </p>
        </div>

        {/* Search Form */}
        <div className="mb-12 max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-600 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">Error</p>
              <p className="text-sm text-red-200 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-red-600 border-t-transparent"></div>
              <p className="text-gray-400">Searching videos...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {searched && !loading && videos.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-4">
              <Search className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-lg font-semibold text-gray-300 mb-1">No videos found</p>
            <p className="text-gray-500">
              Try searching with a different email address
            </p>
          </div>
        )}

        {/* Videos Grid */}
        {videos.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">
                Found {videos.length} video{videos.length !== 1 ? 's' : ''}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
