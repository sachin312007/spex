import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Users, Sofa, Gift, Sparkles, CheckCircle2, Ticket, ChevronRight, AlertCircle, X, MapPin, Award } from 'lucide-react';
import { Reservation, UserProfile } from '../types';

interface ReservationsSectionProps {
  user: UserProfile | null;
  reservations: Reservation[];
  onAddReservation: (res: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => void;
  onCancelReservation: (id: string) => void;
  toggleLoginModal: () => void;
}

const SEATING_AREAS = [
  {
    id: 'main',
    name: 'Main Dining Hall',
    desc: 'Vibrant, warm, and acoustic, surrounding our central luxury wood-fire oven stage.',
    capacity: '1-8 guests',
    premium: false,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'lounge',
    name: 'Luxury Fireplace Lounge',
    desc: 'Cozy leather seating, low intimate lighting and warm oakwood scent.',
    capacity: '2-4 guests',
    premium: true,
    price: '₹500 cover charge',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'rooftop',
    name: 'Rooftop Sky Deck',
    desc: 'Breathtaking high-elevation skyline vista framed by custom starry lighting & cool breeze.',
    capacity: '2-6 guests',
    premium: true,
    price: '₹1000 premium seating',
    image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'vip',
    name: 'VIP Private Chamber',
    desc: 'Enclosed luxury velvet chamber with private music, soundproofing, and sommelier assistant.',
    capacity: '4-12 guests',
    premium: true,
    price: '₹2000 reservation fee',
    image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'counter',
    name: "Chef's Culinary Counter",
    desc: 'Premium bar seats directly in front of the active stove, watch live pizza flour spins and flame sizzles.',
    capacity: '1-2 guests',
    premium: false,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=80',
  },
];

const TIME_SLOTS = [
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM',
  '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM'
];

export default function ReservationsSection({
  user,
  reservations,
  onAddReservation,
  onCancelReservation,
  toggleLoginModal,
}: ReservationsSectionProps) {
  // Pre-fill user data if they are connected
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  
  // Date constraints: from today to 30 days later
  const todayStr = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState('7:00 PM');
  const [guests, setGuests] = useState(2);
  const [seatingArea, setSeatingArea] = useState('main');
  const [specialRequests, setSpecialRequests] = useState('');
  const [successBooking, setSuccessBooking] = useState<Reservation | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-update if user logs in later
  React.useEffect(() => {
    if (user) {
      if (!name) setName(user.name);
      if (!email) setEmail(user.email);
      if (!phone) setPhone(user.phone);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Full name is required to confirm reservation.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('A valid email address is required.');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setErrorMsg('Please supply a valid contact number (10+ digits).');
      return;
    }
    if (!date) {
      setErrorMsg('Please specify a dining date.');
      return;
    }

    // Add reservation
    const newRes = {
      name,
      email,
      phone,
      date,
      time,
      guests,
      seatingArea: SEATING_AREAS.find(s => s.id === seatingArea)?.name || seatingArea,
      specialRequests: specialRequests.trim() || undefined,
    };

    onAddReservation(newRes);

    // Create a local pseudo confirmation representation for success alert
    const confirmObject: Reservation = {
      id: `RES-${Math.floor(100000 + Math.random() * 900000)}`,
      ...newRes,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };
    
    setSuccessBooking(confirmObject);

    // Clean up dynamic state except contact credentials
    setSpecialRequests('');
  };

  const handleCloseSuccess = () => {
    setSuccessBooking(null);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white py-12 relative overflow-hidden">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute top-20 right-10 h-[300px] w-[300px] bg-[#FF5A1F]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 h-[400px] w-[400px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Banner header info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-900 pb-8 mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1 bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 rounded-full px-3 py-1 text-[10px] font-bold text-[#FF5A1F] uppercase font-mono tracking-widest mb-3">
              <Award className="h-3 w-3" /> Exclusive Fine-Dining Seating
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Spex Table Reservations
            </h1>
            <p className="text-sm text-neutral-400 mt-1.5 max-w-2xl">
              Experience personalized premium dinners, culinary counter showpacks, and majestic skyline rooftops. Guarantee your table instantly below.
            </p>
          </div>

          {!user && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleLoginModal}
              className="flex items-center gap-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-[#FF5A1F]/30 px-5 py-3 text-xs font-bold text-neutral-200 transition-all cursor-pointer shadow-black/80"
            >
              <Sparkles className="h-4 w-4 text-[#FFD166]" />
              Connect Profile for VIP seating
            </motion.button>
          )}
        </div>

        {/* Outer Grid Panel: Left Form / Right Info & My Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column Form: Booking Details (8 Cols on large) */}
          <div className="lg:col-span-7 bg-[#141414]/90 border border-neutral-900 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#FF5A1F]" /> Book Your Dining Space
            </h2>

            {errorMsg && (
              <div className="flex items-center gap-2.5 bg-red-950/40 border border-red-500/20 text-red-200 text-xs py-3 px-4 rounded-xl">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Seating Area Choose Cards */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono block">
                  Select Desired Atmosphere & Seating Area:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {SEATING_AREAS.map((area) => {
                    const isSelected = seatingArea === area.id;
                    return (
                      <div
                        key={area.id}
                        onClick={() => setSeatingArea(area.id)}
                        className={`group border rounded-2xl p-3.5 transition-all text-left flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                          isSelected
                            ? 'border-[#FF5A1F] bg-[#1a110e]/70 shadow-lg shadow-[#FF5A1F]/5'
                            : 'border-neutral-850 hover:border-neutral-700 bg-[#0d0d0d]/80'
                        }`}
                      >
                        {area.premium && (
                          <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-600 to-amber-500 text-[8px] font-black text-white px-2 py-0.5 rounded-bl-lg tracking-widest uppercase font-mono">
                            PREMIUM
                          </div>
                        )}
                        <div className="space-y-1.5 z-10 relative">
                          <span className={`text-xs font-black tracking-wide ${isSelected ? 'text-[#FF5A1F]' : 'text-neutral-200'}`}>
                            {area.name}
                          </span>
                          <p className="text-[10px] text-neutral-400 leading-normal line-clamp-3">
                            {area.desc}
                          </p>
                        </div>

                        <div className="mt-4 pt-3.5 border-t border-neutral-900/40 flex items-center justify-between text-[9px] font-bold text-neutral-400 uppercase font-mono z-10 relative">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-neutral-500" /> {area.capacity}
                          </span>
                          {area.premium && area.price ? (
                            <span className="text-amber-400 font-black">{area.price}</span>
                          ) : (
                            <span className="text-neutral-500">Free Entry</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Guests Selector & Date & Time Side-by-Side */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Date Picker */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-neutral-500" /> Date
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    max={maxDateStr}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-neutral-800 focus:border-[#FF5A1F] rounded-xl px-3.5 py-3 text-sm text-white font-medium focus:outline-none transition-colors"
                  />
                </div>

                {/* 2. Select Time Slit */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-neutral-500" /> Time Slot
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-neutral-800 focus:border-[#FF5A1F] rounded-xl px-3.5 py-3 text-sm text-white font-medium focus:outline-none transition-colors"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Guests Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-neutral-500" /> Guest Count
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full bg-[#0d0d0d] border border-neutral-800 focus:border-[#FF5A1F] rounded-xl px-3.5 py-3 text-sm text-white font-medium focus:outline-none transition-colors"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact Information Fields */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono block">
                  Contact Information:
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-neutral-500 font-mono">Full Booking Name</label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#0d0d0d] border border-neutral-800 focus:border-[#FF5A1F] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-neutral-500 font-mono">Receipt Email</label>
                    <input
                      type="email"
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0d0d0d] border border-neutral-800 focus:border-[#FF5A1F] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  {/* Phone field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-neutral-500 font-mono">SMS Phone Call</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#0d0d0d] border border-neutral-800 focus:border-[#FF5A1F] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Special Dining Requests Selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Gift className="h-3.5 w-3.5 text-neutral-500" /> Special Requests & Occasions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="E.g., Candlelight table setup, allergies, birthday celebration, high-chair requested, business presentation prep, corporate branding, etc."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-neutral-800 focus:border-[#FF5A1F] rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none transition-colors"
                />
              </div>

              {/* Warning/Info */}
              <div className="bg-neutral-900/40 p-3.5 rounded-xl border border-neutral-850 text-[10px] text-neutral-400 flex items-start gap-2 leading-relaxed">
                <AlertCircle className="h-4 w-4 text-[#FFD166] shrink-0 mt-0.5" />
                <span>
                  By booking a table at Spex, we reserve your selected atmosphere area for up to 30 minutes past your checked dining hour. Canceling has no penalties, but please inform us early to retain culinary freshness!
                </span>
              </div>

              {/* CTA Confirm button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FF5A1F] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF5A1F] text-white rounded-xl py-4 text-xs font-black tracking-widest uppercase cursor-pointer transition-all shadow-lg shadow-[#FF5A1F]/15 active:scale-[0.99]"
              >
                Confirm Luxury Reservation ➔
              </button>

            </form>
          </div>

          {/* Right Column: Active Bookings & Live Policies (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Active Bookings Sub-terminal */}
            <div className="bg-[#141414] border border-neutral-900 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
                <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider font-mono">
                  <Ticket className="h-4.5 w-4.5 text-[#FFD166]" /> My Reservations ({reservations.filter(r => r.status === 'Confirmed').length})
                </h3>
              </div>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {reservations.length === 0 ? (
                  <div className="text-center py-10 space-y-2">
                    <p className="text-xs text-neutral-500 font-mono">No bookings found in this session.</p>
                    <p className="text-[10px] text-neutral-600 max-w-xs mx-auto">
                      All reservations booked will appear here where they can be dynamically managed and cancelled with single tap!
                    </p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {reservations.map((res) => (
                      <motion.div
                        key={res.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`rounded-xl border p-4 space-y-3 relative transition-colors ${
                          res.status === 'Cancelled'
                            ? 'bg-neutral-950/40 border-neutral-900/80 grayscale'
                            : 'bg-[#0d0d0d] border-neutral-850 hover:border-neutral-800'
                        }`}
                      >
                        {/* Header ID/Status */}
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono text-neutral-400 block font-bold">
                              {res.id}
                            </span>
                            <span className="text-xs font-black text-white block mt-0.5">
                              {res.seatingArea}
                            </span>
                          </div>
                          
                          <div className="flex flex-col items-end">
                            <span className={`text-[9px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                              res.status === 'Cancelled'
                                ? 'bg-red-900/20 text-red-400 border border-red-900/30'
                                : 'bg-emerald-900/20 text-emerald-400 border border-emerald-950'
                            }`}>
                              {res.status}
                            </span>
                          </div>
                        </div>

                        {/* Event Details snippet */}
                        <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-neutral-900/50 text-[10px] text-neutral-400 font-mono">
                          <div>
                            <span className="text-[8px] uppercase text-neutral-600 block">Date</span>
                            <span className="font-bold text-neutral-300">{res.date}</span>
                          </div>
                          <div>
                            <span className="text-[8px] uppercase text-neutral-600 block">Time Slot</span>
                            <span className="font-bold text-neutral-300">{res.time}</span>
                          </div>
                          <div>
                            <span className="text-[8px] uppercase text-neutral-600 block">Heads</span>
                            <span className="font-bold text-neutral-300">{res.guests} Pax</span>
                          </div>
                        </div>

                        {/* Special requests display */}
                        {res.specialRequests && (
                          <p className="text-[10px] italic text-neutral-500 leading-relaxed bg-[#111] p-2 rounded-lg border border-neutral-900">
                            " {res.specialRequests} "
                          </p>
                        )}

                        {/* Cancellation trigger */}
                        {res.status === 'Confirmed' && (
                          <div className="flex justify-between items-center pt-1.5">
                            <span className="text-[9px] text-neutral-500">Booked ready</span>
                            <button
                              type="button"
                              onClick={() => onCancelReservation(res.id)}
                              className="text-[9px] font-black tracking-widest uppercase text-red-500 hover:text-red-400 focus:outline-none cursor-pointer"
                            >
                              Cancel Booking
                            </button>
                          </div>
                        )}
                        
                        {res.status === 'Cancelled' && (
                          <span className="text-[9px] text-neutral-600 italic block pt-1 text-right">
                            Cancelled of customer request
                          </span>
                        )}

                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>

            {/* Quick Map / Local Info visual */}
            <div className="bg-[#141414] border border-neutral-900 rounded-3xl p-6 shadow-2xl space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">
                At The Venue
              </h3>
              
              <div className="flex gap-4 items-center">
                <div className="h-14 w-14 rounded-xl bg-[#0d0d0d] border border-neutral-800 flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6 text-[#FF5A1F]" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Spex Gastronomy Hub</h4>
                  <p className="text-[10px] text-neutral-400 mt-0.5 leading-normal">
                    Penthouse Floor, Tower C, Imperial Culinary Tech Arcade, Sector V, Mumbai - 400001
                  </p>
                </div>
              </div>

              <div className="bg-neutral-950/40 p-4 rounded-2xl border border-neutral-850 space-y-2">
                <span className="text-[9px] font-bold text-[#FFD166] uppercase tracking-wider font-mono block">
                  VIP Loyalty Benefits:
                </span>
                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  As an active loyalty diner, confirm 3 reservations this month to unlock a complimentary <strong className="text-orange-400">Majestic Saffron Paneer Tikka Pizza</strong> on your next visit!
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Modern Pop-up Modal on successful booking confirmation */}
      <AnimatePresence>
        {successBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseSuccess}
              className="fixed inset-0 bg-black cursor-pointer backdrop-blur-md"
            />

            {/* Content card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-md bg-[#171717] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 z-10"
            >
              <div className="h-16 w-16 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto relative">
                <div className="absolute inset-0 bg-emerald-500/10 animate-ping rounded-full" />
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-white">Table Reserved Successfully!</h3>
                <p className="text-xs text-[#FFD166] font-extrabold uppercase tracking-wide font-mono">
                  Booking Reference: {successBooking.id}
                </p>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{successBooking.name}</strong>. A confirmation SMS and email has been generated to <span className="font-semibold text-neutral-200">{successBooking.email}</span>.
                </p>
              </div>

              {/* Booking Summary parameters */}
              <div className="bg-[#0e0e0e] border border-neutral-850 rounded-2xl p-4 text-left space-y-2.5 text-xs font-mono text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-bold uppercase text-[9px]">Venue Area:</span>
                  <span className="text-[#FF5A1F] font-bold">{successBooking.seatingArea}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-bold uppercase text-[9px]">Reserved Date:</span>
                  <span className="text-white font-bold">{successBooking.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-bold uppercase text-[9px]">Check-in Time:</span>
                  <span className="text-white font-bold">{successBooking.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-bold uppercase text-[9px]">Dining Guests:</span>
                  <span className="text-white font-bold">{successBooking.guests} Pax</span>
                </div>
                {successBooking.specialRequests && (
                  <div className="border-t border-neutral-900 pt-2 text-[10px] text-neutral-500 leading-normal italic">
                    Note: "{successBooking.specialRequests}" has been transmitted to our kitchen sommelier team.
                  </div>
                )}
              </div>

              <div className="text-[10px] text-neutral-500 italic max-w-sm">
                No advanced prepayment is required. Show your reference badge at the front desk counter!
              </div>

              <button
                type="button"
                onClick={handleCloseSuccess}
                className="w-full bg-neutral-900 border border-neutral-800 hover:border-white/10 text-white rounded-xl py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Close Receipt
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
