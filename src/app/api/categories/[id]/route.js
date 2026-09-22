import { NextResponse } from 'next/server';
import { ensureDbReady } from '@/lib/initDb';
import { requireAdmin } from '@/lib/auth';
import { removeCategory } from '@/lib/categories';

export async function DELETE(request, { params }) {
  try {
    await ensureDbReady();
    const admin = await requireAdmin(request);
    if (!admin) return NextResponse.json({ message: 'Not authorized' }, { status: 401 });

    const { id } = await params;
    const ok = await removeCategory(id);
    if (!ok) return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    const status = error.message.includes('Cannot delete') ? 400 : 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}
