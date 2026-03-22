export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import React from 'react';
import { Calendar, MapPin, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CheckoutButton from '@/components/CheckoutButton';
import { notFound } from 'next/navigation';

export default async function EventDetail({ params }: { params: { id: string } }) {
  const { prisma } = await import('@/lib/prisma');
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: { ticketTiers: true }
  });

  if (!event) return notFound();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="flex items-center text-sm font-semibold text-slate-500 hover:text-slate-800 transition">
            <ArrowLeft size={16} className="mr-2" /> Back to Discover
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-10">
            <div className="h-72 sm:h-[450px] bg-slate-200 rounded-3xl relative overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 to-blue-900/90"></div>
                <div className="absolute bottom-10 left-10 right-10">
                   <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-widest mb-4 inline-block">Official Event</span>
                   <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-md">{event.title}</h1>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">About this Event</h2>
              <p className="text-slate-600 leading-relaxed font-medium text-lg whitespace-pre-wrap">{event.description}</p>
            </div>
          </div>

          {/* Sidebar / Tickets */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-8">
              <div>
                <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-3">Date & Time</h3>
                <div className="flex items-start text-slate-800">
                  <Calendar className="mt-0.5 mr-3 text-emerald-500 shrink-0" size={20} />
                  <div>
                    <p className="font-semibold">{new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(event.date)}</p>
                    <p className="text-slate-500 mt-1">{new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(event.date)}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-3">Location</h3>
                <div className="flex items-start text-slate-800">
                  <MapPin className="mt-0.5 mr-3 text-emerald-500 shrink-0" size={20} />
                  <p className="font-semibold">{event.location}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl text-white outline outline-4 outline-slate-900/10">
              <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><Tag className="text-emerald-400" size={20}/> Available Tickets</h3>
              
              <div className="space-y-4">
                {event.ticketTiers.map(tier => (
                  <div key={tier.id} className="p-5 bg-slate-800 rounded-2xl border border-slate-700 hover:border-slate-500 transition-colors flex flex-col gap-5">
                    <div className="flex justify-between items-start">
                       <div>
                         <h4 className="font-bold text-lg">{tier.name}</h4>
                         <p className="text-emerald-400 font-bold text-xl mt-1">${tier.price.toFixed(2)}</p>
                       </div>
                    </div>
                    <CheckoutButton eventId={event.id} ticketTierId={tier.id} price={tier.price} name={event.title} />
                  </div>
                ))}
                
                {event.ticketTiers.length === 0 && (
                   <div className="text-center py-6 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed">
                      <p className="text-slate-400 italic font-medium">No tickets currently scheduled.</p>
                   </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
