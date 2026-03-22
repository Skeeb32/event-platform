export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import React from 'react';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import Link from 'next/link';
import { Ticket, Calendar, MapPin, Tag } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function UserDashboard({ searchParams }: { searchParams: { success?: string } }) {
  const { prisma } = await import('@/lib/prisma');
  const token = (await cookies()).get('token')?.value;
  if (!token) return redirect('/login');

  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your_jwt_secret_here');
  let userId;
  try {
    const { payload } = await jwtVerify(token, secret);
    userId = payload.userId as string;
  } catch (e) {
    return redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: {
        include: {
           event: true,
           ticketTier: true
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) return redirect('/login');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight text-emerald-600">EventHub</Link>
          <div className="flex items-center gap-4">
             <span className="text-sm font-medium text-slate-600">Hello, {user.name}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-12 max-w-4xl">
        {searchParams.success === 'true' && (
          <div className="mb-8 p-4 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl flex items-center justify-between shadow-sm transition-all transform animate-in slide-in-from-top-4">
             <span className="font-semibold flex items-center gap-2">🎉 Payment successful! Your order has been processed.</span>
          </div>
        )}

        <h1 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
          <Ticket className="text-emerald-500" /> My Tickets
        </h1>

        {user.orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
             <p className="text-slate-500 mb-4 text-lg">You haven't bought any tickets yet.</p>
             <Link href="/" className="text-emerald-600 font-bold hover:text-emerald-700 transition px-6 py-3 bg-emerald-50 rounded-xl inline-block">Find an event</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {user.orders.map(order => (
              <div key={order.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-8 hover:shadow-md transition">
                {/* QR Code */}
                <div className="shrink-0 mx-auto sm:mx-0 bg-slate-50 p-4 rounded-2xl border border-slate-100 hidden sm:block">
                  <img src={order.qrCodeUrl || ''} alt="Ticket QR" className="w-32 h-32 rounded-lg mix-blend-multiply" />
                </div>
                
                {/* Info */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-3">
                     <h3 className="text-2xl font-bold text-slate-800">{order.event.title}</h3>
                     <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl uppercase tracking-wider">{order.status}</span>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <p className="text-slate-600 flex items-center gap-2 font-medium">
                       <Calendar size={18} className="text-emerald-500 shrink-0" />
                       {new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(order.event.date)}
                    </p>
                    <p className="text-slate-600 flex items-center gap-2 font-medium">
                       <MapPin size={18} className="text-emerald-500 shrink-0" />
                       {order.event.location}
                    </p>
                  </div>
                  
                  <div className="mt-auto flex justify-between items-center text-sm border-t border-slate-100 pt-5">
                     <div className="font-bold text-slate-800 flex items-center gap-2">
                       <Tag size={16} className="text-slate-400"/>
                       {order.ticketTier.name} • 1x
                     </div>
                     <span className="text-slate-400 font-mono text-xs uppercase bg-slate-100 px-2 py-1 rounded">ID: {order.id.slice(0, 8)}...</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
