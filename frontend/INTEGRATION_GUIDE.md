# StreamHub Integration Guide

This document explains how to integrate StreamHub with your backend API and S3 storage.

## 🔌 API Integration

### 1. Backend API Setup

The frontend connects to your backend at `http://localhost:8080` (configurable).

#### Required Endpoints

All endpoints must be implemented in your backend:

```
POST /api/upload/url
POST /api/upload/complete
GET /api/videos
GET /api/videos/email/{email}
GET /api/videos/{id}/stream
```

#### Request/Response Examples

**Generate Upload URL**
```bash
curl -X POST http://localhost:8080/api/upload/url \
  -H "Content-Type: application/json" \
  -d '{"filename": "video.mp4", "contentType": "video/mp4"}'

# Response:
{
  "uploadUrl": "https://s3-signed-url...",
  "objectKey": "uploads/abc123.mp4"
}
```

**Complete Upload**
```bash
curl -X POST http://localhost:8080/api/upload/complete \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Video",
    "description": "A great video",
    "originalFilename": "video.mp4",
    "sourceS3Key": "uploads/abc123.mp4",
    "uploadedBy": "John Doe",
    "email": "john@example.com"
  }'

# Response:
{
  "videoId": 1,
  "email": "john@example.com",
  "message": "Video uploaded successfully"
}
```

**Get Videos by Email**
```bash
curl http://localhost:8080/api/videos/email/john@example.com

# Response:
[
  {
    "id": 1,
    "title": "My Video",
    "description": "A great video",
    "uploadDate": "2026-06-22T04:00:00Z",
    "processingStatus": "completed",
    "uploadedBy": "John Doe",
    "email": "john@example.com",
    "originalFilename": "video.mp4",
    "sourceS3Key": "uploads/abc123.mp4"
  }
]
```

**Get Stream URL**
```bash
curl http://localhost:8080/api/videos/1/stream

# Response:
{
  "title": "My Video",
  "streamingUrl": "https://cloudfront-url/master.m3u8"
}
```

### 2. S3/Cloud Storage Setup

The frontend uploads files directly to S3 using presigned URLs.

**Flow:**
1. Frontend calls `/api/upload/url` to get a presigned PUT URL
2. Frontend uploads file directly to S3 using the URL
3. Frontend calls `/api/upload/complete` with the S3 key
4. Backend processes and converts video to HLS

**Backend should:**
- Generate presigned PUT URLs with 15-minute expiry
- Store video metadata in database
- Trigger video processing (convert to HLS)
- Generate CloudFront/CDN URL for HLS master.m3u8

### 3. Environment Configuration

To use a custom API URL, set the environment variable:

```env
NEXT_PUBLIC_API_URL=http://your-api-domain.com
```

Then update `lib/api-client.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
```

## 🎥 Video Processing

### Supported Input Formats
- MP4
- WebM
- MKV
- Other container formats with H.264/H.265 video

### Output Format (HLS)
- **Master M3U8**: Index file listing all variants
- **Variants**: Multiple bitrate options (720p, 480p, 360p, 240p)
- **Segments**: 10-second TS files for streaming

### Implementation Options

**Using FFmpeg:**
```bash
ffmpeg -i input.mp4 \
  -c:v libx264 -crf 23 -preset medium \
  -c:a aac -b:a 192k \
  -hls_time 10 -hls_list_size 0 \
  -hls_segment_filename "output_v1_%03d.ts" \
  output_v1.m3u8
```

**Using AWS MediaConvert:**
```python
client = boto3.client('mediaconvert')
response = client.create_job(
    Role='arn:aws:iam::ACCOUNT:role/MediaConvertRole',
    Settings={
        'OutputGroups': [
            {
                'OutputGroupSettings': {
                    'HlsGroupSettings': {
                        'Destination': 's3://bucket/hls/',
                        'SegmentLength': 10
                    }
                }
            }
        ]
    }
)
```

**Using Mux (Managed):**
```python
mux = muxpython.VideosApi(auth_client)
response = mux.upload_asset({
    'input': 's3://bucket/input.mp4',
    'playback_policy': ['public']
})
# Returns HLS master.m3u8 URL
```

## 🔐 CORS Configuration

Your backend should allow CORS for S3 PUT requests:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: PUT, POST, GET
Access-Control-Allow-Headers: *
Access-Control-Max-Age: 3000
```

S3 CORS Policy:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT"],
    "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

## 🚀 Testing the Integration

### 1. Test Upload Endpoint
```bash
# Generate URL
curl -X POST http://localhost:8080/api/upload/url \
  -H "Content-Type: application/json" \
  -d '{"filename": "test.mp4", "contentType": "video/mp4"}'

# Should return uploadUrl and objectKey
```

### 2. Test Backend Locally
```bash
cd your-backend
npm start
# Should run on http://localhost:8080
```

### 3. Test Frontend
```bash
cd /vercel/share/v0-project
pnpm dev
# Go to http://localhost:3000
```

### 4. Upload a Test Video
1. Navigate to `/upload`
2. Fill form fields:
   - Select any video file
   - Title: "Test Video"
   - Email: "test@example.com"
   - Name: "Test User"
3. Click "Upload Video"
4. Watch progress bar
5. Verify success message

### 5. Search Videos
1. Navigate to `/my-videos`
2. Enter: "test@example.com"
3. Click "Search"
4. Should see uploaded video

### 6. Watch Video
1. Click on video card
2. Should load stream URL
3. Video player should display
4. Click play to start playback

## 📊 Database Schema

**Videos Table:**
```sql
CREATE TABLE videos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processing_status VARCHAR(50) DEFAULT 'processing', -- 'processing', 'completed', 'failed'
  uploaded_by VARCHAR(255),
  email VARCHAR(255),
  original_filename VARCHAR(255),
  source_s3_key VARCHAR(255),
  streaming_url VARCHAR(500), -- HLS master.m3u8 URL
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email ON videos(email);
CREATE INDEX idx_status ON videos(processing_status);
```

## 🐛 Troubleshooting

### Upload Fails with CORS Error
- Check S3 CORS policy
- Verify backend CORS headers
- Check browser console for exact error

### Video Doesn't Play
- Verify streaming URL is accessible
- Check CloudFront/CDN permissions
- Test HLS stream with VLC: `File > Open Network Stream > paste URL`

### API Returns 404
- Verify backend is running on correct port
- Check API endpoint paths match exactly
- Verify database has video records

### Upload Progress Stuck
- Check network tab for upload request
- Verify S3 signature hasn't expired
- Check file size vs. S3 limits

### HLS.js Console Errors
- "Manifest not found" → Check streaming URL
- "Unable to load segment" → Check CDN permissions
- "Invalid manifest" → Verify HLS output format

## 📱 Production Deployment

### Environment Variables (Backend)
```env
DATABASE_URL=postgresql://...
S3_BUCKET=my-videos-bucket
S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
CLOUDFRONT_DOMAIN=d123.cloudfront.net
FFmpeg_PATH=/usr/bin/ffmpeg
```

### Environment Variables (Frontend)
```env
NEXT_PUBLIC_API_URL=https://api.example.com
```

### Security Checklist
- [ ] Validate file uploads (type, size)
- [ ] Authenticate API requests
- [ ] Implement rate limiting
- [ ] Sanitize user input
- [ ] Secure S3 presigned URLs (expiry)
- [ ] Enable HTTPS
- [ ] Add request logging
- [ ] Implement video access control

## 🔄 API Client Usage

The frontend provides a singleton API client:

```typescript
import { apiClient } from '@/lib/api-client';

// Generate upload URL
const { uploadUrl, objectKey } = await apiClient.generateUploadUrl({
  filename: 'video.mp4',
  contentType: 'video/mp4'
});

// Upload to S3
await apiClient.uploadFileToS3(
  uploadUrl,
  file,
  (progress) => console.log(progress.percentage + '%')
);

// Complete upload
const result = await apiClient.completeUpload({
  title: 'My Video',
  description: 'Description',
  originalFilename: 'video.mp4',
  sourceS3Key: objectKey,
  uploadedBy: 'John',
  email: 'john@example.com'
});

// Get videos by email
const videos = await apiClient.getVideosByEmail('john@example.com');

// Get stream URL
const stream = await apiClient.getStreamUrl(videoId);
```

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review browser console errors
3. Check backend logs
4. Verify API connectivity
5. Test endpoints with curl/Postman

---

**Integration complete!** Your StreamHub instance is ready to stream.
