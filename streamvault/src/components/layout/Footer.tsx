import Link from "next/link";
import { Play } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/80">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/20">
              <Play className="h-3 w-3 fill-primary text-primary" />
            </div>
            <span className="text-foreground">
              Stream<span className="text-primary">Vault</span>
            </span>
          </Link>

          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} StreamVault. All rights reserved.
          </p>

          <nav className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/upload" className="hover:text-foreground transition-colors">
              Upload
            </Link>
            <Link href="/videos" className="hover:text-foreground transition-colors">
              My Videos
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
