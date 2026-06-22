'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clapperboard } from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-red-600 p-2 rounded group-hover:bg-red-700 transition-colors">
              <Clapperboard className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white hidden sm:inline">
              StreamHub
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className={`px-3 sm:px-4 py-2 rounded transition-colors text-sm font-medium ${
                isActive('/')
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-900'
              }`}
            >
              Home
            </Link>

            <Link
              href="/upload"
              className={`px-3 sm:px-4 py-2 rounded transition-colors text-sm font-medium ${
                isActive('/upload')
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-900'
              }`}
            >
              Upload
            </Link>

            <Link
              href="/my-videos"
              className={`px-3 sm:px-4 py-2 rounded transition-colors text-sm font-medium ${
                isActive('/my-videos')
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-900'
              }`}
            >
              My Videos
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
