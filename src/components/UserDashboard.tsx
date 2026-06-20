import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Order, Address, FoodItem } from '../types';
import { Sparkles, MapPin, Gift, Clock, ShieldAlert, Heart, Trash2, Home, Briefcase, PlusCircle, ShoppingBag } from 'lucide-react';

interface UserDashboardProps {
  user: UserProfile;
  orders: Order[];
  addresses: Address[];
  wishlist: string[];
  foods: FoodItem[];
  addToCart: (foodId: string, add?: boolean) => void;
  toggleWishlist: (foodId: string) => void;
  onAddAddress: (addr: Omit<Address, 'id' | 'isDefault'>) => void;
  onRemoveAddress: (id: string) => void;
  onReorder?: (order: Order) => void;
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
  onReorder,
}: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses'>('orders');
  
  // Custom Address form
  const [showAddForm, setShowAddForm] = useState(false);
  const [addrType, setAddrType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [addrLine1, setAddrLine1] = useState('');
  const [addrLine2, setAddrLine2] = useState('');
  const [addrZip, setAddrZip] = useState('');

  const wishlistFoods = foods.filter((f) => wishlist.includes(f.id));

  const handleAddAddrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addrLine1.trim() === '' || addrZip.trim() === '') return;
    onAddAddress({
      type: addrType,
      addressLine1: addrLine1,
      addressLine2: addrLine2,
      city: 'Bengaluru',
      zipCode: addrZip,
    });
    setAddrLine1('');
    setAddrLine2('');
    setAddrZip('');
    setShowAddForm(false);
  };

  return (
    <div className="bg-[#0d0d0d] py-16 border-t border-neutral-900 text-white" id="customer-account-portal">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel Column: Premium User Profile and Loyalty Ring */}
          <div className="lg:col-span-4 bg-[#171717] border border-neutral-800 rounded-3xl p-6 space-y-6">
            <div className="text-center space-y-3">
              <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-[#FF5A1F] shadow-lg shadow-[#FF5A1F]/10">
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                <div className="absolute bottom-0 inset-x-0 bg-neutral-900/80 py-0.5 text-[9px] font-black text-[#FFD166] uppercase">
                  VIP
                </div>
              </div>
              <div>
                <h2 className="text-xl font-extrabold font-sans text-white">{user.name}</h2>
                <p className="text-xs text-neutral-400 font-sans mt-0.5">{user.email}</p>
                <p className="text-xs text-neutral-500 font-sans mt-0.5">{user.phone}</p>
              </div>
            </div>

            {/* Loyalty points rewards tracking */}
            <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider font-mono">Loyalty Tier Status</p>
                  <h3 className="text-xl font-black text-[#FFD166]">{user.loyaltyTier} Lounge</h3>
                </div>
                <Gift className="h-8 w-8 text-[#FF5A1F] animate-pulse" />
              </div>

              {/* Progress bar tracking */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold font-mono">
                  <span>{user.loyaltyPoints} Reward Points</span>
                  <span className="text-[#FF8C42]">Gold Level</span>
                </div>
                <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF5A1F] to-[#FF8C42] rounded-full"
                    style={{ width: `${Math.min((user.loyaltyPoints / 1000) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <p className="text-[10px] text-neutral-400 font-sans leading-relaxed">
                Earn 1 Spex coin for every ₹10 formatted order. Redeem points at checkout for free dishes, priority courier booking, or signature recipe box entries.
              </p>
            </div>

            {/* Custom VIP highlights */}
            <div className="space-y-2 border-t border-neutral-800/80 pt-4">
              <span className="text-[10px] font-bold text-neutral-500 uppercase font-mono tracking-wider block">Exclusive Perks</span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-neutral-200">
                  <span className="text-[#FFD166]">✓</span> Free eco-friendly delivery above ₹600
                </div>
                <div className="flex items-center gap-1.5 text-neutral-200">
                  <span className="text-[#FFD166]">✓</span> Dedicated 24/7 Spex concierge hotline
                </div>
                <div className="flex items-center gap-1.5 text-neutral-200">
                  <span className="text-[#FFD166]">✓</span> Instant early-booking on chef popup events
                </div>
              </div>
            </div>

          </div>

          {/* Right Panel Column: Interactive tabs panel showcase */}
          <div className="lg:col-span-8 bg-[#171717] border border-neutral-800 rounded-3xl p-6">
            
            {/* Nav Tabs belts */}
            <div className="flex border-b border-neutral-800 pb-4 mb-6">
              <div className="flex gap-2">
                {[
                  { id: 'orders', label: 'Order Chronicle' },
                  { id: 'wishlist', label: 'Wishlist Portfolio' },
                  { id: 'addresses', label: 'Dispatch Addresses' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`rounded-xl px-5 py-2.5 text-xs font-bold cursor-pointer transition ${
                      activeTab === tab.id
                        ? 'bg-[#FF5A1F] text-white shadow-[#FF5A1F]/10 shadow-lg'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Chronicles tab content */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-12 text-neutral-500">No historic orders logged.</div>
                ) : (
                  orders.map((ord) => (
                    <div key={ord.id} className="rounded-2xl border border-neutral-800 bg-[#0d0d0d] p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-neutral-900 pb-2.5 gap-2">
                        <div>
                          <p className="text-xs font-bold text-[#FFD166] font-mono leading-none">{ord.id}</p>
                          <p className="text-[10px] text-neutral-500 font-sans mt-1">
                            {new Date(ord.createdAt).toLocaleDateString([], {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>

                        <div className="flex gap-2 items-center">
                          <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            ord.status === 'Delivered'
                              ? 'bg-green-600/10 text-green-500 border border-green-500/20'
                              : 'bg-orange-500/10 text-[#FF8C42] border border-[#FF8C42]/20'
                          }`}>
                            {ord.status}
                          </span>
                          <span className="text-xs font-black text-white">₹{ord.total}</span>
                        </div>
                      </div>

                      {/* Items row list with rich thumbnails */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        {ord.items.map((it) => {
                          const foodDetails = foods.find((f) => f.id === it.foodId);
                          const itemImg = foodDetails?.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=120&auto=format&fit=crop&q=80';
                          return (
                            <div key={it.foodId} className="flex items-center justify-between rounded-xl bg-neutral-950 p-2.5 border border-neutral-900 group">
                              <div className="flex items-center gap-3">
                                <img
                                  src={itemImg}
                                  alt={it.nameAtOrder}
                                  className="h-10 w-10 object-cover rounded-lg border border-neutral-800 transition group-hover:scale-105 duration-200"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-xs font-bold text-white font-sans">{it.nameAtOrder}</span>
                                    <span className="rounded-md bg-neutral-900 px-1.5 py-0.5 text-[9px] font-mono font-black text-[#FF8C42] border border-neutral-800">
                                      x{it.quantity}
                                    </span>
                                  </div>
                                  {it.selectedAddOns && it.selectedAddOns.length > 0 && (
                                    <p className="text-[9px] text-neutral-500 font-sans leading-relaxed">
                                      + {it.selectedAddOns.map((a) => a.name).join(', ')}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <span className="text-xs font-black text-neutral-300 font-mono">₹{it.priceAtOrder * it.quantity}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Lower Action panel with notes & Reorder button */}
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center pt-3 border-t border-neutral-900 mt-2 gap-3">
                        <p className="text-[10px] text-neutral-500 italic font-sans leading-relaxed">
                          {ord.deliveryNotes ? `Note: "${ord.deliveryNotes}"` : 'Packed in medical-grade sterile heat chambers.'}
                        </p>
                        
                        {onReorder && ord.status === 'Delivered' && (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            type="button"
                            onClick={() => onReorder(ord)}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-neutral-950 to-neutral-900 hover:from-[#FF5A1F] hover:to-[#FF8C42] border border-[#FF5A1F]/30 hover:border-[#FF5A1F] transition text-white px-4.5 py-2 text-xs font-bold shadow-lg cursor-pointer group select-none"
                          >
                            <ShoppingBag className="h-3 w-3 text-[#FF5A1F] group-hover:text-white transition-colors" />
                            <span className="group-hover:text-white">Reorder Feast</span>
                          </motion.button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Wishlist portfolio tab contents */}
            {activeTab === 'wishlist' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wishlistFoods.length === 0 ? (
                  <div className="col-span-2 text-center py-12 text-neutral-500">
                    Your wishlist portfolio is currently empty.
                  </div>
                ) : (
                  wishlistFoods.map((f) => (
                    <div
                      key={f.id}
                      className="rounded-xl border border-neutral-800 bg-[#0d0d0d] p-3 flex gap-3 items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img src={f.image} alt={f.name} className="h-12 w-12 object-cover rounded-lg" />
                        <div>
                          <h4 className="text-xs font-bold text-white font-sans line-clamp-1">{f.name}</h4>
                          <span className="text-xs font-black text-[#FF5A1F] mt-0.5 block">₹{f.price}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        {/* Add directly to cart */}
                        <button
                          onClick={() => addToCart(f.id, true)}
                          className="rounded-lg bg-neutral-900 border border-neutral-800 hover:border-[#FF5A1F]/50 p-2 text-white"
                          title="Add item to bag"
                          id={`wishlist-add-bag-${f.id}`}
                        >
                          <ShoppingBag className="h-4 w-4 text-[#FF8C42]" />
                        </button>
                        {/* Remove from wishlist */}
                        <button
                          onClick={() => toggleWishlist(f.id)}
                          className="rounded-lg bg-neutral-900 border border-neutral-800 hover:border-red-500 p-2 text-neutral-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Addresses management tab content */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                {/* Addition drawer button */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-neutral-400">Manage dispatch configurations.</span>
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="text-xs text-[#FF8C42] hover:underline font-bold"
                  >
                    {showAddForm ? 'Close panel' : '+ Add Address Profile'}
                  </button>
                </div>

                {/* Sub address additions form inside tab */}
                <AnimatePresence>
                  {showAddForm && (
                    <motion.form
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      onSubmit={handleAddAddrSubmit}
                      className="border border-neutral-800 bg-[#0d0d0d] p-4 rounded-2xl space-y-3 overflow-hidden text-xs"
                      id="dashboard-address-form"
                    >
                      <div className="flex gap-1.5">
                        {(['Home', 'Work', 'Other'] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setAddrType(t)}
                            className={`flex-1 rounded-lg py-1.5 border font-semibold text-center cursor-pointer ${
                              addrType === t
                                ? 'border-[#FF5A1F] bg-[#FF5A1F]/10 text-white'
                                : 'border-neutral-850 text-neutral-400 hover:border-neutral-700'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <input
                          type="text"
                          required
                          placeholder="Address Line 1 (Flat, Room, Suite, Landmark)"
                          value={addrLine1}
                          onChange={(e) => setAddrLine1(e.target.value)}
                          className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-white focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Address Line 2 (Secondary details, layout Area)"
                          value={addrLine2}
                          onChange={(e) => setAddrLine2(e.target.value)}
                          className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-white focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="6-digit ZIP Area code (e.g. 560103)"
                          required
                          value={addrZip}
                          onChange={(e) => {
                            if (e.target.value.length <= 6) setAddrZip(e.target.value);
                          }}
                          className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full rounded-lg bg-gradient-to-r from-[#FF5A1F] to-[#FF8C42] py-2 font-bold text-white hover:brightness-110 cursor-pointer"
                      >
                        Enlist Address Sourcing Code
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Addresses lists cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="rounded-xl border border-neutral-800 bg-[#0d0d0d] p-4 flex justify-between items-start"
                    >
                      <div className="flex gap-3">
                        {addr.type === 'Home' ? (
                          <Home className="h-5 w-5 text-[#FF5A1F] mt-0.5 shrink-0" />
                        ) : addr.type === 'Work' ? (
                          <Briefcase className="h-5 w-5 text-[#FF8C42] mt-0.5 shrink-0" />
                        ) : (
                          <MapPin className="h-5 w-5 text-neutral-400 mt-0.5 shrink-0" />
                        )}
                        <div>
                          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                            {addr.type} Profile
                            {addr.isDefault && (
                              <span className="rounded bg-neutral-900 border border-neutral-800 px-1 text-[8px] font-bold text-[#FFD166]">
                                Default
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed font-sans">
                            {addr.addressLine1}, {addr.addressLine2 && `${addr.addressLine2}, `}
                            {addr.city} - {addr.zipCode}
                          </p>
                        </div>
                      </div>

                      {/* Delete addresses profiling */}
                      <button
                        onClick={() => onRemoveAddress(addr.id)}
                        disabled={addresses.length <= 1}
                        className="rounded p-1 text-neutral-500 hover:text-red-500 hover:bg-neutral-900 transition shrink-0 cursor-pointer disabled:opacity-30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
