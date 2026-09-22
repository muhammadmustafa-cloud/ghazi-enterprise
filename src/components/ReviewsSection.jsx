'use client';

import { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle } from 'lucide-react';
import staticReviews from '@/data/reviews';

function Stars({ rating, size = 'sm' }) {
  const sz = size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`${sz} ${s <= rating ? 'fill-gold text-gold' : 'fill-line text-line'}`} />
      ))}
    </div>
  );
}

function ReviewCard({ review, dark }) {
  const date = new Date(review.date).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' });
  return (
    <article className={`rounded-2xl p-6 ${dark ? 'border border-line bg-void-card' : 'card-light'}`}>
      <Stars rating={review.rating} />
      <blockquote className={`mt-4 text-sm leading-relaxed ${dark ? 'text-white/60' : 'text-smoke'}`}>
        &ldquo;{review.text}&rdquo;
      </blockquote>
      <footer className={`mt-5 flex items-center gap-3 border-t pt-5 ${dark ? 'border-line' : 'border-line-light'}`}>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blaze/20 text-xs font-bold text-blaze">{review.avatar}</div>
        <div>
          <p className={`text-sm font-bold ${dark ? 'text-white' : ''}`}>{review.author}</p>
          <p className="text-xs text-smoke">{review.location} · {date}</p>
        </div>
      </footer>
    </article>
  );
}

function AddReviewForm({ productId, onReviewAdded, dark }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ author: '', location: '', rating: 0, text: '' });
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!form.rating) return setError('Pick a rating.');
    if (!form.text.trim()) return setError('Write a review.');
    if (!form.author.trim()) return setError('Enter your name.');
    const review = {
      id: `user-${Date.now()}`, author: form.author.trim(),
      location: form.location.trim() || 'Pakistan', rating: form.rating,
      date: new Date().toISOString().split('T')[0], text: form.text.trim(),
      avatar: form.author.trim().split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2), isNew: true,
    };
    const key = `reviews_${productId}`;
    localStorage.setItem(key, JSON.stringify([review, ...JSON.parse(localStorage.getItem(key) || '[]')]));
    onReviewAdded(review);
    setDone(true);
    setTimeout(() => { setDone(false); setOpen(false); setForm({ author: '', location: '', rating: 0, text: '' }); setError(''); }, 2500);
  };

  if (!open) return (
    <button type="button" onClick={() => setOpen(true)} className={dark ? 'btn-ghost mt-10' : 'btn-outline mt-10'}>
      <MessageSquarePlus className="h-4 w-4" /> Write a review
    </button>
  );

  return (
    <form onSubmit={submit} className={`mt-10 rounded-2xl p-8 ${dark ? 'border border-line bg-void-card' : 'card-light'}`}>
      {done ? (
        <div className="py-8 text-center">
          <CheckCircle className="mx-auto h-10 w-10 text-mint" />
          <p className={`mt-3 font-display text-xl font-bold ${dark ? 'text-white' : ''}`}>Published!</p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex justify-between">
            <h3 className={`font-display text-xl font-bold ${dark ? 'text-white' : ''}`}>Your review</h3>
            <button type="button" onClick={() => setOpen(false)} className="text-sm text-smoke">Cancel</button>
          </div>
          {error && <p className="mb-4 text-sm text-blaze">{error}</p>}
          <div className="mb-4 flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} type="button" onClick={() => { setForm((p) => ({ ...p, rating: s })); setError(''); }}>
                <Star className={`h-7 w-7 ${s <= form.rating ? 'fill-gold text-gold' : 'text-line'}`} />
              </button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="input-field" placeholder="Your name *" value={form.author} onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))} required />
            <input className="input-field" placeholder="City" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
          </div>
          <textarea className="input-field mt-4 resize-none" rows={4} placeholder="Your experience..." value={form.text} onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))} required />
          <button type="submit" className="btn-blaze mt-5 !rounded-2xl">Submit</button>
        </>
      )}
    </form>
  );
}

export default function ReviewsSection({ productId = 'home', title, subtitle, limit = 6, dark = false }) {
  const base = staticReviews[productId] || [];
  const saved = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(`reviews_${productId}`) || '[]') : [];
  const [userReviews, setUserReviews] = useState(saved);
  const [showAll, setShowAll] = useState(false);
  const all = [...userReviews, ...base];
  const visible = showAll ? all : all.slice(0, limit);
  const avg = all.length ? (all.reduce((s, r) => s + r.rating, 0) / all.length).toFixed(1) : null;

  return (
    <section className={`py-24 ${dark ? 'section-dark' : 'section-light'}`}>
      <div className="container-main">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className={dark ? 'tag mb-4' : 'tag-dark mb-4'}>Reviews</span>
            <h2 className={`headline-lg ${dark ? 'text-white' : ''}`}>{title || 'What customers say'}</h2>
            {subtitle && <p className={`mt-3 ${dark ? 'text-white/40' : 'text-smoke'}`}>{subtitle}</p>}
          </div>
          {avg && (
            <div className={`flex items-center gap-4 rounded-2xl border px-6 py-4 ${dark ? 'border-line bg-void-card' : 'card-light'}`}>
              <span className={`font-display text-5xl font-extrabold ${dark ? 'text-gold' : 'text-blaze'}`}>{avg}</span>
              <div>
                <Stars rating={Math.round(parseFloat(avg))} size="md" />
                <p className="mt-1 text-xs text-smoke">{all.length} reviews</p>
              </div>
            </div>
          )}
        </div>
        {all.length === 0 ? (
          <p className={`text-center ${dark ? 'text-white/40' : 'text-smoke'}`}>No reviews yet.</p>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((r) => <ReviewCard key={r.id} review={r} dark={dark} />)}
            </div>
            {all.length > limit && !showAll && (
              <button type="button" onClick={() => setShowAll(true)} className={`mx-auto mt-10 block ${dark ? 'btn-ghost' : 'btn-outline'}`}>
                Show all {all.length}
              </button>
            )}
          </>
        )}
        <AddReviewForm productId={productId} onReviewAdded={(r) => setUserReviews((p) => [r, ...p])} dark={dark} />
      </div>
    </section>
  );
}
