import express from 'express';
import { auth } from '../middleware/auth.js';
import Song from '../models/Song.js';
import path from 'path';

const router = express.Router();

// Upload song
router.post('/', auth, async (req, res) => {
  try {
    if (!req.files || !req.files.song) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.files.song;
    const { title, artist } = req.body;

    // Generate unique filename
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join('uploads', fileName);

    // Move file to uploads directory
    await file.mv(filePath);

    const song = new Song({
      title,
      artist,
      duration: 0, // You would typically extract this from the audio file
      filePath: fileName,
      uploadedBy: req.userId,
    });

    await song.save();
    res.status(201).json(song);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all songs
router.get('/', auth, async (req, res) => {
  try {
    const songs = await Song.find().populate('uploadedBy', 'username');
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete song
router.delete('/:id', auth, async (req, res) => {
  try {
    const song = await Song.findOneAndDelete({
      _id: req.params.id,
      uploadedBy: req.userId,
    });

    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    res.json({ message: 'Song deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;