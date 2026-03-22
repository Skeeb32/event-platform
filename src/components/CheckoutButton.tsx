"use client"

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function CheckoutButton({ eventId, ticketTierId, price, name }: { eventId: string, ticketTierId: string, price: number, name: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, ticketTierId })
      });
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Checkout failed. Make sure you are logged in.');
      }
    } catch (err) {
      alert('An error occurred during checkout.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleCheckout} 
      disabled={isLoading}
      className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-500/30 disabled:opacity-75 flex items-center justify-center min-w-[120px]"
    >
      {isLoading ? <Loader2 size={18} className="animate-spin" /> : (price > 0 ? 'Buy Ticket' : 'Claim Free Ticket')}
    </button>
  );
}
