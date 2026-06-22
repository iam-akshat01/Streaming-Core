"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Play, Upload, Video } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/upload", label: "Upload", icon: Upload },
  { href: "/videos", label: "My Videos", icon: Video },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 ring-1 ring-primary/30">
            <Play className="h-4 w-4 fill-primary text-primary" />
          </div>
          <span className="text-foreground">
            Stream<span className="text-primary">Vault</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-1 sm:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu — simplified icon links */}
        <nav className="flex items-center gap-1 sm:hidden">
          {navLinks.map(({ href, icon: Icon }) =>
            Icon ? (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-md p-2 transition-colors",
                  pathname === href
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
              </Link>
            ) : null
          )}
        </nav>
      </div>
    </header>
  );
}
