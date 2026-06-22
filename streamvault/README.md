# StreamVault — Video Streaming Platform

A production-quality Next.js 15 frontend for a video streaming platform with HLS.js playback, S3 direct uploads, and a professional dark UI.

## Tech Stack

- **Next.js 15** — App Router, server + client components
- **TypeScript** — strict mode throughout
- **Tailwind CSS** — custom dark design system
- **shadcn/ui** — accessible component primitives
- **Axios** — API client with interceptors
- **HLS.js** — adaptive bitrate video streaming

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (dark theme, fonts, Navbar, Footer)
│   ├── page.tsx            # Home — hero, how-it-works, features
│   ├── not-found.tsx       # Custom 404
│   ├── upload/page.tsx     # Upload page
│   ├── videos/page.tsx     # My Videos (by email)
│   └── watch/[id]/page.tsx # Watch page with HLS player
├── components/
│   ├── layout/Navbar.tsx
│   ├── layout/Footer.tsx
│   ├── upload/UploadForm.tsx     # Drag-drop + 3-step upload flow
│   ├── videos/VideoSearch.tsx    # Email search + results grid
│   ├── videos/VideoCard.tsx      # Video card with status badge
│   ├── videos/VideoCardSkeleton.tsx
│   └── watch/HLSPlayer.tsx       # HLS.js player with error recovery
├── lib/
│   ├── api/client.ts       # Axios instance
│   ├── api/upload.ts       # Upload API (3 steps)
│   ├── api/videos.ts       # Videos API
│   └── utils.ts            # cn(), formatDate(), status helpers
└── types/index.ts          # All shared TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 18+
- Backend running on `http://localhost:8080`

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Copy `.env.local` and set the API base URL:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with hero and feature overview |
| `/upload` | Upload video with drag-and-drop and progress tracking |
| `/videos` | Browse your videos by email |
| `/watch/[id]` | HLS video player page |

## Upload Flow

1. User selects a video file (drag-and-drop or browse)
2. `POST /api/upload/url` — get a pre-signed S3 URL
3. `PUT {uploadUrl}` — upload file directly to S3 (with progress events via XHR)
4. `POST /api/upload/complete` — notify backend, receive `videoId`
5. User is redirected to `/watch/{videoId}`

## Architecture Decisions

- **Server Components** for Home and Watch pages (data fetched on server)
- **Client Components** for Upload form and Video search (form state, browser APIs)
- **HLS.js** with automatic error recovery (network + media errors) and native Safari fallback
- **XHR** (not fetch) for S3 upload to get upload progress events
- **CSS variables** for theming, compatible with shadcn/ui
