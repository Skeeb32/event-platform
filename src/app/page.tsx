export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Tag } from 'lucide-react';

export default async function Home({ searchParams }: { searchParams: { q?: string } }) {
  const { prisma } = await import('@/lib/prisma');
  // Extract search params dynamically. In Next.js 15, searchParams might be resolved automatically or require awaiting in highly dynamic routes, but for simple MVP this structure suffices.
  const query = searchParams.q || '';
  
  const events = await prisma.event.findMany({
    where: {
      title: { contains: query }
    },
    include: { ticketTiers: true },
    orderBy: { date: 'asc' }
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight text-emerald-600 flex items-center gap-2">
            <Calendar className="text-emerald-500" /> EventHub
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">Sign In</Link>
            <Link href="/register" className="text-sm font-medium px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition">Sign Up</Link>
          </div>
        </div>
      </header>

      {/* Hero Search */}
      <div className="bg-slate-900 py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">Discover Extraordinary Events</h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light">From local meetups to global tech conferences, find your next great experience.</p>
          
          <form className="max-w-2xl mx-auto flex shadow-2xl" action="/">
            <input type="text" name="q" defaultValue={query} placeholder="Search for events..." className="flex-1 px-6 py-4 rounded-l-xl border-0 focus:ring-2 focus:ring-emerald-500 text-lg outline-none" />
            <button type="submit" className="px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-r-xl transition text-lg border border-emerald-500 border-l-0">Search</button>
          </form>
        </div>
      </div>

      {/* Event Grid */}
      <main className="flex-1 container mx-auto px-6 py-16">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Upcoming Events</h2>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="text-xl text-slate-500">No events found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map(event => (
              <Link href={`/events/${event.id}`} key={event.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all group flex flex-col">
                <div className="h-48 bg-slate-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-blue-600 opacity-80 group-hover:scale-110 transition-transform duration-700"></div>
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-bold text-slate-800 shadow-sm flex flex-col items-center">
                    <span className="text-rose-500 text-xs uppercase">{new Intl.DateTimeFormat('en-US', { month: 'short' }).format(event.date)}</span>
                    <span className="text-xl leading-none mt-1">{new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(event.date)}</span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1">{event.title}</h3>
                  <p className="text-slate-500 text-sm mb-5 line-clamp-2 flex-1">{event.description}</p>
                  
                  <div className="space-y-3 mt-auto pt-4 border-t border-slate-100">
                    <div className="flex items-center text-sm text-slate-600 gap-2">
                       <MapPin size={16} className="text-slate-400 shrink-0" /> <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600 gap-2">
                       <Tag size={16} className="text-emerald-500 shrink-0" />
                       <span className="font-semibold text-emerald-600">
                         {event.ticketTiers.length > 0 && Math.min(...event.ticketTiers.map(t => t.price)) > 0
                           ? `From $${Math.min(...event.ticketTiers.map(t => t.price)).toFixed(2)}` 
                           : 'Free'}
                       </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      
      <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm border-t border-slate-800">
         <p>© {new Date().getFullYear()} EventHub. All rights reserved.</p>
      </footer>
    </div>
  );
}
