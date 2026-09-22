import { NextResponse } from 'next/server';
import { ensureDbReady } from '@/lib/initDb';
import { loginUser } from '@/lib/auth';

export async function POST(request) {
  try {
    await ensureDbReady();
    const { email, password } = await request.json();
    const data = await loginUser(email, password);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Invalid credentials' }, { status: 401 });
  }
}
