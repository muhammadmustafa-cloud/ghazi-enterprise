import { NextResponse } from 'next/server';
import { ensureDbReady } from '@/lib/initDb';
import { requireAdmin } from '@/lib/auth';
import { removeOrder } from '@/lib/orders';

export async function DELETE(request, { params }) {
  try {
    await ensureDbReady();
    const admin = await requireAdmin(request);
    if (!admin) return NextResponse.json({ message: 'Not authorized' }, { status: 401 });

    const { id } = await params;
    const ok = await removeOrder(id);
    if (!ok) return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    return NextResponse.json({ message: 'Order deleted' });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
