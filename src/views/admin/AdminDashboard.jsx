'use client';

import { useEffect } from 'react';

import Link from 'next/link';

import { Package, FolderOpen, ShoppingBag, Trash2, Pencil } from 'lucide-react';

import AdminLayout from '@/components/admin/AdminLayout';

import { useCatalogStore } from '@/store/useCatalogStore';

import { useOrderStore } from '@/store/useOrderStore';



export default function AdminDashboard() {

  const products = useCatalogStore((s) => s.products);

  const categories = useCatalogStore((s) => s.categories);

  const loading = useCatalogStore((s) => s.loading);

  const error = useCatalogStore((s) => s.error);

  const fetchCatalog = useCatalogStore((s) => s.fetchCatalog);

  const deleteProduct = useCatalogStore((s) => s.deleteProduct);

  const deleteCategory = useCatalogStore((s) => s.deleteCategory);

  const getCategoryName = useCatalogStore((s) => s.getCategoryName);

  const orders = useOrderStore((s) => s.orders);

  const fetchOrders = useOrderStore((s) => s.fetchOrders);



  useEffect(() => {

    fetchCatalog();

    fetchOrders();

  }, [fetchCatalog, fetchOrders]);



  const handleDeleteProduct = async (id, name) => {

    if (!window.confirm(`Delete "${name}"?`)) return;

    try {

      await deleteProduct(id);

    } catch (err) {

      alert(err.response?.data?.message || 'Failed to delete product');

    }

  };



  const handleDeleteCategory = async (id, name) => {

    if (!window.confirm(`Delete category "${name}"?`)) return;

    try {

      await deleteCategory(id);

    } catch (err) {

      alert(err.response?.data?.message || 'Failed to delete category');

    }

  };



  return (

    <AdminLayout>

      <div className="mb-8">

        <h1 className="font-display text-3xl font-extrabold uppercase text-white">Dashboard</h1>

        <p className="mt-1 text-sm text-white/40">Connected to backend API</p>

      </div>



      {error && (

        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">

          {error} — make sure backend is running on port 5000

        </div>

      )}



      <div className="mb-10 grid gap-4 sm:grid-cols-4">

        <StatCard icon={Package} label="Products" value={loading ? '…' : products.length} />

        <StatCard icon={FolderOpen} label="Categories" value={loading ? '…' : categories.length} />

        <StatCard icon={ShoppingBag} label="Orders" value={orders.length} />

        <StatCard icon={Package} label="Storage" value="MySQL" />

      </div>



      <section className="mb-12">

        <div className="mb-4 flex items-center justify-between">

          <h2 className="font-display text-xl font-bold uppercase text-white">Products</h2>

          <Link href="/admin/products/add" className="btn-blaze !py-2 !text-xs">+ Add product</Link>

        </div>



        <div className="card-dark overflow-hidden">

          {loading && products.length === 0 ? (

            <p className="p-8 text-center text-white/40">Loading products…</p>

          ) : (

            <table className="w-full text-left text-sm">

              <thead>

                <tr className="border-b border-line text-[10px] font-bold uppercase tracking-widest text-white/40">

                  <th className="p-4">Product</th>

                  <th className="p-4">Category</th>

                  <th className="p-4">Price</th>

                  <th className="p-4">Stock</th>

                  <th className="p-4 text-right">Actions</th>

                </tr>

              </thead>

              <tbody>

                {products.map((p) => (

                  <tr key={p.id} className="border-b border-line/50 hover:bg-white/5">

                    <td className="p-4">

                      <div className="flex items-center gap-3">

                        <img src={p.images?.[0]} alt="" className="h-10 w-10 rounded-lg object-cover" />

                        <div>

                          <p className="font-bold text-white">{p.name}</p>

                          <p className="text-xs text-white/40">{p.id}</p>

                        </div>

                      </div>

                    </td>

                    <td className="p-4 text-white/60">{getCategoryName(p.category)}</td>

                    <td className="p-4 font-bold text-blaze">Rs {Number(p.price).toLocaleString()}</td>

                    <td className="p-4 text-white/60">{Number(p.stock).toLocaleString()}</td>

                    <td className="p-4 text-right">

                      <div className="flex justify-end gap-2">

                        <Link href={`/admin/products/edit/${p.id}`} className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white">

                          <Pencil className="h-4 w-4" />

                        </Link>

                        <button type="button" onClick={() => handleDeleteProduct(p.id, p.name)} className="rounded-lg p-2 text-red-400/60 hover:bg-red-500/10 hover:text-red-400">

                          <Trash2 className="h-4 w-4" />

                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </section>



      <section>

        <div className="mb-4 flex items-center justify-between">

          <h2 className="font-display text-xl font-bold uppercase text-white">Categories</h2>

          <Link href="/admin/categories/add" className="btn-outline !border-white/20 !text-white !py-2 !text-xs">+ Add category</Link>

        </div>



        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {categories.map((cat) => (

            <div key={cat.id} className="card-dark flex items-center gap-4 p-4">

              <img src={cat.image} alt="" className="h-16 w-16 rounded-xl object-cover" />

              <div className="flex-1 min-w-0">

                <p className="font-bold text-white truncate">{cat.name}</p>

                <p className="text-xs text-white/40">{cat.id}</p>

              </div>

              <button type="button" onClick={() => handleDeleteCategory(cat.id, cat.name)} className="rounded-lg p-2 text-red-400/60 hover:bg-red-500/10 hover:text-red-400">

                <Trash2 className="h-4 w-4" />

              </button>

            </div>

          ))}

        </div>

      </section>

    </AdminLayout>

  );

}



function StatCard({ icon: Icon, label, value }) {

  return (

    <div className="card-dark p-5">

      <Icon className="mb-3 h-5 w-5 text-blaze" />

      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">{label}</p>

      <p className="font-display text-2xl font-bold text-white">{value}</p>

    </div>

  );

}

