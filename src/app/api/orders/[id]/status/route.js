import { NextResponse } from 'next/server';
import { ensureDbReady } from '@/lib/initDb';
import { requireAdmin } from '@/lib/auth';
import { updateOrderStatus } from '@/lib/orders';

export async function PATCH(request, { params }) {
  try {
    await ensureDbReady();
    const admin = await requireAdmin(request);
    if (!admin) return NextResponse.json({ message: 'Not authorized' }, { status: 401 });

    const { id } = await params;
    const { status } = await request.json();
    const order = await updateOrderStatus(id, status);
    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    return NextResponse.json(order);
  } catch (error) {
    const code = error.message === 'Invalid status' ? 400 : 500;
    return NextResponse.json({ message: error.message }, { status: code });
  }
}
