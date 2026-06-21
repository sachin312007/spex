import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Users, Map, Clock, ShieldCheck, XCircle, Notebook, LogIn, ChevronRight, Check } from 'lucide-react';
import { Reservation, UserProfile } from '../types';

interface ReservationsSectionProps {
  user: UserProfile | null;
  reservations: Reservation[];
  onAddReservation: (newRes: Omit<Reservation, 'id' | 'status' | 'createdAt'>) => void;
  onCancelReservation: (id: string) => void;
  toggleLoginModal: () => void;
}

export default function ReservationsSection({
  user,
  reservations,
  onAddReservation,
  onCancelReservation,
  toggleLoginModal
}: ReservationsSectionProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:00');
  const [guests, setGuests] = useState(2);
  const [seatingArea, setSeatingArea] = useState('Premium Indoor Lounge');
  const [requests, setRequests] = useState('');

  // Guest fields if user not logged in
  const [gName, setGName] = useState('');
  const [gEmail, setGEmail] = useState('');
  const [gPhone, setGPhone] = useState('');

  const activeReservations = React.useMemo(() => {
    return reservations.filter((r) => r.status === 'Confirmed');
  }, [reservations]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      alert('Please select a valid date and session hour.');
      return;
    }

    const name = user?.name || gName;
    const email = user?.email || gEmail;
    const phone = user?.phone || gPhone;

    if (!name || !email || !phone) {
      alert('A valid name, email, and phone contact is required to hold private dining lounge chairs.');
      return;
    }

    onAddReservation({
      name,
      email,
      phone,
      date,
      time,
      guests,
      seatingArea,
      specialRequests: requests || undefined,
    });

    // Reset fields
    setDate('');
    setRequests('');
    setGName('');
    setGEmail('');
    setGPhone('');
  };

  return (
    <div className="bg-[#070707] py-16 sm:py-24 border-t border-neutral-900 select-none overflow-hidden relative">
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-[#FF5A1F]/[0.01] filter blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Intro header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#FF5A1F] uppercase font-mono tracking-[0.2em] inline-block">LUXURY PRIVATE RESERVATIONS</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans leading-none">Assemble Your Table</h2>
          <p className="text-xs text-neutral-400 mt-1 font-sans leading-normal">
            Secure prime seats at our signature dine-in lounges and private corporate banquet halls across Bengaluru.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Booking Formulation Form */}
          <div className="md:col-span-7 bg-[#0c0c0c] border border-neutral-855 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-xs font-black text-white font-mono uppercase tracking-widest flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-[#FF5A1F]" /> 1. PROMPT SESSION DETAILS
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-neutral-400">
                <div className="space-y-1.5">
                  <label className="font-bold">Target Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-black border border-neutral-850 text-white rounded-xl p-3 focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold">Session Hour *</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-black border border-neutral-850 text-white rounded-xl p-3 focus:outline-none"
                  >
                    {['12:00', '13:00', '14:00', '18:00', '19:00', '20:00', '21:00', '22:00'].map((hr) => (
                      <option key={hr} value={hr}>{hr} Hrs</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-neutral-400">
                <div className="space-y-1.5">
                  <label className="font-bold">Guest Attendee Count</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full bg-black border border-neutral-850 text-white rounded-xl p-3 focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>{num} Attendees {num === 1 ? 'Chair' : 'Chairs'}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold">Ambience Area Selector</label>
                  <select
                    value={seatingArea}
                    onChange={(e) => setSeatingArea(e.target.value)}
                    className="w-full bg-black border border-neutral-850 text-white rounded-xl p-3 focus:outline-none"
                  >
                    <option value="Premium Indoor Lounge">Premium Roasted Indoor Lounge</option>
                    <option value="Starview Open-Air Patio">Starview Open-Air Rooftop Patio</option>
                    <option value="Executive Private Dining Room">Executive Private Dining Cell</option>
                  </select>
                </div>
              </div>

              {/* Guest Profile block */}
              {!user ? (
                <div className="p-4 bg-black border border-neutral-900 rounded-2xl space-y-3 pt-3">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-[#FFD166] uppercase font-bold">GUEST IDENTITY REGISTRATION</span>
                    <button
                      type="button"
                      onClick={toggleLoginModal}
                      className="text-[#FF5A1F] hover:underline flex items-center gap-1"
                    >
                      <LogIn className="h-3 w-3" /> Login instead
                    </button>
                  </div>
                  <div className="space-y-2 text-xs font-sans">
                    <input
                      type="text"
                      required
                      placeholder="Recipient Full Name"
                      value={gName}
                      onChange={(e) => setGName(e.target.value)}
                      className="w-full bg-[#070707] border border-neutral-850 text-white p-2.5 rounded-lg focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="email"
                        required
                        placeholder="Active Email Coordinate"
                        value={gEmail}
                        onChange={(e) => setGEmail(e.target.value)}
                        className="bg-[#070707] border border-neutral-850 text-white p-2.5 rounded-lg focus:outline-none"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="Active Mobile Number"
                        value={gPhone}
                        onChange={(e) => setGPhone(e.target.value)}
                        className="bg-[#070707] border border-neutral-850 text-white p-2.5 rounded-lg focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs font-sans">
                  <span className="text-neutral-400">Reserved For Account: <strong>{user.name}</strong></span>
                  <span className="bg-[#070707] text-emerald-400 border border-emerald-500/40 text-[9px] font-mono px-2 py-0.5 rounded font-black uppercase">AUTO-LOGGED</span>
                </div>
              )}

              <div className="space-y-1.5 text-xs text-neutral-400 font-sans">
                <label className="font-bold">Acoustic, Dietary, or Event requests</label>
                <textarea
                  placeholder="Anniversary acoustics, soft light setups, allergens warning here..."
                  value={requests}
                  onChange={(e) => setRequests(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-850 bg-black text-white h-16 resize-none focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FF5A1F] to-[#FF8C42] text-white hover:brightness-110 text-xs font-black uppercase tracking-widest py-3 rounded-xl cursor-pointer shadow-lg shadow-[#FF5A1F]/15 active:scale-98 transition transform duration-300"
              >
                Confirm Luxury Reservation
              </button>
            </form>
          </div>

          {/* Active Reservations Sidebar */}
          <div className="md:col-span-5 space-y-6">
            <h3 className="text-xs font-black text-white font-mono uppercase tracking-widest flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-[#FFD166]" /> ACTIVE GOURMET SLOTS ({activeReservations.length})
            </h3>

            <div className="space-y-4">
              {activeReservations.length > 0 ? (
                activeReservations.map((res) => (
                  <div key={res.id} className="bg-[#0b0b0b] border border-neutral-855 rounded-2xl p-4.5 space-y-3 font-sans text-xs flex gap-3.5 relative">
                    <div className="h-9 w-9 rounded-full bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <span className="text-[10px] font-mono text-[#FFD166] uppercase font-black tracking-wider block">ID: {res.id}</span>
                      <strong className="text-white block font-sans">{res.seatingArea}</strong>
                      <p className="text-neutral-400 text-[11px] font-sans">
                        {new Date(res.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} at {res.time} Hrs • <strong>{res.guests} seats</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => onCancelReservation(res.id)}
                      className="text-neutral-500 hover:text-rose-500 hover:bg-neutral-900 h-8 w-8 rounded-lg flex items-center justify-center transition cursor-pointer self-start border border-neutral-855"
                      title="Deallocate table slot"
                    >
                      <XCircle className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 border border-neutral-900 bg-neutral-950/20 text-center rounded-2xl space-y-2">
                  <p className="text-neutral-600 text-xs font-sans leading-relaxed">
                    You have no active luxury dining block confirmations logged in this session.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
