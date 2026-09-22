'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useOrderStore } from '@/store/useOrderStore';
import clsx from 'clsx';

const STATUSES = ['pending', 'confirmed', 'delivered', 'cancelled'];

const statusStyle = {
  pending: 'bg-gold/20 text-gold',
  confirmed: 'bg-blaze/20 text-blaze',
  delivered: 'bg-mint/20 text-mint',
  cancelled: 'bg-red-500/20 text-red-400',
};

export default function AdminOrders() {
  const orders = useOrderStore((s) => s.orders);
  const loading = useOrderStore((s) => s.loading);
  const error = useOrderStore((s) => s.error);
  const fetchOrders = useOrderStore((s) => s.fetchOrders);
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);
  const deleteOrder = useOrderStore((s) => s.deleteOrder);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold uppercase text-white">Orders</h1>
          <p className="mt-1 text-sm text-white/40">{orders.length} total · from database</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field w-auto min-w-[160px] !bg-void-soft !text-white"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      {loading && orders.length === 0 ? (
        <div className="card-dark py-20 text-center text-white/40">Loading orders…</div>
      ) : filtered.length === 0 ? (
        <div className="card-dark flex flex-col items-center py-20 text-center">
          <ShoppingBag className="h-12 w-12 text-white/20" />
          <p className="mt-4 font-display text-xl font-bold text-white">No orders yet</p>
          <p className="mt-2 max-w-sm text-sm text-white/40">
            Place a test order from the shop checkout — it will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => {
            const open = expanded === order.id;
            return (
              <div key={order.id} className="card-dark overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpanded(open ? null : order.id)}
                  className="flex w-full items-center gap-4 p-5 text-left hover:bg-white/5"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-display text-lg font-bold text-white">{order.id}</span>
                      <span className={clsx('rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider', statusStyle[order.status])}>
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-white/50">
                      {order.customer.firstName} {order.customer.lastName} · {order.customer.phone}
                    </p>
                    <p className="text-xs text-white/30">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl font-bold text-blaze">Rs {order.total.toLocaleString()}</p>
                    <p className="text-xs text-white/40">{order.items.length} item(s)</p>
                  </div>
                  {open ? <ChevronUp className="h-5 w-5 shrink-0 text-white/40" /> : <ChevronDown className="h-5 w-5 shrink-0 text-white/40" />}
                </button>

                {open && (
                  <div className="border-t border-line p-5">
                    <div className="grid gap-6 lg:grid-cols-2">
                      <div>
                        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-white/40">Customer</h3>
                        <dl className="space-y-2 text-sm">
                          <Row label="Name" value={`${order.customer.firstName} ${order.customer.lastName}`} />
                          <Row label="Phone" value={order.customer.phone} />
                          <Row label="Address" value={order.customer.address} />
                          <Row label="City" value={order.customer.city} />
                        </dl>
                      </div>
                      <div>
                        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-white/40">Order info</h3>
                        <dl className="space-y-2 text-sm">
                          <Row label="Delivery" value={order.delivery === 'express' ? 'Express (same day)' : 'Standard (2–3 days)'} />
                          <Row label="Payment" value={order.payment === 'bank' ? 'Bank transfer' : 'Cash on delivery'} />
                          <Row label="Subtotal" value={`Rs ${order.subtotal.toLocaleString()}`} />
                          <Row label="Delivery fee" value={`Rs ${order.deliveryFee.toLocaleString()}`} />
                        </dl>
                      </div>
                    </div>

                    <h3 className="mb-3 mt-6 text-[10px] font-bold uppercase tracking-widest text-white/40">Items</h3>
                    <div className="overflow-x-auto rounded-xl border border-line">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-line text-[10px] font-bold uppercase tracking-widest text-white/40">
                            <th className="p-3">Product</th>
                            <th className="p-3">Qty</th>
                            <th className="p-3">Unit</th>
                            <th className="p-3 text-right">Line total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item) => (
                            <tr key={item.cartItemId} className="border-b border-line/50">
                              <td className="p-3">
                                <p className="font-bold text-white">{item.name}</p>
                                {item.isCustom && <span className="text-xs text-blaze">Custom quote</span>}
                              </td>
                              <td className="p-3 text-white/60">{item.quantity}</td>
                              <td className="p-3 text-white/60">
                                {item.isCustom ? '—' : `Rs ${item.price.toLocaleString()}`}
                              </td>
                              <td className="p-3 text-right font-bold text-white">
                                {item.isCustom ? 'Quote pending' : `Rs ${(item.price * item.quantity).toLocaleString()}`}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-4">
                      <div>
                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-white/40">Update status</label>
                        <select
                          value={order.status}
                          onChange={async (e) => {
                            try {
                              await updateOrderStatus(order.id, e.target.value);
                            } catch (err) {
                              alert(err.response?.data?.message || 'Failed to update status');
                            }
                          }}
                          className="input-field !bg-void !text-white"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!window.confirm(`Delete order ${order.id}?`)) return;
                          try {
                            await deleteOrder(order.id);
                          } catch (err) {
                            alert(err.response?.data?.message || 'Failed to delete order');
                          }
                        }}
                        className="mt-5 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex gap-2">
      <dt className="w-24 shrink-0 text-white/40">{label}</dt>
      <dd className="text-white">{value}</dd>
    </div>
  );
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-PK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
