'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, getSubtotal } = useCartStore();
  const standard = items.filter((i) => !i.isCustom);
  const custom = items.filter((i) => i.isCustom);
  const subtotal = getSubtotal();
  const delivery = subtotal > 0 ? 500 : 0;
  const total = subtotal + delivery;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-snow pt-28">
        <div className="container-main flex flex-col items-center py-32 text-center">
          <p className="font-display text-6xl font-extrabold text-line-light">EMPTY</p>
          <p className="mt-4 text-smoke">Your cart is empty — time to stock up.</p>
          <Link href="/shop/all" className="btn-blaze mt-8">Browse Catalog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-snow pt-28">
      <PageHeader tag="Cart" title="Your Order" description={`${items.length} item${items.length !== 1 ? 's' : ''} ready to checkout`} />

      <div className="container-main grid gap-10 pb-20 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {standard.length > 0 && (
            <section className="card-light overflow-hidden">
              <div className="border-b border-line-light bg-void px-6 py-4">
                <h2 className="font-display font-bold uppercase tracking-wider text-white">Standard Items</h2>
              </div>
              <ul className="divide-y divide-line-light">
                {standard.map((item) => <CartRow key={item.cartItemId} item={item} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />)}
              </ul>
            </section>
          )}
          {custom.length > 0 && (
            <section className="card-light overflow-hidden border-2 border-blaze/30">
              <div className="border-b border-line-light bg-blaze px-6 py-4">
                <h2 className="font-display font-bold uppercase tracking-wider text-white">Custom Quotes</h2>
              </div>
              <ul className="divide-y divide-line-light">
                {custom.map((item) => <CartRow key={item.cartItemId} item={item} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />)}
              </ul>
            </section>
          )}
        </div>

        <aside className="card-light h-fit p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-xl font-bold uppercase">Summary</h2>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-smoke">Subtotal</dt><dd className="font-bold">Rs {subtotal.toLocaleString()}</dd></div>
            <div className="flex justify-between"><dt className="text-smoke">Delivery</dt><dd className="font-bold">Rs {delivery.toLocaleString()}</dd></div>
          </dl>
          <div className="my-6 h-px bg-line-light" />
          <div className="flex justify-between items-end">
            <span className="font-bold uppercase tracking-wider text-smoke">Total</span>
            <span className="font-display text-4xl font-extrabold text-blaze">Rs {total.toLocaleString()}</span>
          </div>
          <Link href="/checkout" className="btn-blaze mt-8 w-full !rounded-2xl">
            Checkout <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </div>
    </div>
  );
}

function CartRow({ item, updateQuantity, removeFromCart }) {
  const pid = item.id.replace(/-custom-\d+$/, '');
  return (
    <li className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
      <Link href={`/product/${pid}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-void-soft">
        <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={`/product/${pid}`} className="font-display font-bold hover:text-blaze">{item.name}</Link>
        <p className="mt-1 text-xs text-smoke">{item.dimensions} · {item.ply}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="inline-flex items-center rounded-full border border-line-light">
          <button type="button" onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="px-3 py-2"><Minus className="h-3.5 w-3.5" /></button>
          <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
          <button type="button" onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="px-3 py-2"><Plus className="h-3.5 w-3.5" /></button>
        </div>
        <p className="w-24 text-right font-display font-bold">
          {item.isCustom ? <span className="text-xs uppercase text-blaze">Quote</span> : `Rs ${(item.price * item.quantity).toLocaleString()}`}
        </p>
        <button type="button" onClick={() => removeFromCart(item.cartItemId)} className="text-smoke hover:text-blaze"><Trash2 className="h-4 w-4" /></button>
      </div>
    </li>
  );
}
