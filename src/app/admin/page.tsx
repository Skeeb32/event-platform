import React from 'react';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 font-medium mb-2">Total Events</h3>
          <p className="text-4xl font-bold text-slate-800">4</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 font-medium mb-2">Total Tickets Sold</h3>
          <p className="text-4xl font-bold text-emerald-600">856</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 font-medium mb-2">Gross Revenue</h3>
          <p className="text-4xl font-bold text-slate-800">$42,850.00</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
           <h2 className="text-xl font-bold text-slate-800">Recent Orders</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-4 font-medium">Order ID</th>
              <th className="p-4 font-medium">Event</th>
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Amount</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="p-4 font-mono text-sm text-slate-500">ord_1234abc</td>
              <td className="p-4 font-medium text-slate-800">Tech Conference 2025</td>
              <td className="p-4 text-slate-600">alex@example.com</td>
              <td className="p-4 font-medium">$299.00</td>
              <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">PAID</span></td>
            </tr>
            <tr>
              <td className="p-4 font-mono text-sm text-slate-500">ord_5678xyz</td>
              <td className="p-4 font-medium text-slate-800">Local Startup Pitch</td>
              <td className="p-4 text-slate-600">sam@example.com</td>
              <td className="p-4 font-medium">$0.00 (Free)</td>
              <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">PAID</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
