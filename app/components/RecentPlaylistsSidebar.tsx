import React, { useState } from 'react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

interface Track {
  title: string;
  artist: string;
  searchQuery: string;
}

interface Playlist {
  mood: string;
  tracks: Track[];
}

interface RecentPlaylistsSidebarProps {
  playlists: Playlist[];
  onPlaylistSelect: (playlist: Playlist) => void;
}

const RecentPlaylistsSidebar: React.FC<RecentPlaylistsSidebarProps> = ({ playlists, onPlaylistSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlaylistIndex, setSelectedPlaylistIndex] = useState<number | null>(null);

  const handlePlaylistClick = (index: number) => {
    setSelectedPlaylistIndex(index);
    onPlaylistSelect(playlists[index]);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-1/2 -translate-y-1/2 left-0 z-50 p-3 bg-gray-700 text-white rounded-r-md shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 ${
          isOpen ? 'transform translate-x-64' : ''
        }`}
        aria-label={isOpen ? "Close recent playlists" : "Open recent playlists"}
        aria-expanded={isOpen}
      >
        {isOpen ? <FaChevronLeft size={20} /> : <FaChevronRight size={20} />}
      </button>
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-gray-800 p-4 overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? 'transform translate-x-0' : 'transform -translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <h2 className="text-xl font-bold mb-6 text-gray-200">Recent Playlists</h2>
        {playlists.length === 0 ? (
          <p className="text-gray-400">No recent playlists yet.</p>
        ) : (
          playlists.map((playlist, index) => (
            <div 
              key={index} 
              className={`mb-6 p-3 bg-gray-700 rounded-lg shadow-md cursor-pointer transition-colors duration-200 ${
                selectedPlaylistIndex === index ? 'bg-gray-600' : 'hover:bg-gray-650'
              }`}
              onClick={() => handlePlaylistClick(index)}
            >
              <h3 className="text-lg font-semibold mb-2 text-gray-300">{playlist.mood}</h3>
              <ul className="text-sm space-y-1">
                {playlist.tracks.slice(0, 3).map((track, trackIndex) => (
                  <li key={trackIndex} className="text-gray-400 truncate">
                    {track.title} - {track.artist}
                  </li>
                ))}
              </ul>
              {playlist.tracks.length > 3 && (
                <p className="text-gray-500 text-xs mt-2">
                  +{playlist.tracks.length - 3} more
                </p>
              )}
            </div>
          ))
        )}
      </aside>
    </>
  );
};

export default RecentPlaylistsSidebar;
