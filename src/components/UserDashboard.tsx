import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, MapPin, ShoppingBag, Heart, Award, ArrowRight, RotateCcw, Compass, Plus, Trash2 } from 'lucide-react';
import { UserProfile, Order, Address, FoodItem } from '../types';

interface UserDashboardProps {
  user: UserProfile;
  orders: Order[];
  addresses: Address[];
  wishlist: string[];
  foods: FoodItem[];
  addToCart: (foodId: string, add?: boolean) => void;
  toggleWishlist: (foodId: string) => void;
  onAddAddress: (newAddr: Omit<Address, 'id' | 'isDefault'>) => void;
  onRemoveAddress: (id: string) => void;
  onReorder: (order: Order) => void;
}

export default function UserDashboard({
  user,
  orders,
  addresses,
  wishlist,
  foods,
  addToCart,
  toggleWishlist,
  onAddAddress,
  onRemoveAddress,
  onReorder
}: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'favorites' | 'addresses'>('orders');

  // New address state
  const [showForm, setShowForm] = useState(false);
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [addrType, setAddrType] = useState<Address['type']>('Home');

  const favoriteFoods = React.useMemo(() => {
    return foods.filter((f) => wishlist.includes(f.id));
  }, [foods, wishlist]);

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!line1 || !city || !zip) return;
    onAddAddress({
      type: addrType,
      addressLine1: line1,
      addressLine2: line2 || undefined,
      city,
      zipCode: zip,
    });
    setLine1('');
    setLine2('');
    setCity('');
    setZip('');
    setShowForm(false);
  };

  return (
    <div className="bg-[#070707] py-16 sm:py-24 border-t border-neutral-900 select-none">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Profile Card Header */}
        <div className="bg-[#0c0c0c] border border-neutral-855 rounded-[30px] p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img src={user.avatar} alt={user.name} className="h-20 w-20 rounded-2xl object-cover border border-[#FF5A1F]/30 bg-neutral-950 pointer-events-none select-none" referrerPolicy="no-referrer" />
            <div className="space-y-1.5 text-center md:text-left">
              <h2 className="text-xl font-extrabold text-white font-sans">{user.name}</h2>
              <p className="text-xs text-neutral-400 font-sans">{user.email} • {user.phone}</p>
              <span className="inline-block text-[10px] font-mono font-black uppercase text-[#FF5A1F] tracking-widest bg-[#FF5A1F]/10 px-3 py-1 rounded-lg border border-[#FF5A1F]/20">
                ⭐ {user.loyaltyTier} MEMBER
              </span>
            </div>
          </div>

          <div className="bg-black border border-neutral-900 rounded-2xl p-4 text-center md:text-right space-y-1 flex flex-col justify-center min-w-[150px]">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block font-bold">LOYALTY TOKENS</span>
            <span className="text-2xl font-black text-[#FFD166]">{user.loyaltyPoints}</span>
            <span className="text-[8.5px] text-neutral-500 font-sans block">10 tokens = ₹1 rebate value</span>
          </div>
        </div>

        {/* Tab Toolbar controls */}
        <div className="flex border-b border-neutral-900 text-xs font-black uppercase tracking-wider font-mono gap-4">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 border-b-2 px-2 transition cursor-pointer ${
              activeTab === 'orders' ? 'border-[#FF5A1F] text-white' : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Past Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`pb-3 border-b-2 px-2 transition cursor-pointer ${
              activeTab === 'favorites' ? 'border-[#FF5A1F] text-white' : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Wishlist Selection ({wishlist.length})
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 border-b-2 px-2 transition cursor-pointer ${
              activeTab === 'addresses' ? 'border-[#FF5A1F] text-white' : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Dispatch Addresses ({addresses.length})
          </button>
        </div>

        {/* Content displays */}
        <div>
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((ord) => {
                  const itemsSummary = ord.items.map((i) => `${i.nameAtOrder} (x${i.quantity})`).join(', ');
                  return (
                    <div key={ord.id} className="bg-[#0b0b0b] border border-neutral-855 rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="space-y-1.5 font-sans min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-[#FFD166] font-black tracking-wider uppercase bg-neutral-950 px-2 py-0.5 rounded border border-neutral-850">₹{ord.total} total</span>
                          <span className="text-[10px] font-mono text-neutral-500">ID: {ord.id}</span>
                        </div>
                        <h4 className="text-xs font-black text-white truncate max-w-md">{itemsSummary}</h4>
                        <p className="text-[10px] text-neutral-400">Placed on <strong>{new Date(ord.createdAt).toLocaleDateString()}</strong> • Status: <strong className="text-emerald-400 uppercase">{ord.status}</strong></p>
                      </div>

                      <button
                        onClick={() => onReorder(ord)}
                        className="bg-neutral-900 border border-neutral-800 hover:border-[#FF5A1F]/30 hover:text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase text-neutral-300 cursor-pointer flex items-center gap-2 font-mono active:scale-95 transition"
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Reorder Platter
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="py-16 text-center space-y-4 max-w-xs mx-auto">
                  <ShoppingBag className="h-10 w-10 text-neutral-800 mx-auto animate-pulse" />
                  <p className="text-xs text-neutral-500 leading-normal">
                    You haven't initiated any thermal courier order cycles yet. Place your first entree!
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {favoriteFoods.length > 0 ? (
                favoriteFoods.map((fav) => (
                  <div key={fav.id} className="bg-[#0b0b0b] border border-neutral-855 rounded-2xl p-4 flex gap-4 items-center justify-between">
                    <div className="flex gap-4 items-center shrink min-w-0">
                      <img src={fav.image} alt={fav.name} className="h-12 w-12 rounded-xl object-cover shrink-0 pointer-events-none select-none bg-neutral-900" />
                      <div className="truncate min-w-0">
                        <h4 className="text-xs font-black text-white truncate">{fav.name}</h4>
                        <span className="font-mono text-[10px] text-neutral-500 block">₹{fav.price}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => toggleWishlist(fav.id)}
                        className="text-neutral-500 hover:text-rose-500 px-1 py-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => addToCart(fav.id, true)}
                        className="bg-white text-black hover:bg-[#FF5A1F] hover:text-white px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition active:scale-95 cursor-pointer"
                      >
                        Add Cart
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center col-span-2 space-y-4 max-w-xs mx-auto">
                  <Heart className="h-10 w-10 text-neutral-800 mx-auto animate-pulse" />
                  <p className="text-xs text-neutral-500 leading-normal">
                    You haven't added any favorite Entrees to your list. Click hearts on menu cards.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono font-black uppercase text-neutral-500">SAVED COORDINATES</span>
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-[#FF5A1F] text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-lg flex items-center gap-1 active:scale-95 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> Add Coordinate
                  </button>
                )}
              </div>

              <AnimatePresence>
                {showForm && (
                  <motion.form
                    onSubmit={handleCreateAddress}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-[#0c0c0c] border border-neutral-855 rounded-2xl p-5 space-y-3"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                      <span className="text-xs font-mono font-black uppercase text-[#FFD166]">Establish Coordinates</span>
                      <button type="button" onClick={() => setShowForm(false)} className="text-neutral-500 text-xs">Cancel</button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {(['Home', 'Work', 'Other'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setAddrType(type)}
                          className={`py-2 rounded-lg font-black uppercase transition cursor-pointer ${
                            addrType === type ? 'bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 text-[#FF5A1F]' : 'bg-black border border-neutral-900 text-neutral-400'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Street block coordinates line 1"
                      value={line1}
                      onChange={(e) => setLine1(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-neutral-850 bg-black text-white focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <input
                        type="text"
                        required
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="p-2.5 rounded-xl border border-neutral-850 bg-black text-white focus:outline-none"
                      />
                      <input
                        type="text"
                        required
                        placeholder="PIN Code"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        className="p-2.5 rounded-xl border border-neutral-850 bg-black text-white focus:outline-none"
                      />
                    </div>
                    <button type="submit" className="w-full bg-[#FF5A1F] text-white text-xs font-bold py-2.5 rounded-xl uppercase">Confirm Address</button>
                  </motion.form>
                )}
              </AnimatePresence>

              {addresses.map((addr) => (
                <div key={addr.id} className="bg-[#0b0b0b] border border-neutral-855 rounded-2xl p-4 flex justify-between items-center text-xs">
                  <div className="flex gap-3">
                    <MapPin className="h-5 w-5 text-[#FF5A1F] shrink-0" />
                    <div>
                      <strong>{addr.type} Delivery</strong>
                      <p className="text-neutral-400 mt-1">{addr.addressLine1}, {addr.city}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveAddress(addr.id)}
                    className="text-neutral-60 cursor-pointer text-neutral-500 hover:text-rose-500 px-2 py-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
