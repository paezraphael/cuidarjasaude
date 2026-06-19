/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Monitor, Check, Calendar, Bus } from 'lucide-react';

export default function AdminView() {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/bookings')
      .then(res => res.json())
      .then(setBookings)
      .catch(console.error);
  }, []);

  const handleApproveBooking = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved', driver: 'Motorista Alocado' })
      });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map(b => b.id === id ? data.booking : b));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans">
      <header className="bg-slate-900 text-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Monitor size={28} className="text-blue-400" />
          <h1 className="text-xl font-black">Central Administrativa de Frotas</h1>
        </div>
        <div className="text-sm font-bold bg-blue-900 px-3 py-1 rounded-full text-blue-100">
          Operador Logado
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto p-6 space-y-8 mt-6">
        <div className="flex items-center gap-3 border-b-2 border-slate-200 pb-4">
          <h2 className="text-2xl font-extrabold flex items-center gap-2">
            <Calendar className="text-blue-600" /> Solicitações Pendentes ATENDE
          </h2>
        </div>

        <div className="grid gap-4">
          {bookings.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center shadow-sm">
              <Bus size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-xl font-bold text-slate-500">Nenhum agendamento pendente no momento.</p>
              <p className="text-sm font-semibold text-slate-400 mt-2">Novas solicitações via aplicativo aparecerão aqui automaticamente.</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition hover:shadow-md">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black uppercase text-slate-500 tracking-wider">ID: #{booking.id.substring(booking.id.length - 4)}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-sm font-bold text-blue-700">Via App Mobile</span>
                  </div>
                  <h4 className="text-xl font-extrabold text-slate-800">Data da Viagem: {booking.date}</h4>
                  <p className="text-base font-bold text-slate-600">📍 Destino: {booking.destination}</p>
                  <p className="text-base font-bold text-slate-600">📋 Finalidade: {booking.purpose}</p>
                  
                  <div className="mt-3 inline-flex">
                    {booking.status === 'pending' ? (
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded font-black text-xs uppercase border border-yellow-200 flex items-center gap-1">
                        🟡 Aguardando Alocação
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded font-black text-xs uppercase border border-emerald-200 flex items-center gap-1">
                        <Check size={14} /> Aprovado: {booking.driver}
                      </span>
                    )}
                  </div>
                </div>

                {booking.status === 'pending' && (
                  <button 
                    onClick={() => handleApproveBooking(booking.id)}
                    className="bg-blue-600 text-white font-black py-3 px-8 rounded-xl hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-md active:scale-95"
                  >
                    Aprovar & Alocar Motorista
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
