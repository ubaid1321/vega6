import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import upload from '../middleware/upload.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/signup', upload.single('profilePicture'), async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const profilePicture = req.file ? req.file.path : null;

    const user = new User({ email, password: hashedPassword, profilePicture });
    await user.save();

    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ error: 'Signup failed', details: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        email: user.email,
        profilePicture: user.profilePicture,
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

export default router;
