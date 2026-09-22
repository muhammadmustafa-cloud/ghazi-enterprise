import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './db';

export async function loginUser(email, password) {
  const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  if (users.length === 0) throw new Error('Invalid credentials');

  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

export async function verifyToken(request) {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    const [users] = await db.execute('SELECT id, name, email, role FROM users WHERE id = ?', [decoded.id]);
    return users[0] || null;
  } catch {
    return null;
  }
}

export async function requireAdmin(request) {
  const user = await verifyToken(request);
  if (!user || user.role !== 'admin') return null;
  return user;
}
