import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "StreamVault — Your Video Platform",
    template: "%s | StreamVault",
  },
  description:
    "StreamVault is a professional video streaming platform. Upload, manage, and stream your videos with HLS adaptive bitrate streaming.",
  keywords: ["video streaming", "upload video", "HLS", "streaming platform"],
  openGraph: {
    type: "website",
    siteName: "StreamVault",
    title: "StreamVault — Your Video Platform",
    description: "Upload, manage, and stream your videos professionally.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col bg-background text-foreground`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
