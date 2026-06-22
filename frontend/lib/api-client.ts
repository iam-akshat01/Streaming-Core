import axios, { AxiosInstance, AxiosProgressEvent } from 'axios';
import {
  GenerateUploadUrlRequest,
  GenerateUploadUrlResponse,
  CompleteUploadRequest,
  CompleteUploadResponse,
  Video,
  GetStreamUrlResponse,
} from './types';

const API_BASE_URL = 'http://localhost:8080';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Upload APIs
  async generateUploadUrl(
    request: GenerateUploadUrlRequest
  ): Promise<GenerateUploadUrlResponse> {
    const response = await this.client.post('/api/upload/url', request);
    return response.data;
  }

  async uploadFileToS3(
    uploadUrl: string,
    file: File,
    onProgress?: (progress: AxiosProgressEvent) => void
  ): Promise<void> {
    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      onUploadProgress: onProgress,
    });
  }

  async completeUpload(
    request: CompleteUploadRequest
  ): Promise<CompleteUploadResponse> {
    const response = await this.client.post('/api/upload/complete', request);
    return response.data;
  }

  // Video APIs
  async getAllVideos(): Promise<Video[]> {
    const response = await this.client.get('/api/videos');
    return response.data;
  }

  async getVideosByEmail(email: string): Promise<Video[]> {
    const response = await this.client.get(`/api/videos/email/${email}`);
    return response.data;
  }

  async getStreamUrl(videoId: number): Promise<GetStreamUrlResponse> {
    const response = await this.client.get(`/api/videos/${videoId}/stream`);
    return response.data;
  }
}

export const apiClient = new APIClient();
