import type { Metadata } from "next";
import { UploadForm } from "@/components/upload/UploadForm";
import { Upload } from "lucide-react";

export const metadata: Metadata = {
  title: "Upload Video",
  description:
    "Upload your video to StreamVault. Fill in the details and we'll handle the rest — transcoding and global delivery included.",
};

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
          <Upload className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Upload a Video
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your video will be transcoded into HLS and ready to stream in minutes.
        </p>
      </div>

      <UploadForm />
    </div>
  );
}
