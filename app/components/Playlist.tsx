import { motion } from 'framer-motion'
import { FaSpotify, FaYoutube } from 'react-icons/fa'

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

interface PlaylistProps {
  tracks: Track[]
}

export default function Playlist({ tracks }: PlaylistProps) {

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-theme-surface rounded-lg p-4 md:p-6 w-full max-w-2xl shadow-lg border border-theme-disabled"
    >
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-theme-accent">Your Latest Mood-Based Playlist</h2>
      
      <div className="space-y-4">
        {tracks.map((track, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-theme-background rounded-lg p-6 hover:bg-theme-surface transition duration-300 border border-theme-disabled hover:border-theme-accent group"
          >
            {/* Track Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="bg-theme-surface rounded-full p-2 min-w-[40px] flex items-center justify-center">
                  <span className="text-theme-accent font-bold text-lg">{String(index + 1).padStart(2, '0')}</span>
                </div>
                {track.spotify?.albumImage && (
                  <img 
                    src={track.spotify.albumImage} 
                    alt={`${track.title} album cover`}
                    className="w-16 h-16 rounded-lg object-cover shadow-md group-hover:shadow-lg transition-shadow"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-theme-text text-lg md:text-xl truncate group-hover:text-theme-accent transition-colors">{track.title}</h3>
                  <p className="text-theme-disabled text-base truncate">{track.artist}</p>
                </div>
              </div>
              
              {/* Action Buttons & Popularity */}
              <div className="flex items-center space-x-3">
                {/* Popularity Badge */}
                {track.spotify?.popularity && (
                  <div className="bg-theme-accent text-white px-3 py-1 rounded-full text-xs font-bold">
                    {track.spotify.popularity}% Match
                  </div>
                )}
                
                {/* Spotify Button */}
                {track.spotify?.spotifyUrl && (
                  <a 
                    href={track.spotify.spotifyUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 h-8 bg-green-600 hover:bg-green-700 text-white rounded-md transition-all duration-300 hover:scale-110 shadow-lg"
                    title="Open in Spotify"
                  >
                    <FaSpotify size={12} />
                  </a>
                )}

                {/* YouTube Button */}
                {track.youtube?.videoUrl ? (
                  <a 
                    href={track.youtube.videoUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 h-8 bg-theme-accent hover:bg-theme-accent-hover text-white rounded-md transition-all duration-300 hover:scale-110 shadow-lg"
                    title="Watch on YouTube"
                  >
                    <FaYoutube size={12} />
                  </a>
                ) : (
                  <a 
                    href={`https://www.youtube.com/results?search_query=${track.searchQuery}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 h-8 bg-theme-accent hover:bg-theme-accent-hover text-white rounded-md transition-all duration-300 hover:scale-110 shadow-lg opacity-75"
                    title="Search on YouTube"
                  >
                    <FaYoutube size={12} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

