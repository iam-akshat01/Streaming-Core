"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Upload,
  FileVideo,
  CheckCircle,
  XCircle,
  Loader2,
  X,
  Play,
} from "lucide-react";
import { generateUploadUrl, uploadToS3, completeUpload } from "@/lib/api/upload";
import type { UploadState } from "@/types";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5 GB
const ACCEPTED_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/webm",
  "video/mpeg",
];

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

interface FormValues {
  title: string;
  description: string;
  uploadedBy: string;
  email: string;
}

const initialState: UploadState = { step: "idle", progress: 0 };

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [form, setForm] = useState<FormValues>({
    title: "",
    description: "",
    uploadedBy: "",
    email: "",
  });
  const [uploadState, setUploadState] = useState<UploadState>(initialState);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateFile = (f: File): string | null => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      return "Unsupported file type. Please upload an MP4, MOV, AVI, WebM, or MPEG file.";
    }
    if (f.size > MAX_FILE_SIZE) {
      return `File too large. Maximum size is ${formatBytes(MAX_FILE_SIZE)}.`;
    }
    return null;
  };

  const handleFileSelect = useCallback(
    (f: File) => {
      const err = validateFile(f);
      if (err) {
        setUploadState({ step: "error", progress: 0, errorMessage: err });
        return;
      }
      setFile(f);
      if (!form.title) {
        setForm((prev) => ({
          ...prev,
          title: f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
        }));
      }
      if (uploadState.step === "error") {
        setUploadState(initialState);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form.title, uploadState.step]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFileSelect(dropped);
    },
    [handleFileSelect]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    if (!form.title.trim()) {
      setUploadState({
        step: "error",
        progress: 0,
        errorMessage: "Title is required.",
      });
      return;
    }
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      setUploadState({
        step: "error",
        progress: 0,
        errorMessage: "Please enter a valid email address.",
      });
      return;
    }

    try {
      // Step 1 — Get pre-signed URL
      setUploadState({ step: "getting-url", progress: 0 });
      const { uploadUrl, objectKey } = await generateUploadUrl({
        filename: file.name,
        contentType: file.type,
      });

      // Step 2 — Upload to S3 with progress
      setUploadState({ step: "uploading-s3", progress: 0 });
      await uploadToS3(uploadUrl, file, (pct) => {
        setUploadState({ step: "uploading-s3", progress: pct });
      });

      // Step 3 — Notify backend
      setUploadState({ step: "completing", progress: 100 });
      const result = await completeUpload({
        title: form.title.trim(),
        description: form.description.trim(),
        originalFilename: file.name,
        sourceS3Key: objectKey,
        uploadedBy: form.uploadedBy.trim() || "Anonymous",
        email: form.email.trim(),
      });

      setUploadState({ step: "success", progress: 100, result });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Upload failed. Please try again.";
      setUploadState({ step: "error", progress: 0, errorMessage: message });
    }
  };

  const reset = () => {
    setFile(null);
    setForm({ title: "", description: "", uploadedBy: "", email: "" });
    setUploadState(initialState);
  };

  const isSubmitting = ["getting-url", "uploading-s3", "completing"].includes(
    uploadState.step
  );

  const stepLabel: Record<string, string> = {
    "getting-url": "Generating upload URL…",
    "uploading-s3": `Uploading to S3 (${uploadState.progress}%)…`,
    completing: "Finalising…",
  };

  // ── Success state ──
  if (uploadState.step === "success" && uploadState.result) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30">
          <CheckCircle className="h-8 w-8 text-emerald-400" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">
          Upload Successful!
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {uploadState.result.message} (ID:{" "}
          <span className="font-mono text-foreground">
            {uploadState.result.videoId}
          </span>
          )
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            size="sm"
            className="gap-2"
            nativeButton={false}
            render={<Link href={`/watch/${uploadState.result.videoId}`} />}
          >
            <Play className="h-3.5 w-3.5" />
            Watch Video
          </Button>
          <Button variant="outline" size="sm" onClick={reset}>
            Upload Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-border bg-card p-6 sm:p-8"
    >
      {/* ── Drop zone ── */}
      <div>
        <Label className="mb-2 block text-sm font-medium">Video File *</Label>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !file && fileInputRef.current?.click()}
          className={cn(
            "relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
            dragOver
              ? "border-primary bg-primary/5"
              : file
              ? "border-border bg-accent/5 cursor-default"
              : "border-border/60 hover:border-primary/50 hover:bg-primary/5"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileSelect(f);
            }}
          />

          {file ? (
            <div className="flex w-full items-center gap-3 px-4">
              <FileVideo className="h-8 w-8 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setUploadState(initialState);
                }}
                className="rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-primary">Click to browse</span>{" "}
                or drag & drop
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                MP4, MOV, AVI, WebM — up to 5 GB
              </p>
            </>
          )}
        </div>
      </div>

      {/* ── Text fields ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="title" className="mb-1.5 block text-sm font-medium">
            Title *
          </Label>
          <Input
            id="title"
            name="title"
            value={form.title}
            onChange={handleFieldChange}
            placeholder="My Awesome Video"
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="sm:col-span-2">
          <Label
            htmlFor="description"
            className="mb-1.5 block text-sm font-medium"
          >
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleFieldChange}
            placeholder="A brief description of your video…"
            rows={3}
            disabled={isSubmitting}
            className="resize-none"
          />
        </div>

        <div>
          <Label
            htmlFor="uploadedBy"
            className="mb-1.5 block text-sm font-medium"
          >
            Your Name
          </Label>
          <Input
            id="uploadedBy"
            name="uploadedBy"
            value={form.uploadedBy}
            onChange={handleFieldChange}
            placeholder="Jane Doe"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleFieldChange}
            placeholder="jane@example.com"
            disabled={isSubmitting}
            required
          />
        </div>
      </div>

      {/* ── Progress ── */}
      {isSubmitting && (
        <div className="space-y-2 rounded-lg bg-accent/10 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {stepLabel[uploadState.step] || "Processing…"}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {uploadState.progress}%
            </span>
          </div>
          <Progress value={uploadState.progress} className="h-1.5" />
        </div>
      )}

      {/* ── Error ── */}
      {uploadState.step === "error" && uploadState.errorMessage && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Upload Failed</AlertTitle>
          <AlertDescription>{uploadState.errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* ── Submit ── */}
      <Button
        type="submit"
        className="w-full gap-2"
        disabled={!file || isSubmitting}
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading…
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Upload Video
          </>
        )}
      </Button>
    </form>
  );
}
