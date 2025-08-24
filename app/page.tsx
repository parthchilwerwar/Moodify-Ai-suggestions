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
  releaseYear?: number
  spotifyId?: string
  searchQuery: string
  reasoning?: string
  spotify?: {
    spotifyId: string
    spotifyUrl: string
    previewUrl: string | null
    popularity: number
    releaseDate: string
    albumImage: string
    duration: number
  }
  youtube?: {
    id: string
    title: string
    artist: string
    description: string
    thumbnailUrl: string
    videoUrl: string
    publishedAt: string
    viewCount: string
    duration: string
  }
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
  const [loadingStage, setLoadingStage] = useState<string>('')

  const handleMoodSubmit = async (mood: string) => {
    setIsLoading(true);
    setError(null);
    setPlaylist(null);
    setCurrentMood(mood);
    setLoadingStage('Analyzing your mood...');

    try {
      console.log(`Generating playlist for mood: ${mood}`);
      
      // Step 1: Generate playlist
      setLoadingStage('Generating playlist tracks...');
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

      console.log(`Generated ${data.playlist.length} tracks`);

      // Step 2: Enrich with both Spotify and YouTube data
      setLoadingStage('Fetching Spotify data...');
      
      try {
        const musicResponse = await fetch('/api/music-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tracks: data.playlist }),
        });
        
        setLoadingStage('Fetching YouTube data...');
        const musicData = await musicResponse.json();
        
        if (musicResponse.ok) {
          console.log('Music data loaded successfully');
          
          // Final stage
          setLoadingStage('Finalizing your playlist...');
          
          // Add a brief delay to show the final stage
          setTimeout(() => {
            setPlaylist(musicData.tracks);
            setRecentPlaylists(prev => [{mood, tracks: musicData.tracks}, ...prev].slice(0, 5));
            setIsLoading(false);
            setLoadingStage('');
          }, 800);
        } else {
          console.warn('Using basic playlist');
          setPlaylist(data.playlist);
          setRecentPlaylists(prev => [{mood, tracks: data.playlist}, ...prev].slice(0, 5));
          setIsLoading(false);
          setLoadingStage('');
        }
      } catch (musicError) {
        console.warn('Using basic playlist');
        setPlaylist(data.playlist);
        setRecentPlaylists(prev => [{mood, tracks: data.playlist}, ...prev].slice(0, 5));
        setIsLoading(false);
        setLoadingStage('');
      }
      
    } catch (err: any) {
      const errorMessage = err?.message || 'Something went wrong. Please try again.';
      setError(errorMessage);
      setLoadingStage('');
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
    <div className="min-h-screen bg-gradient-to-b from-theme-background to-theme-surface flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8 md:py-12 relative z-0">
        <div className="w-full max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-theme-text animate-text-gradient">
              Moodify
            </h1>
            <p className="text-lg md:text-xl text-theme-text max-w-2xl mx-auto opacity-90">
              Create personalized playlists based on your mood with Spotify and YouTube integration
            </p>
          </div>
          
          <div className="flex justify-center">
            <MoodInput onMoodSubmit={handleMoodSubmit} />
          </div>
          
          {isLoading && (
            <div className="space-y-4 flex flex-col items-center w-full max-w-lg mx-auto">
              <LoadingSpinner stage={loadingStage} />
              {loadingStage && (
                <p className="text-theme-text text-sm text-center opacity-90">{loadingStage}</p>
              )}
            </div>
          )}
          
          {error && (
            <div className="bg-theme-surface border-2 border-theme-accent text-theme-text p-6 rounded-xl max-w-lg mx-auto shadow-lg">
              <div className="text-center">
                <p className="font-bold text-lg text-theme-accent mb-2">Oops! Something went wrong</p>
                <p className="text-theme-text opacity-80">{error}</p>
              </div>
            </div>
          )}
          
          {playlist && currentMood && (
            <div className="w-full space-y-6">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-theme-text mb-2">
                  Your Mood Playlist
                </h2>
                <p className="text-theme-disabled capitalize">
                  Curated for: <span className="text-theme-accent font-medium">"{currentMood}"</span>
                </p>
              </div>
              <div className="flex justify-center">
                <Playlist tracks={playlist} />
              </div>
            </div>
          )}
        </div>
      </main>
      <RecentPlaylistsSidebar playlists={recentPlaylists} onPlaylistSelect={handlePlaylistSelect} />
    </div>
  )
  
}

