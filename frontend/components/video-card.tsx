'use client';

import Link from 'next/link';
import { Video } from '@/lib/types';
import { Play } from 'lucide-react';

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const uploadDate = new Date(video.uploadDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const statusColors: Record<string, string> = {
    completed: 'bg-green-900 text-green-200',
    processing: 'bg-blue-900 text-blue-200',
    failed: 'bg-red-900 text-red-200',
  };

  const statusColor = statusColors[video.processingStatus] || 'bg-gray-900 text-gray-200';

  return (
    <Link href={`/watch/${video.id}`}>
      <div className="group cursor-pointer">
        <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video mb-3 flex items-center justify-center hover:bg-gray-700 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play className="w-12 h-12 text-white fill-white" />
          </div>
          <div className="text-gray-500 text-sm">Video Thumbnail</div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-white line-clamp-2 group-hover:text-red-500 transition-colors">
            {video.title}
          </h3>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{uploadDate}</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor}`}>
              {video.processingStatus === 'completed' ? 'Ready' : 'Processing'}
            </span>
          </div>

          <p className="text-xs text-gray-500 line-clamp-1">
            {video.uploadedBy}
          </p>
        </div>
      </div>
    </Link>
  );
}
