'use client'

import { useState } from 'react'
import MoodInput from './components/MoodInput'
import Playlist from './components/Playlist'
import LoadingSpinner from './components/LoadingSpinner'

interface Track {
  title: string
  artist: string
  searchQuery: string
}

export default function Home() {
  const [playlist, setPlaylist] = useState<Track[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleMoodSubmit = async (mood: string) => {
    setIsLoading(true);
    setError(null);
    setPlaylist(null);

    try {
      const response = await fetch('/api/generate-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mood }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate playlist');
      }

      setPlaylist(data.playlist);
    } catch (err) {
      setError('An error occurred while generating the playlist. Please try again.');
      console.error('Playlist generation error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="px-4 py-12 flex flex-col items-center">
      <p className="text-5xl font-bold text-center mb-8 text-white">Moodify</p>
      <p className="text-xl text-center mb-12 text-white">Generate a custom playlist based on your mood with Ai </p>
      <div className="w-full max-w-md">
        <MoodInput onMoodSubmit={handleMoodSubmit} />
        {isLoading && <LoadingSpinner />}
        {error && <p className="text-red-200 text-center mb-4 bg-red-500 bg-opacity-25 p-3 rounded">{error}</p>}
        {playlist && <Playlist tracks={playlist} />}
      </div>
    </main>
  )
}
