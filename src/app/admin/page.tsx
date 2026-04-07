"use client";

import { useState, useEffect } from "react";
import { subscribeToBookings, Booking } from "@/lib/bookings";
import { Calendar, Clock, User, Phone, Mail, ChevronRight, LayoutDashboard, Settings, Scissors } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'appointments' | 'services'>('appointments');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      const unsubscribe = subscribeToBookings((data) => {
        setBookings(data);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card w-full max-w-sm text-center">
          <h2 className="text-xl font-bold mb-6">Accès Réservé</h2>
          <input 
            type="password" 
            placeholder="Mot de passe" 
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white mb-4 text-center"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            className="btn-primary w-full justify-center"
            onClick={() => {
              if (password === "mimo2026") { // Mot de passe par défaut
                setIsAuthenticated(true);
              } else {
                alert("Mot de passe incorrect");
              }
            }}
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      {/* Admin Header */}
      <div className="flex justify-between items-center mb-10 px-4">
        <div>
          <h1 className="text-2xl font-bold text-white">MIMO-NDI</h1>
          <p className="text-primary text-sm font-medium">Control Center</p>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={() => setView('appointments')}
            className={`p-2 rounded-lg ${view === 'appointments' ? 'bg-primary text-black' : 'bg-white/5 text-gray-400'}`}
          >
            <LayoutDashboard size={20} />
          </button>
          <button 
            onClick={() => setView('services')}
            className={`p-2 rounded-lg ${view === 'services' ? 'bg-primary text-black' : 'bg-white/5 text-gray-400'}`}
          >
            <Scissors size={20} />
          </button>
        </div>
      </div>

      {view === 'appointments' ? (
        <section className="animate-fade-in px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Calendar size={20} className="text-primary" /> Rendez-vous
            </h2>
            <span className="badge">{bookings.length} au total</span>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500">Chargement...</div>
          ) : bookings.length === 0 ? (
            <div className="glass-card text-center py-20">
              <Calendar size={48} className="mx-auto mb-4 text-gray-700" strokeWidth={1} />
              <p className="text-gray-400">Aucun rendez-vous pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="glass-card border-l-4 border-l-primary">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{booking.customerName}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar size={12} /> {format(booking.dateTime, "eeee d MMMM", { locale: fr })}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock size={12} /> {format(booking.dateTime, "HH:mm")}
                        </span>
                      </div>
                    </div>
                    <span className="badge bg-green-500/10 text-green-500 border-none">Confirmé</span>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-300 flex items-center gap-2">
                      <Scissors size={14} className="text-primary" /> {booking.serviceName}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <a href={`tel:${booking.customerPhone}`} className="btn-outline text-xs py-2 px-3 flex items-center justify-center gap-2">
                      <Phone size={14} /> Appeler
                    </a>
                    {booking.customerEmail && (
                      <a href={`mailto:${booking.customerEmail}`} className="btn-outline text-xs py-2 px-3 flex items-center justify-center gap-2">
                        <Mail size={14} /> Email
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="animate-fade-in px-4">
           <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Scissors size={20} className="text-primary" /> Services
            </h2>
            <div className="glass-card text-center py-10">
              <p className="text-gray-400">Gestion des services bientôt disponible.</p>
            </div>
        </section>
      )}
    </div>
  );
}
