// ============================================================
// Shared TypeScript Types for StreamVault
// ============================================================

// -----------------------------------------------------------
// Video types
// -----------------------------------------------------------

export type VideoStatus =
  | "PENDING"
  | "PROCESSING"
  | "READY"
  | "FAILED"
  | "UPLOADED";

export interface Video {
  id: number;
  title: string;
  description: string;
  status: VideoStatus;
  uploadedAt: string;
  email: string;
}

export interface StreamResponse {
  title: string;
  streamingUrl: string;
}

// -----------------------------------------------------------
// Upload types
// -----------------------------------------------------------

export interface UploadUrlRequest {
  filename: string;
  contentType: string;
}

export interface UploadUrlResponse {
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

// -----------------------------------------------------------
// UI state types
// -----------------------------------------------------------

export type UploadStep =
  | "idle"
  | "getting-url"
  | "uploading-s3"
  | "completing"
  | "success"
  | "error";

export interface UploadState {
  step: UploadStep;
  progress: number; // 0-100
  errorMessage?: string;
  result?: CompleteUploadResponse;
}
