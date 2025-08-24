import React, { useState } from 'react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

interface Track {
  title: string;
  artist: string;
  releaseYear?: number;
  spotifyId?: string;
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
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-1/2 -translate-y-1/2 left-0 z-50 p-1.5 bg-theme-surface text-theme-text rounded-r-md shadow-lg hover:bg-theme-accent focus:outline-none focus:ring-2 focus:ring-theme-accent transition-all duration-300 ${
          isOpen ? 'transform translate-x-64 md:translate-x-80' : ''
        }`}
        aria-label={isOpen ? "Close recent playlists" : "Open recent playlists"}
        aria-expanded={isOpen}
      >
        {isOpen ? <FaChevronLeft size={20} /> : <FaChevronRight size={20} />}
      </button>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      ></div>
      <aside
        className={`fixed left-0 top-0 h-full w-64 md:w-80 bg-theme-background p-6 overflow-y-auto transition-transform duration-300 ease-in-out z-50 shadow-lg border-r border-theme-disabled ${
          isOpen ? 'transform translate-x-0' : 'transform -translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <h2 className="text-2xl font-bold mb-6 text-theme-text">Recent Playlists</h2>
        {playlists.length === 0 ? (
          <p className="text-base text-theme-disabled">No recent playlists yet.</p>
        ) : (
          playlists.map((playlist, index) => (
            <div 
              key={index} 
              className={`mb-4 p-4 bg-theme-surface rounded-lg shadow-md cursor-pointer transition-colors duration-200 transform hover:scale-104 border border-theme-disabled ${
                selectedPlaylistIndex === index ? 'bg-theme-accent bg-opacity-20 border-theme-accent' : 'hover:bg-theme-background hover:border-theme-accent'
              }`}
              onClick={() => handlePlaylistClick(index)}
            >
              <h3 className={`text-lg font-semibold mb-2 ${selectedPlaylistIndex === index ? 'text-white' : 'text-theme-text'}`}>{playlist.mood}</h3>
              <ul className="text-sm space-y-1">
                {playlist.tracks.slice(0, 3).map((track, trackIndex) => (
                  <li key={trackIndex} className={`truncate ${selectedPlaylistIndex === index ? 'text-white opacity-90' : 'text-theme-disabled'}`}>
                    {track.title} - {track.artist}
                  </li>
                ))}
              </ul>
              {playlist.tracks.length > 3 && (
                <p className={`text-xs mt-2 opacity-70 ${selectedPlaylistIndex === index ? 'text-white' : 'text-theme-disabled'}`}>
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