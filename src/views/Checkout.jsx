'use client';

import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation'
import Link from 'next/link';

import { useCartStore } from '@/store/useCartStore';

import { useOrderStore } from '@/store/useOrderStore';

import { CheckCircle2 } from 'lucide-react';

import PageHeader from '@/components/ui/PageHeader';

import clsx from 'clsx';



const emptyCustomer = { firstName: '', lastName: '', address: '', phone: '', city: 'Karachi' };



export default function Checkout() {

  const { items, getSubtotal, clearCart } = useCartStore();

  const addOrder = useOrderStore((s) => s.addOrder);

  const router = useRouter();



  const [placed, setPlaced] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState(null);

  const [payment, setPayment] = useState('cod');

  const [delivery, setDelivery] = useState('standard');

  const [customer, setCustomer] = useState(emptyCustomer);



  const subtotal = getSubtotal();

  const deliveryFee = subtotal > 0 ? (delivery === 'express' ? 1000 : 500) : 0;

  const total = subtotal + deliveryFee;

  const customItems = items.filter((i) => i.isCustom);

  useEffect(() => {
    if (items.length === 0 && !placed) router.replace('/cart');
  }, [items.length, placed, router]);

  if (items.length === 0 && !placed) return null;



  const setField = (key, val) => setCustomer((c) => ({ ...c, [key]: val }));



  const handleSubmit = async (e) => {

    e.preventDefault();

    setSubmitting(true);

    setError(null);



    try {

      const order = await addOrder({

        customer,

        delivery,

        payment,

        items: items.map(({ cartItemId, id, name, price, quantity, isCustom, customDetails }) => ({

          cartItemId,

          id,

          name,

          price,

          quantity,

          isCustom,

          customDetails,

        })),

        subtotal,

        deliveryFee,

        total,

      });



      setPlaced(order);

      setTimeout(() => clearCart(), 100);

    } catch (err) {

      setError(err.response?.data?.message || 'Failed to place order. Is the backend running?');

    } finally {

      setSubmitting(false);

    }

  };



  if (placed) {

    return (

      <div className="flex min-h-screen flex-col items-center justify-center bg-snow pt-28 text-center">

        <CheckCircle2 className="h-16 w-16 text-mint" />

        <h1 className="headline-lg mt-6">Order Confirmed!</h1>

        <p className="mt-4 max-w-md text-smoke">Order <strong>{placed.id}</strong> received.</p>

        {customItems.length > 0 && <p className="mt-4 max-w-md text-sm text-blaze">Custom quotes will be reviewed within 24h.</p>}

        <Link href="/" className="btn-blaze mt-10">Back Home</Link>

      </div>

    );

  }



  return (

    <div className="min-h-screen bg-snow pt-28">

      <PageHeader tag="Checkout" title="Almost There" />

      <form onSubmit={handleSubmit} className="container-main grid gap-10 pb-20 lg:grid-cols-[1fr_380px]">

        <div className="space-y-6">

          {error && (

            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>

          )}

          <section className="card-light p-6 md:p-8">

            <h2 className="font-display text-lg font-bold uppercase">Delivery Info</h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">

              <Field label="First name *" value={customer.firstName} onChange={(e) => setField('firstName', e.target.value)} required />

              <Field label="Last name *" value={customer.lastName} onChange={(e) => setField('lastName', e.target.value)} required />

              <div className="sm:col-span-2">

                <Field label="Address *" value={customer.address} onChange={(e) => setField('address', e.target.value)} required />

              </div>

              <Field label="Phone *" type="tel" value={customer.phone} onChange={(e) => setField('phone', e.target.value)} required />

              <Field label="City *" value={customer.city} onChange={(e) => setField('city', e.target.value)} required />

            </div>

          </section>

          <section className="card-light p-6 md:p-8">

            <h2 className="font-display text-lg font-bold uppercase">Delivery</h2>

            <div className="mt-4 space-y-3">

              <Radio checked={delivery === 'standard'} onChange={() => setDelivery('standard')} title="Standard (2–3 days)" price="Rs 500" />

              <Radio checked={delivery === 'express'} onChange={() => setDelivery('express')} title="Express (same day)" price="Rs 1,000" />

            </div>

          </section>

          <section className="card-light p-6 md:p-8">

            <h2 className="font-display text-lg font-bold uppercase">Payment</h2>

            <div className="mt-4 space-y-3">

              <Radio checked={payment === 'cod'} onChange={() => setPayment('cod')} title="Cash on delivery" />

              <Radio checked={payment === 'bank'} onChange={() => setPayment('bank')} title="Bank transfer" />

            </div>

          </section>

        </div>

        <aside className="card-light h-fit p-6 lg:sticky lg:top-28">

          <h2 className="font-display font-bold uppercase">Summary</h2>

          <ul className="mt-4 max-h-40 space-y-3 overflow-y-auto text-sm">

            {items.map((item) => (

              <li key={item.cartItemId} className="flex justify-between">

                <span className="line-clamp-1">{item.name}</span>

                {!item.isCustom && <span className="font-bold">Rs {(item.price * item.quantity).toLocaleString()}</span>}

              </li>

            ))}

          </ul>

          <div className="my-4 h-px bg-line-light" />

          <div className="flex justify-between text-sm"><span className="text-smoke">Total</span><span className="font-display text-3xl font-extrabold text-blaze">Rs {total.toLocaleString()}</span></div>

          <button type="submit" disabled={submitting} className="btn-blaze mt-6 w-full !rounded-2xl">

            {submitting ? 'Placing order…' : 'Place Order'}

          </button>

        </aside>

      </form>

    </div>

  );

}



function Field({ label, ...props }) {

  return (<div><label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-smoke">{label}</label><input className="input-field" {...props} /></div>);

}



function Radio({ checked, onChange, title, price }) {

  return (

    <label className={clsx('flex cursor-pointer items-center justify-between rounded-xl border-2 p-4', checked ? 'border-blaze bg-blaze/5' : 'border-line-light')}>

      <div className="flex items-center gap-3"><input type="radio" checked={checked} onChange={onChange} className="accent-blaze" /><span className="font-bold">{title}</span></div>

      {price && <span className="font-bold text-blaze">{price}</span>}

    </label>

  );

}

