import { NextResponse } from 'next/server';
import { ensureDbReady } from '@/lib/initDb';
import { requireAdmin } from '@/lib/auth';
import { listCategories, createCategory } from '@/lib/categories';

export async function GET() {
  try {
    await ensureDbReady();
    return NextResponse.json(await listCategories());
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await ensureDbReady();
    const admin = await requireAdmin(request);
    if (!admin) return NextResponse.json({ message: 'Not authorized' }, { status: 401 });

    const body = await request.json();
    await createCategory(body);
    return NextResponse.json({ message: 'Category created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
