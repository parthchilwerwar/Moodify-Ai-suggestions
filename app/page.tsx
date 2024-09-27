'use client'

import { useState } from 'react'
import MoodInput from './components/MoodInput'
import Playlist from './components/Playlist'
import LoadingSpinner from './components/LoadingSpinner'
import Header from './components/Header'
import RecentPlaylistsSidebar from './components/RecentPlaylistsSidebar'

interface Track {
  title: string
  artist: string
  searchQuery: string
}

interface PlaylistData {
  mood: string
  tracks: Track[]
}

export default function Home() {
  const [playlist, setPlaylist] = useState<Track[] | null>(null)
  const [currentMood, setCurrentMood] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [recentPlaylists, setRecentPlaylists] = useState<PlaylistData[]>([])

  const handleMoodSubmit = async (mood: string) => {
    setIsLoading(true);
    setError(null);
    setPlaylist(null);
    setCurrentMood(mood);

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
      setRecentPlaylists(prev => [{mood, tracks: data.playlist}, ...prev].slice(0, 5));
    } catch (err) {
      setError('An error occurred while generating the playlist. Please try again.');
      console.error('Playlist generation error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const handlePlaylistSelect = (selectedPlaylist: PlaylistData) => {
    setPlaylist(selectedPlaylist.tracks);
    setCurrentMood(selectedPlaylist.mood);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center relative z-0">
        <div className="w-full max-w-md flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 md:mb-8 text-white animate-text-gradient">Moodify</h1>
          <p className="text-lg md:text-xl text-center mb-8 md:mb-12 text-gray-300">Generate a custom playlist based on your mood with AI</p>
          <MoodInput onMoodSubmit={handleMoodSubmit} />
          {isLoading && <LoadingSpinner />}
          {error && <p className="text-red-300 text-center mb-4 bg-red-900 bg-opacity-25 p-3 rounded">{error}</p>}
          {playlist && (
            <>
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-200">Playlist for {currentMood}</h2>
              <Playlist tracks={playlist} />
            </>
          )}
        </div>
      </main>
      <RecentPlaylistsSidebar playlists={recentPlaylists} onPlaylistSelect={handlePlaylistSelect} />
    </div>
  )
  
}

