"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Plus, Trash2, Tag, Loader2 } from 'lucide-react';

export default function CreateEvent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: ''
  });
  
  const [ticketTiers, setTicketTiers] = useState([
    { id: '1', name: 'General Admission', price: '0', capacity: '100' }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTier = () => {
    setTicketTiers([...ticketTiers, { id: Date.now().toString(), name: '', price: '', capacity: '' }]);
  };

  const handleRemoveTier = (id: string) => {
    if (ticketTiers.length > 1) {
      setTicketTiers(ticketTiers.filter(t => t.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const datetime = new Date(`${formData.date}T${formData.time}`).toISOString();

      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          date: datetime,
          ticketTiers: ticketTiers.map(t => ({
            name: t.name,
            price: Number(t.price),
            capacity: Number(t.capacity)
          }))
        })
      });

      if (response.ok) {
        router.push('/admin');
      } else {
        alert('Failed to create event. Ensure Admin Auth.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Create New Event</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Event Details</h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Event Title</label>
              <input required type="text" className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition" placeholder="e.g. Summer Music Festival 2026"
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea required rows={4} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition" placeholder="What is this event about?"
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1"><Calendar size={16}/> Date</label>
                <input required type="date" className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                <input required type="time" className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1"><MapPin size={16}/> Location</label>
              <input required type="text" className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition" placeholder="Venue Address or Online Link"
                value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Ticket Tiers */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b pb-2">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Tag size={20}/> Ticket Tiers</h2>
            <button type="button" onClick={handleAddTier} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              <Plus size={16} /> Add Tier
            </button>
          </div>

          <div className="space-y-4">
            {ticketTiers.map((tier, index) => (
              <div key={tier.id} className="flex gap-4 items-start p-4 bg-slate-50 border border-slate-200 rounded-lg relative">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Tier Name</label>
                  <input required type="text" className="w-full border border-slate-300 rounded-md p-2 text-sm" placeholder="e.g. VIP"
                    value={tier.name} onChange={e => {
                      const newTiers = [...ticketTiers];
                      newTiers[index].name = e.target.value;
                      setTicketTiers(newTiers);
                    }} />
                </div>
                <div className="w-24">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Price ($)</label>
                  <input required type="number" min="0" step="0.01" className="w-full border border-slate-300 rounded-md p-2 text-sm" placeholder="0.00"
                    value={tier.price} onChange={e => {
                      const newTiers = [...ticketTiers];
                      newTiers[index].price = e.target.value;
                      setTicketTiers(newTiers);
                    }} />
                </div>
                <div className="w-24">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Capacity</label>
                  <input required type="number" min="1" className="w-full border border-slate-300 rounded-md p-2 text-sm" placeholder="100"
                    value={tier.capacity} onChange={e => {
                      const newTiers = [...ticketTiers];
                      newTiers[index].capacity = e.target.value;
                      setTicketTiers(newTiers);
                    }} />
                </div>
                {ticketTiers.length > 1 && (
                  <button type="button" onClick={() => handleRemoveTier(tier.id)} className="mt-6 text-rose-500 hover:text-rose-600 p-2">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4 pb-12">
          <button type="button" onClick={() => router.back()} className="px-6 py-3 font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition">Cancel</button>
          <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-6 py-3 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed shadow-md">
            {isLoading && <Loader2 size={18} className="animate-spin" />}
            Publish Event
          </button>
        </div>
      </form>
    </div>
  );
}
