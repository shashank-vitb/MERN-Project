import React from 'react';
import { Play, Pause, Volume2, SkipBack, SkipForward } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';

const MusicPlayer: React.FC = () => {
  const { currentSong, isPlaying, progress, volume, togglePlay, seek, setVolume } = usePlayer();

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 player-container p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <button
              className="p-2 rounded-full hover:bg-gray-100 text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <SkipBack size={24} />
            </button>
            <button
              onClick={togglePlay}
              className="p-3 rounded-full btn-gradient text-white mx-1 shadow-md transition-all hover:shadow-lg"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
              className="p-2 rounded-full hover:bg-gray-100 text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <SkipForward size={24} />
            </button>
          </div>
          <div>
            <h3 className="font-medium truncate max-w-xs">{currentSong.title}</h3>
            <p className="text-sm text-gray-500 truncate max-w-xs">{currentSong.artist}</p>
          </div>
        </div>

        <div className="flex-1 mx-8">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => seek(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Volume2 size={20} className="text-gray-600" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;