import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Video,
  Zap,
  Globe,
  Shield,
  ChevronRight,
  Play,
} from "lucide-react";

export const metadata: Metadata = {
  title: "StreamVault — Professional Video Streaming",
  description:
    "Upload your videos and stream them globally with adaptive bitrate HLS technology. Professional video management made simple.",
};

const features = [
  {
    icon: Zap,
    title: "Instant Processing",
    description:
      "Videos are transcoded automatically into HLS adaptive bitrate streams for optimal playback on any device.",
  },
  {
    icon: Globe,
    title: "Global CDN Delivery",
    description:
      "Your content is delivered from the nearest edge location via CloudFront for ultra-low latency worldwide.",
  },
  {
    icon: Shield,
    title: "Secure Storage",
    description:
      "All uploads are stored securely on AWS S3 with pre-signed URLs and encrypted transmission.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="hero-gradient absolute inset-0 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-36 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              HLS Adaptive Streaming
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Stream Your Videos{" "}
              <span className="text-primary">Professionally</span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              Upload once. Stream everywhere. StreamVault automatically
              transcodes your videos into HLS format and delivers them globally
              via CDN — no configuration required.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="w-full sm:w-auto gap-2"
                nativeButton={false}
                render={<Link href="/upload" />}
              >
                <Upload className="h-4 w-4" />
                Upload a Video
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto gap-2"
                nativeButton={false}
                render={<Link href="/videos" />}
              >
                <Video className="h-4 w-4" />
                Browse My Videos
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-t border-border/50 bg-card/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              How it works
            </h2>
            <p className="mt-3 text-muted-foreground">
              Three steps from raw file to global stream
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Upload",
                desc: "Select your video file and fill in the metadata. We support MP4, MOV, and most common formats.",
              },
              {
                step: "02",
                title: "Process",
                desc: "Our backend transcodes the video into adaptive HLS streams at multiple quality levels.",
              },
              {
                step: "03",
                title: "Stream",
                desc: "Watch your video through the built-in HLS player with smooth adaptive bitrate playback.",
              },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                className="relative rounded-xl border border-border/60 bg-card p-6 card-hover"
              >
                <div className="mb-4 text-4xl font-black text-primary/20 select-none">
                  {step}
                </div>
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Built for performance
            </h2>
            <p className="mt-3 text-muted-foreground">
              Enterprise-grade infrastructure, simple developer experience
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-border/60 bg-card p-6 card-hover"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border/50 bg-card/30 py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
            <Play className="h-7 w-7 fill-primary text-primary" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Ready to start streaming?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Upload your first video now and it will be ready to stream in minutes.
          </p>
          <Button
            size="lg"
            className="mt-8 gap-2"
            nativeButton={false}
            render={<Link href="/upload" />}
          >
            Get Started <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
