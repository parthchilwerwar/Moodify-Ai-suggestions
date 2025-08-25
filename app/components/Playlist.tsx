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
      className="bg-theme-surface rounded-lg p-2 sm:p-3 md:p-4 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl shadow-lg border border-theme-disabled mx-1 sm:mx-2"
    >
      <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 text-theme-accent text-center">Your Mood Playlist</h2>
      
      <div className="space-y-2 sm:space-y-3">
        {tracks.map((track, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-theme-background rounded-lg p-2 sm:p-3 hover:bg-theme-surface transition duration-300 border border-theme-disabled hover:border-theme-accent group"
          >
            {/* Track Info - Mobile First Layout */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Track Number */}
              <div className="bg-theme-surface rounded-full p-1.5 sm:p-2 min-w-[28px] sm:min-w-[32px] flex items-center justify-center flex-shrink-0">
                <span className="text-theme-accent font-bold text-xs sm:text-sm">{String(index + 1).padStart(2, '0')}</span>
              </div>
              
              {/* Album/Thumbnail Image */}
              <img 
                src={track.spotify?.albumImage || track.youtube?.thumbnailUrl || '/favicon.ico'} 
                alt={`${track.title} cover`}
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-md object-cover shadow-md group-hover:shadow-lg transition-shadow flex-shrink-0"
                onError={(e) => {
                  // Fallback to favicon.ico if image fails to load
                  const target = e.target as HTMLImageElement;
                  if (target.src !== '/favicon.ico') {
                    target.src = '/favicon.ico';
                  }
                }}
              />
              
              {/* Track Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-theme-text text-xs sm:text-sm md:text-base truncate group-hover:text-theme-accent transition-colors leading-tight">
                  {track.title}
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-theme-disabled text-xs sm:text-sm truncate">
                    {track.artist}
                  </p>
                  {/* Platform availability indicators */}
                  <div className="flex gap-1">
                    {track.spotify && (
                      <div className="w-2 h-2 bg-green-500 rounded-full" title="Available on Spotify" />
                    )}
                    {track.youtube && (
                      <div className="w-2 h-2 bg-red-500 rounded-full" title="Available on YouTube" />
                    )}
                  </div>
                </div>
                {/* Reasoning for mood match */}
                {track.reasoning && (
                  <p className="text-theme-disabled text-xs italic mt-1 truncate">
                    {track.reasoning}
                  </p>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                {/* Popularity Badge - Hidden on very small screens */}
                {track.spotify?.popularity && (
                  <div className="hidden xs:block bg-theme-accent text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold whitespace-nowrap">
                    {track.spotify.popularity}%
                  </div>
                )}
                
                {/* Spotify Button */}
                {track.spotify?.spotifyUrl && (
                  <a 
                    href={track.spotify.spotifyUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-green-600 hover:bg-green-700 text-white rounded-md transition-all duration-300 hover:scale-110 shadow-lg touch-friendly"
                    title="Open in Spotify"
                  >
                    <FaSpotify size={10} className="sm:text-xs" />
                  </a>
                )}

                {/* YouTube Button */}
                {track.youtube?.videoUrl ? (
                  <a 
                    href={track.youtube.videoUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-theme-accent hover:bg-theme-accent-hover text-white rounded-md transition-all duration-300 hover:scale-110 shadow-lg touch-friendly"
                    title="Watch on YouTube"
                  >
                    <FaYoutube size={10} className="sm:text-xs" />
                  </a>
                ) : (
                  <a 
                    href={`https://www.youtube.com/results?search_query=${track.searchQuery}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-theme-accent hover:bg-theme-accent-hover text-white rounded-md transition-all duration-300 hover:scale-110 shadow-lg opacity-75 touch-friendly"
                    title="Search on YouTube"
                  >
                    <FaYoutube size={10} className="sm:text-xs" />
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

