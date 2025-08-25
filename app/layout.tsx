import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: 'Moodify - Mood-Based Playlist Generator',
  description: 'Generate custom playlists based on your mood',
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-theme-background min-h-screen font-jakarta overflow-x-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  )

}


