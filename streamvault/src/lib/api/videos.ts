import type { Video, StreamResponse } from "@/types";
import apiClient from "./client";

/**
 * Get all videos on the platform
 */
export async function getAllVideos(): Promise<Video[]> {
  const { data } = await apiClient.get<Video[]>("/api/videos");
  return data;
}

/**
 * Get videos uploaded by a specific email address
 */
export async function getVideosByEmail(email: string): Promise<Video[]> {
  const encoded = encodeURIComponent(email);
  const { data } = await apiClient.get<Video[]>(`/api/videos/email/${encoded}`);
  return data;
}

/**
 * Get the HLS streaming URL for a given video ID
 */
export async function getStreamUrl(id: number | string): Promise<StreamResponse> {
  const { data } = await apiClient.get<StreamResponse>(
    `/api/videos/${id}/stream`
  );
  return data;
}
