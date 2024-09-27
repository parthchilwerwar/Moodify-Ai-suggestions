import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Moodify - Mood-Based Playlist Generator',
  description: 'Generate custom playlists based on your mood',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 min-h-screen`}>
        {children}
      </body>
    </html>
  )
}


//structure of the website 