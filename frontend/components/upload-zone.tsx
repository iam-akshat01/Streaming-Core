'use client';

import { useRef } from 'react';
import { Upload } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isDisabled?: boolean;
}

export function UploadZone({ onFileSelect, isDisabled }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        onFileSelect(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => !isDisabled && inputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all ${
        isDisabled
          ? 'border-gray-600 bg-gray-800/50 cursor-not-allowed'
          : 'border-gray-600 hover:border-red-500 hover:bg-gray-800/50 cursor-pointer'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        onChange={handleFileInput}
        disabled={isDisabled}
        className="hidden"
      />

      <div className="flex flex-col items-center gap-3">
        <div className={`rounded-full p-3 ${isDisabled ? 'bg-gray-700' : 'bg-red-900/20'}`}>
          <Upload className={`w-8 h-8 ${isDisabled ? 'text-gray-500' : 'text-red-500'}`} />
        </div>

        <div>
          <p className={`font-semibold ${isDisabled ? 'text-gray-400' : 'text-white'}`}>
            Drag and drop your video here
          </p>
          <p className="text-sm text-gray-400 mt-1">
            or click to select from your device
          </p>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Supported formats: MP4, WebM, MKV, etc.
        </p>
      </div>
    </div>
  );
}
