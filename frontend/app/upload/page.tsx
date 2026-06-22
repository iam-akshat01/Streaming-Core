'use client';

import { useState } from 'react';
import { UploadZone } from '@/components/upload-zone';
import { ProgressBar } from '@/components/progress-bar';
import { apiClient } from '@/lib/api-client';
import { CheckCircle, AlertCircle } from 'lucide-react';

type UploadStep = 'idle' | 'file-selected' | 'uploading' | 'processing' | 'success' | 'error';

export default function UploadPage() {
  const [step, setStep] = useState<UploadStep>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [uploadedBy, setUploadedBy] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setStep('file-selected');
    setError('');
  };

  const resetForm = () => {
    setFile(null);
    setTitle('');
    setDescription('');
    setEmail('');
    setUploadedBy('');
    setUploadProgress(0);
    setError('');
    setSuccessMessage('');
    setStep('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a video file');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!email.trim()) {
      setError('Please enter an email');
      return;
    }

    if (!uploadedBy.trim()) {
      setError('Please enter uploader name');
      return;
    }

    try {
      setStep('uploading');
      setError('');

      // Step 1: Generate upload URL
      const uploadUrlResponse = await apiClient.generateUploadUrl({
        filename: file.name,
        contentType: file.type,
      });

      // Step 2: Upload file to S3
      await apiClient.uploadFileToS3(
        uploadUrlResponse.uploadUrl,
        file,
        (progress) => {
          const percentage = Math.round(
            (progress.loaded / progress.total) * 100
          );
          setUploadProgress(percentage);
        }
      );

      // Step 3: Complete upload
      setStep('processing');
      const completeResponse = await apiClient.completeUpload({
        title: title.trim(),
        description: description.trim(),
        originalFilename: file.name,
        sourceS3Key: uploadUrlResponse.objectKey,
        uploadedBy: uploadedBy.trim(),
        email: email.trim(),
      });

      setStep('success');
      setSuccessMessage(
        `Video "${title}" uploaded successfully! Video ID: ${completeResponse.videoId}`
      );

      // Reset form after 2 seconds
      setTimeout(resetForm, 2000);
    } catch (err) {
      console.error('Upload error:', err);
      setStep('error');
      setError(
        err instanceof Error ? err.message : 'Failed to upload video. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Upload Your Video</h1>
          <p className="text-gray-400">
            Share your content with our HLS streaming platform
          </p>
        </div>

        {/* Success State */}
        {step === 'success' && (
          <div className="mb-8 p-6 bg-green-900/20 border border-green-600 rounded-lg flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-300">{successMessage}</p>
              <p className="text-sm text-green-200 mt-1">Redirecting...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && step === 'error' && (
          <div className="mb-8 p-6 bg-red-900/20 border border-red-600 rounded-lg flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">Upload Failed</p>
              <p className="text-sm text-red-200 mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Video File
              </label>
              <UploadZone
                onFileSelect={handleFileSelect}
                isDisabled={step !== 'idle' && step !== 'file-selected' && step !== 'error'}
              />
              {file && (
                <p className="text-sm text-gray-400 mt-2">
                  Selected: <span className="text-white font-medium">{file.name}</span> (
                  {(file.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Video Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video title"
                disabled={step !== 'idle' && step !== 'file-selected' && step !== 'error'}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter video description (optional)"
                rows={4}
                disabled={step !== 'idle' && step !== 'file-selected' && step !== 'error'}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={step !== 'idle' && step !== 'file-selected' && step !== 'error'}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Uploader Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                value={uploadedBy}
                onChange={(e) => setUploadedBy(e.target.value)}
                placeholder="Enter your name"
                disabled={step !== 'idle' && step !== 'file-selected' && step !== 'error'}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Progress Bar */}
            {(step === 'uploading' || step === 'processing') && (
              <ProgressBar
                percentage={uploadProgress}
                label={
                  step === 'uploading'
                    ? 'Uploading to cloud...'
                    : 'Processing video...'
                }
              />
            )}

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={step !== 'idle' && step !== 'file-selected' && step !== 'error'}
                className="flex-1 px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                {step === 'idle' || step === 'error' ? 'Upload Video' : 'Uploading...'}
              </button>

              {step !== 'idle' && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
