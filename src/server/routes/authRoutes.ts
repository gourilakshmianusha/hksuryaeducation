import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { queryOne, run } from '../db';
import { generateToken, authenticateToken, AuthenticatedRequest } from '../auth';

export const authRouter = Router();

// POST /api/auth/register
authRouter.post('/register', (req, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = queryOne('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);
  const userId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const userRole = role === 'admin' ? 'admin' : 'student';

  run(
    `INSERT INTO users (id, email, password_hash, name, role, status) VALUES (?, ?, ?, ?, ?, 'active')`,
    [userId, normalizedEmail, passwordHash, name.trim(), userRole]
  );

  // Also create corresponding student or admin record
  if (userRole === 'admin') {
    run(`INSERT INTO admins (id, user_id, department) VALUES (?, ?, 'Academic Operations')`, [
      `admin-${Date.now()}`,
      userId,
    ]);
  } else {
    run(`INSERT INTO students (id, user_id, target_role) VALUES (?, ?, 'Full Stack Engineer')`, [
      `student-${Date.now()}`,
      userId,
    ]);
  }

  const user = {
    id: userId,
    email: normalizedEmail,
    name: name.trim(),
    role: userRole,
  };

  const token = generateToken(user);
  return res.status(201).json({
    token,
    user,
  });
});

// POST /api/auth/login
authRouter.post('/login', (req, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = queryOne<any>(
    'SELECT id, email, password_hash, name, role, status, bio, avatar FROM users WHERE email = ?',
    [normalizedEmail]
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  if (user.status === 'suspended') {
    return res.status(403).json({ error: 'Account suspended. Please contact admissions support.' });
  }

  const match = bcrypt.compareSync(password, user.password_hash);
  if (!match) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      bio: user.bio,
      avatar: user.avatar,
    },
  });
});

// POST /api/auth/forgot-password
authRouter.post('/forgot-password', (req, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  return res.json({
    message: 'If an account exists for this email, password reset instructions have been dispatched.',
    success: true,
  });
});

// GET /api/auth/me
authRouter.get('/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = queryOne<any>(
    'SELECT id, email, name, role, bio, avatar, created_at FROM users WHERE id = ?',
    [req.user!.id]
  );

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      bio: user.bio,
      avatar: user.avatar,
      createdAt: user.created_at,
    },
  });
});

// PUT /api/auth/profile
authRouter.put('/profile', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { name, bio, avatar, currentPassword, newPassword } = req.body;
  const userId = req.user!.id;

  const user = queryOne<any>('SELECT * FROM users WHERE id = ?', [userId]);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  let newHash = user.password_hash;
  if (newPassword) {
    if (!currentPassword) {
      return res.status(400).json({ error: 'Current password is required to set new password' });
    }
    const match = bcrypt.compareSync(currentPassword, user.password_hash);
    if (!match) {
      return res.status(400).json({ error: 'Incorrect current password' });
    }
    const salt = bcrypt.genSaltSync(10);
    newHash = bcrypt.hashSync(newPassword, salt);
  }

  const updatedName = name ? name.trim() : user.name;
  const updatedBio = bio !== undefined ? bio : user.bio;
  const updatedAvatar = avatar !== undefined ? avatar : user.avatar;

  run(
    `UPDATE users SET name = ?, bio = ?, avatar = ?, password_hash = ?, updated_at = datetime('now') WHERE id = ?`,
    [updatedName, updatedBio, updatedAvatar, newHash, userId]
  );

  return res.json({
    message: 'Profile updated successfully',
    user: {
      id: userId,
      email: user.email,
      name: updatedName,
      role: user.role,
      bio: updatedBio,
      avatar: updatedAvatar,
    },
  });
});
