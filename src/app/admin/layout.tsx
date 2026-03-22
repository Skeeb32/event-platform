import React from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 bg-slate-900 text-white p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-8 text-emerald-400">EventHub Admin</h2>
        <nav className="flex flex-col space-y-4">
          <Link href="/admin" className="hover:text-emerald-300 font-medium transition-colors">Dashboard</Link>
          <Link href="/admin/events" className="hover:text-emerald-300 font-medium transition-colors">Manage Events</Link>
          <Link href="/admin/events/new" className="hover:text-emerald-300 font-medium transition-colors">+ Create Event</Link>
          <Link href="/admin/orders" className="hover:text-emerald-300 font-medium transition-colors">Orders & Attendees</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
