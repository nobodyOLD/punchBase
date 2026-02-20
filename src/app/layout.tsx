import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/Providers";

import { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: '#050a1a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PunchBase - Web3 Fighting Game",
  description: "Turn-based fighting game on Base network",
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "https://punch-base.vercel.app/og-image.png",
      button: {
        title: "Enter Arena",
        action: {
          type: "launch_frame",
          name: "PunchBase",
          url: "https://punch-base.vercel.app",
          splashImageUrl: "https://punch-base.vercel.app/splash.png",
          splashBackgroundColor: "#050a1a",
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `html, body { background: #050a1a !important; color-scheme: dark; }`,
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
