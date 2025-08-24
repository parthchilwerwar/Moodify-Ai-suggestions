import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Moodify - Mood-Based Playlist Generator',
  description: 'Generate custom playlists based on your mood',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-theme-background min-h-screen font-jakarta">
        {children}
      </body>
    </html>
  )

}


