import { NextResponse } from 'next/server';
import { ensureDbReady } from '@/lib/initDb';
import { requireAdmin } from '@/lib/auth';
import { getProduct, updateProduct, removeProduct } from '@/lib/products';

export async function GET(_request, { params }) {
  try {
    await ensureDbReady();
    const { id } = await params;
    const product = await getProduct(id);
    if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await ensureDbReady();
    const admin = await requireAdmin(request);
    if (!admin) return NextResponse.json({ message: 'Not authorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    await updateProduct(id, body);
    return NextResponse.json({ message: 'Product updated successfully' });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await ensureDbReady();
    const admin = await requireAdmin(request);
    if (!admin) return NextResponse.json({ message: 'Not authorized' }, { status: 401 });

    const { id } = await params;
    const ok = await removeProduct(id);
    if (!ok) return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
