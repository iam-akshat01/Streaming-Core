# 🚀 StreamHub Quick Start

Get StreamHub running in 5 minutes!

## Prerequisites

- Node.js 18+
- Backend API running at `http://localhost:8080`
- pnpm (or npm/yarn)

## Installation & Setup

### 1. Install Dependencies
```bash
cd /vercel/share/v0-project
pnpm install
```

### 2. Start Development Server
```bash
pnpm dev
```

The app will be available at: **http://localhost:3000**

### 3. Test the App

#### Home Page
- Open http://localhost:3000
- See hero section and features
- Click "Upload Video" or "Browse Videos"

#### Upload Page (http://localhost:3000/upload)
- Drag a video file or click to select
- Fill in: Title, Email, Name
- Click "Upload Video"
- Watch progress bar
- See success/error message

#### My Videos Page (http://localhost:3000/my-videos)
- Enter an email (from upload)
- Click "Search"
- See video grid
- Click any video to watch

#### Watch Page (http://localhost:3000/watch/[id])
- Click a video from grid
- Watch HLS video player
- See video metadata
- Use standard video controls

## Environment Variables

Optional - to use custom backend:

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Backend Requirements

Your backend must implement these 5 endpoints:

### 1. GET /api/videos
Returns all videos
```json
[{
  "id": 1,
  "title": "Video Title",
  "description": "Description",
  "uploadDate": "2026-06-22T...",
  "processingStatus": "completed",
  "uploadedBy": "Name",
  "email": "user@example.com",
  "originalFilename": "video.mp4",
  "sourceS3Key": "uploads/..."
}]
```

### 2. GET /api/videos/email/{email}
Returns videos by user email

### 3. POST /api/upload/url
Request:
```json
{
  "filename": "video.mp4",
  "contentType": "video/mp4"
}
```
Response:
```json
{
  "uploadUrl": "https://s3-signed-url...",
  "objectKey": "uploads/key.mp4"
}
```

### 4. POST /api/upload/complete
Request:
```json
{
  "title": "Video Title",
  "description": "Description",
  "originalFilename": "video.mp4",
  "sourceS3Key": "uploads/...",
  "uploadedBy": "Name",
  "email": "user@example.com"
}
```
Response:
```json
{
  "videoId": 1,
  "email": "user@example.com",
  "message": "Video uploaded successfully"
}
```

### 5. GET /api/videos/{id}/stream
Response:
```json
{
  "title": "Video Title",
  "streamingUrl": "https://cloudfront-url/master.m3u8"
}
```

## Project Structure

```
app/
├── page.tsx              # Home page
├── upload/page.tsx       # Upload page
├── my-videos/page.tsx    # Browse videos
└── watch/[id]/page.tsx   # Watch video

components/
├── navigation.tsx        # Navigation bar
├── hls-player.tsx        # Video player
├── video-card.tsx        # Video grid card
├── upload-zone.tsx       # Drag-drop area
├── progress-bar.tsx      # Upload progress
└── error-boundary.tsx    # Error handling

lib/
├── api-client.ts         # API client
└── types.ts              # TypeScript types
```

## Key Commands

```bash
# Development
pnpm dev              # Start dev server

# Production
pnpm build            # Build for production
pnpm start            # Start production server

# Linting
pnpm lint             # Check for errors
```

## Architecture

### Upload Flow
1. User selects video file (drag-drop or click)
2. Frontend requests presigned S3 URL
3. Frontend uploads directly to S3
4. Frontend notifies backend of completion
5. Backend processes video to HLS
6. Video available for playback

### Playback Flow
1. User clicks video to watch
2. Frontend fetches HLS stream URL
3. HLS.js initializes player
4. Video plays with adaptive bitrate

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP**: Axios
- **Streaming**: HLS.js
- **Icons**: Lucide React

## Troubleshooting

### "Cannot connect to API"
- Verify backend is running on http://localhost:8080
- Check CORS headers from backend
- Check browser console for errors

### "Upload fails immediately"
- Verify S3 is configured
- Check presigned URL generation
- Verify file type is video/*

### "Video won't play"
- Verify stream URL is correct
- Check HLS segments are generated
- Test URL in VLC Player
- Check CloudFront permissions

### "Page shows loading spinner forever"
- Check browser console errors
- Verify API endpoints
- Check network tab in DevTools
- Restart dev server

## Next Steps

1. **Set up backend** - Implement the 5 API endpoints
2. **Configure S3** - Set up presigned URLs
3. **Test locally** - Upload and play a video
4. **Deploy** - Use Vercel, Docker, or AWS
5. **Monitor** - Add error tracking and analytics

## Documentation

- **README.md** - Full project overview
- **INTEGRATION_GUIDE.md** - Backend API details
- **DEPLOYMENT.md** - Production deployment
- **FILES_CREATED.md** - File-by-file breakdown

## Support

If you encounter issues:

1. Check the browser console (F12)
2. Review backend logs
3. Verify API connectivity with curl
4. Check network tab in DevTools
5. Read troubleshooting docs

---

**Happy streaming! 🎬**
