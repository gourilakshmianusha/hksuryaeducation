import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { queryOne } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'hksurya-secure-jwt-secret-key-2026';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'student' | 'trainer' | 'admin';
    name: string;
  };
}

export function generateToken(user: { id: string; email: string; role: string; name: string }): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  // Ensure user still exists and is active from SQLite
  const user = queryOne<{ id: string; email: string; role: any; name: string; status: string }>(
    'SELECT id, email, role, name, status FROM users WHERE id = ?',
    [decoded.id]
  );

  if (!user || user.status === 'suspended') {
    return res.status(403).json({ error: 'User account suspended or not found' });
  }

  req.user = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };

  next();
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  authenticateToken(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin authorization required' });
    }
    next();
  });
}

