import { motion } from 'framer-motion'

interface Track {
  title: string
  artist: string
  searchQuery: string
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
      className="bg-gray-800 rounded-lg p-4 md:p-6 w-full shadow-lg"
    >
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-neon-purple">🫵's Mood-Based Playlist</h2>
      <ul className="space-y-3">
        {tracks.map((track, index) => (
          <motion.li 
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center bg-gray-700 p-2 md:p-3 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            <span className="mr-2 md:mr-3 text-neon-purple opacity-75">{index + 1}.</span>
            <div className="flex-grow">
              <a 
                href={`https://www.youtube.com/results?search_query=${track.searchQuery}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium text-sm md:text-base text-gray-100 hover:text-neon-purple transition duration-300"
              >
                {track.title}
              </a>
              <span className="mx-1 md:mx-2 text-gray-400">-</span>
              <span className="text-xs md:text-sm text-gray-400">{track.artist}</span>
            </div>
            <a 
              href={`https://www.youtube.com/results?search_query=${track.searchQuery}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 text-blue-neon opacity-75 hover:opacity-100 transition duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </a>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )

}

