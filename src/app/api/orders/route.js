import { NextResponse } from 'next/server';
import { ensureDbReady } from '@/lib/initDb';
import { requireAdmin } from '@/lib/auth';
import { createOrder, listOrders } from '@/lib/orders';

export async function GET(request) {
  try {
    await ensureDbReady();
    const admin = await requireAdmin(request);
    if (!admin) return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    return NextResponse.json(await listOrders());
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await ensureDbReady();
    const body = await request.json();
    const order = await createOrder(body);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    const status = error.message.includes('Missing') ? 400 : 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}
