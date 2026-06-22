/**
 * API Response Types
 */

export interface GenerateUploadUrlRequest {
  filename: string;
  contentType: string;
}

export interface GenerateUploadUrlResponse {
  uploadUrl: string;
  objectKey: string;
}

export interface CompleteUploadRequest {
  title: string;
  description: string;
  originalFilename: string;
  sourceS3Key: string;
  uploadedBy: string;
  email: string;
}

export interface CompleteUploadResponse {
  videoId: number;
  email: string;
  message: string;
}

export interface Video {
  id: number;
  title: string;
  description: string;
  uploadDate: string;
  processingStatus: string;
  uploadedBy: string;
  email: string;
  streamingUrl?: string;
  originalFilename: string;
  sourceS3Key: string;
}

export interface GetStreamUrlResponse {
  title: string;
  streamingUrl: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
