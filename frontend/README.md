# StreamHub - Professional Video Streaming Platform

A production-ready frontend for a video streaming platform built with Next.js 15, TypeScript, Tailwind CSS, and HLS.js. Upload, manage, and stream videos with beautiful HLS streaming technology.

## 🎬 Features

- **Modern Dark Theme**: Netflix + YouTube inspired design with professional dark theme
- **Responsive Design**: Mobile-first approach, works seamlessly on desktop, tablet, and mobile
- **Drag & Drop Upload**: Easy video upload with drag-and-drop support
- **HLS Streaming**: Professional-grade HLS video streaming with adaptive bitrate
- **Progress Tracking**: Upload progress bar and loading states
- **Email-Based Search**: Find and manage your videos by email
- **Error Handling**: Comprehensive error boundaries and error states
- **Production-Ready**: Clean architecture, reusable components, proper TypeScript types

## 📋 Project Structure

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx              # Root layout with navigation
│   ├── page.tsx                # Home page with hero and features
│   ├── upload/
│   │   └── page.tsx            # Upload page with form and progress
│   ├── my-videos/
│   │   └── page.tsx            # Video search and browse
│   └── watch/[id]/
│       └── page.tsx            # Video player page
├── components/
│   ├── navigation.tsx          # Navigation bar
│   ├── hls-player.tsx          # HLS video player
│   ├── video-card.tsx          # Video card component
│   ├── upload-zone.tsx         # Drag-drop upload area
│   ├── progress-bar.tsx        # Upload progress indicator
│   ├── error-boundary.tsx      # Error boundary component
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── api-client.ts           # Axios API client
│   ├── types.ts                # TypeScript types
│   └── utils.ts                # Utility functions
├── app/globals.css             # Global styles
└── package.json                # Dependencies
```

## 🚀 Quick Start

### Installation

```bash
# Install dependencies (already done in this project)
pnpm install

# Start the development server
pnpm dev

# Open http://localhost:3000 in your browser
```

### Prerequisites

- Backend API running at `http://localhost:8080`
- Node.js 18+ and pnpm

## 📖 API Integration

The frontend connects to the following backend APIs:

### 1. Generate Upload URL
```
POST /api/upload/url
Body: { filename: string, contentType: string }
Response: { uploadUrl: string, objectKey: string }
```

### 2. Complete Upload
```
POST /api/upload/complete
Body: {
  title: string,
  description: string,
  originalFilename: string,
  sourceS3Key: string,
  uploadedBy: string,
  email: string
}
Response: { videoId: number, email: string, message: string }
```

### 3. Get All Videos
```
GET /api/videos
Response: Video[]
```

### 4. Get Videos by Email
```
GET /api/videos/email/{email}
Response: Video[]
```

### 5. Get Stream URL
```
GET /api/videos/{id}/stream
Response: { title: string, streamingUrl: string }
```

## 🎨 Design System

### Colors
- **Primary**: Red (#DC2626)
- **Background**: Black (#000000)
- **Surface**: Gray-900 (#111827)
- **Text**: White (#FFFFFF)
- **Accent**: Gray-400 (#9CA3AF)

### Typography
- **Headings**: Geist font family
- **Body**: Geist font family
- **Scale**: 14px base, responsive sizing

### Components
- **Navigation**: Sticky header with active state
- **Cards**: Rounded corners with hover effects
- **Forms**: Clean inputs with focus states
- **Buttons**: Red primary, gray secondary
- **Progress**: Gradient progress bars

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Video Streaming**: HLS.js
- **UI Components**: shadcn/ui

## 📱 Pages

### Home Page (`/`)
- Hero section with main CTA
- Feature highlights (Easy Upload, HLS Streaming, Lightning Fast)
- Call-to-action section
- Responsive hero with gradient accents

### Upload Page (`/upload`)
- Drag-and-drop file upload zone
- Form fields: Title, Description, Email, Name
- Upload progress bar with percentage
- Success/error states with messages
- File size display

### My Videos Page (`/my-videos`)
- Email search functionality
- Video grid (responsive: 1-4 columns)
- Video cards with:
  - Thumbnail placeholder
  - Title and upload date
  - Processing status badge
  - Uploader name
  - Click to watch

### Watch Video Page (`/watch/[id]`)
- HLS video player with controls
- Video title and metadata
- Loading and error states
- Video information grid
- Back button to browse

## 🎯 Component APIs

### HLSPlayer
```tsx
<HLSPlayer 
  streamUrl="https://..." 
  title="Video Title" 
/>
```

### VideoCard
```tsx
<VideoCard video={videoObject} />
```

### UploadZone
```tsx
<UploadZone 
  onFileSelect={(file) => {...}} 
  isDisabled={false}
/>
```

### ProgressBar
```tsx
<ProgressBar 
  percentage={65} 
  label="Uploading..."
/>
```

## 🔐 Error Handling

- **Error Boundary**: Catches React component errors
- **API Errors**: Try-catch with user-friendly messages
- **Network Errors**: Retry logic and error states
- **Validation**: Form field validation before submission
- **Video Playback**: HLS error handling with fallback

## 📊 State Management

- **React Hooks**: useState for form and UI state
- **API Client**: Singleton pattern for consistent API calls
- **Form State**: Controlled components for inputs
- **Loading States**: Explicit step-based state machine

## 🎬 Upload Flow

1. **User selects video** via drag-drop or file picker
2. **Form validation** - all required fields
3. **Generate upload URL** from backend
4. **Upload to S3** with progress tracking
5. **Complete upload** with metadata
6. **Success/Error handling** with user feedback

## 🎥 Playback Flow

1. **User clicks "Watch"** on video card
2. **Fetch stream URL** from backend
3. **Initialize HLS player** with stream URL
4. **Show loading state** while manifest parses
5. **Enable playback** with native controls
6. **Handle playback errors** gracefully

## 🚀 Deployment

### To Vercel
1. Connect your GitHub repository
2. Environment variables (if needed): `NEXT_PUBLIC_API_URL`
3. Build command: `pnpm build`
4. Start command: `pnpm start`

### To Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

## 📝 Environment Variables

Create a `.env.local` file (optional):
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 🧪 Testing

Test the upload flow:
1. Navigate to `/upload`
2. Select a video file
3. Fill in form fields
4. Click "Upload Video"
5. Watch progress bar
6. Verify success message

Test the search flow:
1. Navigate to `/my-videos`
2. Enter an email address (from a successful upload)
3. Click "Search"
4. View returned videos
5. Click a video to watch

## 🐛 Debugging

Enable debug logs in components:
```typescript
console.log("[v0] Debug message:", variable);
```

Check browser console for:
- HLS errors
- API call responses
- Upload progress
- Component renders

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [HLS.js](https://github.com/video-dev/hls.js)
- [Axios](https://axios-http.com)
- [TypeScript](https://www.typescriptlang.org)

## ✅ Production Checklist

- [ ] Backend API is running and accessible
- [ ] S3/Cloud storage is configured
- [ ] Environment variables are set
- [ ] Error handling is tested
- [ ] Upload flow works end-to-end
- [ ] Video playback works
- [ ] Mobile responsiveness verified
- [ ] Performance optimized (code splitting, lazy loading)
- [ ] Security: input validation, CORS configured
- [ ] Deployment configured

## 📄 License

This project is provided as-is for educational and commercial use.

---

**Built with v0** - A production-ready video streaming platform frontend.
