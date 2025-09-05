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
      
      // Check if response is HTML instead of JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response received:', textResponse.substring(0, 200));
        throw new Error('Server returned an invalid response format. Please try again.');
      }

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
        
        // Check music response format
        const musicContentType = musicResponse.headers.get('content-type');
        if (!musicContentType || !musicContentType.includes('application/json')) {
          console.warn('Music API returned non-JSON response, using basic playlist');
          setPlaylist(data.playlist);
          setRecentPlaylists(prev => [{mood, tracks: data.playlist}, ...prev].slice(0, 5));
          setIsLoading(false);
          setLoadingStage('');
          return;
        }
        
        setLoadingStage('Finding tracks on Spotify and YouTube...');
        const musicData = await musicResponse.json();
        
        if (musicResponse.ok) {
          console.log('Music data loaded successfully');
          
          // Show platform statistics
          if (musicData.stats) {
            const { spotify, youtube, withData, total } = musicData.stats;
            console.log(`Platform availability: ${spotify}/${total} on Spotify, ${youtube}/${total} on YouTube, ${withData}/${total} total found`);
          }
          
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
      } catch (musicError: any) {
        console.warn('Music enrichment failed, using basic playlist:', musicError.message);
        setPlaylist(data.playlist);
        setRecentPlaylists(prev => [{mood, tracks: data.playlist}, ...prev].slice(0, 5));
        setIsLoading(false);
        setLoadingStage('');
      }
      
    } catch (err: any) {
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (err.message?.includes('JSON')) {
        errorMessage = 'Server communication error. Please refresh the page and try again.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
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
    <div className="min-h-screen bg-gradient-to-b from-theme-background to-theme-surface flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 md:py-12 relative z-0 safe-area-inset min-h-0">
        <div className="w-full max-w-7xl mx-auto text-center space-y-6 sm:space-y-8 flex-1 flex flex-col justify-center">
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-theme-text animate-text-gradient leading-tight px-2">
              Moodify
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-theme-text max-w-4xl mx-auto opacity-90 px-4">
              Create personalized playlists based on your Mooood !
            </p>
          </div>
          
          <div className="flex justify-center w-full px-2">
            <MoodInput onMoodSubmit={handleMoodSubmit} />
          </div>
          
          {isLoading && (
            <div className="space-y-4 flex flex-col items-center w-full max-w-lg mx-auto px-4">
              <LoadingSpinner stage={loadingStage} />
              {loadingStage && (
                <p className="text-theme-text text-sm sm:text-base text-center opacity-90 px-2">{loadingStage}</p>
              )}
            </div>
          )}
          
          {error && (
            <div className="bg-theme-surface border-2 border-theme-accent text-theme-text p-4 sm:p-6 rounded-xl max-w-lg mx-auto shadow-lg">
              <div className="text-center">
                <p className="font-bold text-lg text-theme-accent mb-2">Oops! Something went wrong</p>
                <p className="text-theme-text opacity-80 text-sm sm:text-base">{error}</p>
              </div>
            </div>
          )}
          
          {playlist && currentMood && (
            <div className="w-full space-y-4 sm:space-y-6 flex-1 flex flex-col">
              <div className="text-center px-2">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-theme-text mb-2">
                  Your Mood Playlist
                </h2>
                <p className="text-theme-disabled capitalize text-sm sm:text-base md:text-lg">
                  Curated for: <span className="text-theme-accent font-medium">"{currentMood}"</span>
                </p>
              </div>
              <div className="flex justify-center w-full flex-1 px-2">
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

