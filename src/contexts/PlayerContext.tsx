import React, { createContext, useContext, useState, useRef } from 'react';
import { endpoints } from '../config/api';

interface PlayerContextType {
  currentSong: any;
  isPlaying: boolean;
  progress: number;
  volume: number;
  playSong: (song: any) => void;
  togglePlay: () => void;
  seek: (value: number) => void;
  setVolume: (value: number) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSong = (song: any) => {
    setCurrentSong(song);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = endpoints.songFile(song.filePath);
      audioRef.current.play();
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const seek = (value: number) => {
    if (audioRef.current) {
      const time = (value * audioRef.current.duration) / 100;
      audioRef.current.currentTime = time;
      setProgress(value);
    }
  };

  const setVolume = (value: number) => {
    if (audioRef.current) {
      audioRef.current.volume = value;
      setVolumeState(value);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        progress,
        volume,
        playSong,
        togglePlay,
        seek,
        setVolume,
      }}
    >
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current) {
            const value = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setProgress(value);
          }
        }}
        onEnded={() => setIsPlaying(false)}
      />
      {children}
    </PlayerContext.Provider>
  );
};