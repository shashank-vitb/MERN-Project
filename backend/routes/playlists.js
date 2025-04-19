import express from 'express';
import { auth } from '../middleware/auth.js';
import Playlist from '../models/Playlist.js';

const router = express.Router();

// Create playlist
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    
    const playlist = new Playlist({
      name,
      creator: req.userId,
      songs: [],
    });

    await playlist.save();
    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's playlists
router.get('/', auth, async (req, res) => {
  try {
    const playlists = await Playlist.find({ creator: req.userId })
      .populate('songs')
      .populate('creator', 'username');
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add song to playlist
router.post('/:id/songs', auth, async (req, res) => {
  try {
    const { songId } = req.body;
    
    const playlist = await Playlist.findOne({
      _id: req.params.id,
      creator: req.userId,
    });

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }

    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove song from playlist
router.delete('/:id/songs/:songId', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findOne({
      _id: req.params.id,
      creator: req.userId,
    });

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    playlist.songs = playlist.songs.filter(
      song => song.toString() !== req.params.songId
    );
    await playlist.save();

    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete playlist
router.delete('/:id', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findOneAndDelete({
      _id: req.params.id,
      creator: req.userId,
    });

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    res.json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;