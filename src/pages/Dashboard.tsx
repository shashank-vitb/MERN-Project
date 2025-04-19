import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { usePlayer } from '../contexts/PlayerContext';
import MusicPlayer from '../components/MusicPlayer';
import { Music, PlayCircle, ListMusic, LogOut, Eye, EyeOff, Trash2, X } from 'lucide-react';
import { endpoints } from '../config/api';

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
            MelodyMaster
          </h1>
        </div>
        <nav className="space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 p-3 rounded-lg hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 transition-all"
          >
            <Music size={20} />
            <span>My Songs</span>
          </Link>
          <Link
            to="/dashboard/playlists"
            className="flex items-center space-x-2 p-3 rounded-lg hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 transition-all"
          >
            <ListMusic size={20} />
            <span>Playlists</span>
          </Link>
          <div className="pt-4 mt-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 p-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition-all w-full"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<Songs />} />
          <Route path="/playlists" element={<Playlists />} />
        </Routes>
      </div>

      <MusicPlayer />
    </div>
  );
};

const Songs: React.FC = () => {
  const [songs, setSongs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState<string | null>(null);
  const { playSong } = usePlayer();

  useEffect(() => {
    fetchSongs();
    fetchPlaylists();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await axios.get(endpoints.songs);
      setSongs(response.data);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get(endpoints.playlists);
      setPlaylists(response.data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('song', file);
    formData.append('title', file.name.replace('.mp3', ''));
    formData.append('artist', 'Unknown');

    try {
      setUploading(true);
      await axios.post(endpoints.songs, formData);
      await fetchSongs();
    } catch (error) {
      console.error('Error uploading song:', error);
    } finally {
      setUploading(false);
    }
  };

  const addSongToPlaylist = async (playlistId: string, songId: string) => {
    try {
      await axios.post(endpoints.playlistSongs(playlistId), {
        songId
      });
      setShowAddToPlaylist(null);
      alert('Song added to playlist!');
    } catch (error) {
      console.error('Error adding song to playlist:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gradient">My Songs</h2>
        <label className="cursor-pointer btn-gradient text-white px-4 py-2 rounded-md font-medium hover:shadow-md transition-all flex items-center">
          <Music size={16} className="mr-2" />
          {uploading ? 'Uploading...' : 'Upload Song'}
          <input
            type="file"
            accept=".mp3"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="grid gap-4">
        {songs.map((song: any) => (
          <div
            key={song._id}
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm card-hover relative"
          >
            <div className="flex items-center">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mr-3">
                <Music size={18} />
              </div>
              <div>
                <h3 className="font-medium">{song.title}</h3>
                <p className="text-sm text-gray-500">{song.artist}</p>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setShowAddToPlaylist(showAddToPlaylist === song._id ? null : song._id)}
                className="p-2 rounded-full hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 transition-colors mr-2"
                title="Add to playlist"
              >
                <ListMusic size={20} />
              </button>
              <button
                onClick={() => playSong(song)}
                className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-600 hover:text-indigo-700 transition-colors"
                title="Play song"
              >
                <PlayCircle size={20} />
              </button>
            </div>
            
            {/* Dropdown menu for adding to playlist */}
            {showAddToPlaylist === song._id && (
              <div className="absolute right-0 mt-2 top-12 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <div className="px-4 py-2 text-sm text-gray-700 font-medium border-b">
                    Add to playlist:
                  </div>
                  {playlists.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      No playlists available
                    </div>
                  ) : (
                    playlists.map((playlist: any) => (
                      <button
                        key={playlist._id}
                        onClick={() => addSongToPlaylist(playlist._id, song._id)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        {playlist.name}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Playlists: React.FC = () => {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [expandedPlaylist, setExpandedPlaylist] = useState<string | null>(null);
  const { playSong } = usePlayer();

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get(endpoints.playlists);
      setPlaylists(response.data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const createPlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) {
      alert('Please enter a playlist name');
      return;
    }
    
    try {
      await axios.post(endpoints.playlists, {
        name: newPlaylistName,
      });
      setNewPlaylistName('');
      await fetchPlaylists();
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  const deletePlaylist = async (playlistId: string) => {
    if (!confirm('Are you sure you want to delete this playlist?')) {
      return;
    }
    
    try {
      await axios.delete(endpoints.playlist(playlistId));
      setExpandedPlaylist(null);
      await fetchPlaylists();
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  const removeSongFromPlaylist = async (playlistId: string, songId: string) => {
    try {
      await axios.delete(endpoints.playlistSong(playlistId, songId));
      await fetchPlaylists();
    } catch (error) {
      console.error('Error removing song from playlist:', error);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gradient">My Playlists</h2>
        <form onSubmit={createPlaylist} className="flex gap-2">
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="New playlist name"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="btn-gradient text-white px-4 py-2 rounded-md font-medium transition-all hover:shadow-md"
          >
            Create Playlist
          </button>
        </form>
      </div>

      <div className="grid gap-4">
        {playlists.map((playlist: any) => (
          <div
            key={playlist._id}
            className="bg-white p-4 rounded-lg shadow-sm card-hover"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mr-3">
                  <ListMusic size={18} />
                </div>
                <div>
                  <h3 className="font-medium">{playlist.name}</h3>
                  <p className="text-sm text-gray-500">
                    {playlist.songs.length} songs
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setExpandedPlaylist(expandedPlaylist === playlist._id ? null : playlist._id)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-indigo-600 hover:text-indigo-800"
                  title={expandedPlaylist === playlist._id ? "Hide songs" : "View songs"}
                >
                  {expandedPlaylist === playlist._id ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button
                  onClick={() => deletePlaylist(playlist._id)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-red-600 hover:text-red-800"
                  title="Delete playlist"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Expanded songs list */}
            {expandedPlaylist === playlist._id && (
              <div className="mt-4 border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Songs in this playlist:</h4>
                {playlist.songs.length === 0 ? (
                  <p className="text-sm text-gray-500">No songs in this playlist yet.</p>
                ) : (
                  <div className="space-y-2">
                    {playlist.songs.map((song: any) => (
                      <div key={song._id} className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                        <div className="flex items-center">
                          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-400 mr-3">
                            <Music size={14} />
                          </div>
                          <div>
                            <p className="font-medium">{song.title}</p>
                            <p className="text-xs text-gray-500">{song.artist}</p>
                          </div>
                        </div>
                        <div className="flex">
                          <button
                            onClick={() => playSong(song)}
                            className="p-1.5 rounded-full hover:bg-indigo-100 text-indigo-500 hover:text-indigo-700 transition-colors mr-1"
                            title="Play song"
                          >
                            <PlayCircle size={18} />
                          </button>
                          <button
                            onClick={() => removeSongFromPlaylist(playlist._id, song._id)}
                            className="p-1.5 rounded-full hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors"
                            title="Remove from playlist"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;