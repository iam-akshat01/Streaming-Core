import Link from 'next/link';
import { PlayCircle, Upload, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-white">
              Stream Your{' '}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Videos
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Upload, manage, and share your videos with beautiful HLS streaming technology
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/upload"
                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Upload Video
              </Link>
              <Link
                href="/my-videos"
                className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors border border-gray-700 inline-flex items-center justify-center gap-2"
              >
                <PlayCircle className="w-5 h-5" />
                Browse Videos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            Why Choose StreamHub?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-red-600 transition-colors">
              <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Easy Upload</h3>
              <p className="text-gray-400">
                Drag and drop your videos or click to upload. Multiple format support with instant processing.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-red-600 transition-colors">
              <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center mb-4">
                <PlayCircle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">HLS Streaming</h3>
              <p className="text-gray-400">
                Professional-grade HLS video streaming with adaptive bitrate for smooth playback.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-red-600 transition-colors">
              <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-400">
                Optimized performance with responsive design that works on all devices and networks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-600/30 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-gray-300 mb-6">
            Join thousands of creators streaming their content with StreamHub
          </p>
          <Link
            href="/upload"
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Start Uploading Now
          </Link>
        </div>
      </section>
    </div>
  );
}
