import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
        <Play className="h-10 w-10 text-primary/50" />
      </div>
      <h1 className="text-6xl font-black text-foreground">404</h1>
      <h2 className="mt-2 text-xl font-semibold text-foreground">
        Page not found
      </h2>
      <p className="mt-3 max-w-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button
        className="mt-8 gap-2"
        nativeButton={false}
        render={<Link href="/" />}
      >
        <Home className="h-4 w-4" />
        Go Home
      </Button>
    </div>
  );
}
