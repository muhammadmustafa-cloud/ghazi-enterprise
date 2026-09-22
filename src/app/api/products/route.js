import { NextResponse } from 'next/server';
import { ensureDbReady } from '@/lib/initDb';
import { requireAdmin } from '@/lib/auth';
import { listProducts, createProduct } from '@/lib/products';

export async function GET() {
  try {
    await ensureDbReady();
    const products = await listProducts();
    return NextResponse.json(products);
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
    await createProduct(body);
    return NextResponse.json({ message: 'Product created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
