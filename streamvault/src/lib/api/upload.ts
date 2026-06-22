import type {
  UploadUrlRequest,
  UploadUrlResponse,
  CompleteUploadRequest,
  CompleteUploadResponse,
} from "@/types";
import apiClient from "./client";

/**
 * Step 1 of upload flow: get a pre-signed S3 upload URL
 */
export async function generateUploadUrl(
  payload: UploadUrlRequest
): Promise<UploadUrlResponse> {
  const { data } = await apiClient.post<UploadUrlResponse>(
    "/api/upload/url",
    payload
  );
  return data;
}

/**
 * Step 2 of upload flow: PUT the file directly to S3.
 * Uses XMLHttpRequest so we get progress events.
 */
export function uploadToS3(
  uploadUrl: string,
  file: File,
  onProgress: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      // S3 returns 200 on success
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(
          new Error(`S3 upload failed with status ${xhr.status}: ${xhr.responseText}`)
        );
      }
    });

    xhr.addEventListener("error", () =>
      reject(new Error("Network error during S3 upload"))
    );
    xhr.addEventListener("abort", () =>
      reject(new Error("S3 upload was aborted"))
    );

    xhr.send(file);
  });
}

/**
 * Step 3 of upload flow: notify the backend that upload is complete
 */
export async function completeUpload(
  payload: CompleteUploadRequest
): Promise<CompleteUploadResponse> {
  const { data } = await apiClient.post<CompleteUploadResponse>(
    "/api/upload/complete",
    payload
  );
  return data;
}
