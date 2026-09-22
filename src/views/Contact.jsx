'use client';

import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_EMAIL_SECONDARY, CONTACT_PHONE, CONTACT_PHONE_SECONDARY, WHATSAPP_URL } from '@/config/env';

const items = [
  { icon: MapPin, l: 'Address', v: [CONTACT_ADDRESS] },
  { icon: Phone, l: 'Phone', v: [CONTACT_PHONE, CONTACT_PHONE_SECONDARY] },
  { icon: Mail, l: 'Email', v: [CONTACT_EMAIL, CONTACT_EMAIL_SECONDARY] },
  { icon: Clock, l: 'Hours', v: ['Mon–Sat: 9AM – 6PM', 'Sunday: Closed'] },
];

export default function Contact() {
  return (
    <div className="bg-snow min-h-screen">
      <PageHeader tag="Contact" title="Let's Talk Packaging" description="Bulk orders, custom builds, or general questions — we respond within one business day." />

      <div className="container-main grid gap-10 pb-20 lg:grid-cols-3">
        <aside className="space-y-4">
          {items.map(({ icon: Icon, l, v }) => (
            <div key={l} className="card-light p-6">
              <Icon className="mb-3 h-5 w-5 text-blaze" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-smoke">{l}</p>
              {v.map((line) => <p key={line} className="mt-1 text-sm">{line}</p>)}
            </div>
          ))}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-blaze w-full !rounded-2xl">WhatsApp Us</a>
        </aside>

        <form className="card-light p-8 lg:col-span-2" onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
          <h2 className="font-display text-2xl font-bold">Send a message</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <Field label="Name *" required />
            <Field label="Company" />
            <Field label="Email *" type="email" required />
            <Field label="Phone *" type="tel" required placeholder={CONTACT_PHONE} />
          </div>
          <div className="mt-5">
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-smoke">Subject *</label>
            <select required className="input-field">
              <option value="">Select...</option>
              <option value="bulk">Bulk order</option>
              <option value="custom">Custom quote</option>
              <option value="support">Support</option>
            </select>
          </div>
          <div className="mt-5">
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-smoke">Message *</label>
            <textarea required rows={5} className="input-field resize-none" placeholder="Tell us what you need..." />
          </div>
          <button type="submit" className="btn-blaze mt-8 !rounded-2xl"><Send className="h-4 w-4" /> Send</button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-smoke">{label}</label>
      <input className="input-field" {...props} />
    </div>
  );
}
