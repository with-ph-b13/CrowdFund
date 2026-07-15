import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_replace_me';

// Helper to generate token
const generateToken = (user: any) => {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, photoUrl } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Determine initial credits
    let initialCredits = 0;
    if (role === 'Supporter') initialCredits = 50;
    if (role === 'Creator') initialCredits = 20;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      photoUrl,
      credits: initialCredits,
    });

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        credits: newUser.credits,
        photoUrl: newUser.photoUrl,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        credits: user.credits,
        photoUrl: user.photoUrl,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

import { OAuth2Client } from 'google-auth-library';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token: idToken, role = 'Supporter' } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'No Google token provided' });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      console.error('Google token payload missing email or invalid:', payload);
      return res.status(400).json({ message: 'Invalid Google token payload' });
    }

    const { email, name, picture: photoUrl } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if not exists
      let initialCredits = 0;
      if (role === 'Supporter') initialCredits = 50;
      if (role === 'Creator') initialCredits = 20;

      user = await User.create({
        name: name || 'Google User',
        email,
        photoUrl,
        role,
        credits: initialCredits,
      } as any);
    } else {
      // Sync Google profile details if they changed
      if (name && user.name !== name) user.name = name;
      if (photoUrl && user.photoUrl !== photoUrl) user.photoUrl = photoUrl;
      await user.save();
    }

    const token = generateToken(user);

    res.status(200).json({
      message: 'Google login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        credits: user.credits,
        photoUrl: user.photoUrl,
      },
    });
  } catch (error: any) {
    console.error('Google Login Error:', error?.message || error);
    res.status(500).json({ message: 'Internal server error: ' + (error?.message || 'Unknown') });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
