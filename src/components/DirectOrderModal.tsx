import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, PlusCircle, CreditCard, ChevronRight, Check, Plus, Minus, MapPin, Sparkles } from 'lucide-react';
import { FoodItem, Address, AddOn, UserProfile } from '../types';

interface DirectOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  food: FoodItem | null;
  addresses: Address[];
  onAddAddress: (newAddr: Omit<Address, 'id' | 'isDefault'>) => void;
  onSubmitDirectOrder: (
    food: FoodItem,
    qty: number,
    selectedAddOns: AddOn[],
    address: Address,
    paymentMethod: string,
    notes: string,
    guestContact: { name: string; phone: string; email: string }
  ) => void;
  user: UserProfile | null;
}

const AVAILABLE_ADDONS: AddOn[] = [
  { id: 'add-cheese', name: 'Premium Loaded Cheese Melt', price: 90 },
  { id: 'add-dip', name: 'Smoked Garlic Herb Dip', price: 40 },
  { id: 'add-soda', name: 'Gourmet Siphon Cola', price: 60 },
];

export default function DirectOrderModal({
  isOpen,
  onClose,
  food,
  addresses,
  onAddAddress,
  onSubmitDirectOrder,
  user
}: DirectOrderModalProps) {
  const [qty, setQty] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<AddOn[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Card' | 'UPI'>('COD');
  const [notes, setNotes] = useState('');

  // Guest details if not authenticated
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  // New address subform
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addrType, setAddrType] = useState<Address['type']>('Home');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQty(1);
      setSelectedAddons([]);
      setNotes('');
      setSelectedAddressId(addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || '');
    }
  }, [isOpen, addresses]);

  if (!food) return null;

  const handleToggleAddon = (addon: AddOn) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.id === addon.id) ? prev.filter((a) => a.id !== addon.id) : [...prev, addon]
    );
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!line1 || !city || !zip) return;
    onAddAddress({
      type: addrType,
      addressLine1: line1,
      addressLine2: line2 || undefined,
      city,
      zipCode: zip,
    });
    // reset
    setLine1('');
    setLine2('');
    setCity('');
    setZip('');
    setShowAddAddress(false);
  };

  const activeAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const handleDirectSubmit = () => {
    if (!activeAddress) {
      alert('Please add or select a delivery address coordinate.');
      return;
    }
    if (!user && (!guestName || !guestPhone)) {
      alert('Gourmet deliveries require an active name and phone identifier.');
      return;
    }
    onSubmitDirectOrder(
      food,
      qty,
      selectedAddons,
      activeAddress,
      paymentMethod,
      notes,
      { name: guestName || user?.name || 'Guest', phone: guestPhone || user?.phone || '0000', email: guestEmail || user?.email || 'guest@spex.com' }
    );
  };

  const addonTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const subtotal = (food.price + addonTotal) * qty;
  const deliveryFee = subtotal > 600 ? 0 : 40;
  const tax = parseFloat((subtotal * 0.05).toFixed(2));
  const finalTotal = parseFloat((subtotal + deliveryFee + tax).toFixed(2));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#070707]/90 backdrop-blur-md cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3 }}
            className="relative bg-[#0d0d0d] border border-neutral-850 rounded-[30px] p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-none space-y-6 select-none"
          >
            {/* Header section */}
            <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">⚡</span>
                <div>
                  <h2 className="text-base font-black text-white font-sans uppercase tracking-wider">Direct Dispatch Tunnel</h2>
                  <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-0.5">Quick single platter customized bypass</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="h-9 w-9 rounded-xl border border-neutral-850 flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-950 transition cursor-pointer active:scale-95"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Left Column (Food Item customization, guest info, etc.) */}
              <div className="md:col-span-7 space-y-5">
                
                {/* Food specifics */}
                <div className="bg-[#070707] rounded-2xl p-4 flex gap-4 border border-neutral-900">
                  <img src={food.image} alt={food.name} className="h-20 w-20 rounded-xl object-cover shrink-0 select-none pointer-events-none" />
                  <div>
                    <h3 className="text-xs font-black text-white">{food.name}</h3>
                    <p className="text-[10px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">{food.description}</p>
                    <span className="text-xs font-black text-[#FF5A1F] block mt-1.5 font-mono">₹{food.price}</span>
                  </div>
                </div>

                {/* Qty Control */}
                <div className="flex items-center justify-between p-3.5 bg-[#070707] border border-neutral-900 rounded-2xl">
                  <span className="text-[10px] font-mono font-extrabold uppercase text-neutral-400">Order Quantity</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="h-8 w-8 rounded-lg bg-black border border-neutral-850 text-neutral-400 hover:text-white flex items-center justify-center transition active:scale-90 cursor-pointer"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="font-mono font-black text-white w-8 text-center text-sm">{qty}</span>
                    <button
                      onClick={() => setQty(q => q + 1)}
                      className="h-8 w-8 rounded-lg bg-black border border-neutral-850 text-neutral-400 hover:text-white flex items-center justify-center transition active:scale-90 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Optional addons */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-extrabold uppercase text-neutral-400">Customization Add-ons</span>
                  <div className="space-y-2">
                    {AVAILABLE_ADDONS.map((addon) => {
                      const isSelected = selectedAddons.some((a) => a.id === addon.id);
                      return (
                        <div
                          key={addon.id}
                          onClick={() => handleToggleAddon(addon)}
                          className={`p-3 rounded-xl border transition cursor-pointer flex justify-between items-center text-xs ${
                            isSelected
                              ? 'bg-[#FF5A1F]/5 border-[#FF5A1F]/30 text-white font-semibold'
                              : 'bg-black border-neutral-900 text-neutral-400 hover:text-white'
                          }`}
                        >
                          <span className="truncate">{addon.name}</span>
                          <div className="flex items-center gap-2 shrink-0 font-mono">
                            <span>+₹{addon.price}</span>
                            <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#FF5A1F] bg-[#FF5A1F] text-white' : 'border-neutral-700'}`}>
                              {isSelected && <Check className="h-3 w-3" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Guest Contact Details if not authenticated */}
                {!user && (
                  <div className="space-y-3 pt-3 border-t border-neutral-900">
                    <span className="text-[10px] font-mono font-extrabold uppercase text-neutral-400">Guest Recipient Specifications</span>
                    <div className="space-y-2">
                      <input
                        type="text"
                        required
                        placeholder="Recipient Full Name"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full text-[11px] p-2.5 rounded-xl border border-neutral-850 bg-black text-white focus:outline-none focus:border-[#FF5A1F]"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="tel"
                          required
                          placeholder="Recipient Mobile Number"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          className="w-full text-[11px] p-2.5 rounded-xl border border-neutral-850 bg-black text-white focus:outline-none focus:border-[#FF5A1F]"
                        />
                        <input
                          type="email"
                          placeholder="Recipient Email for Invoice"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          className="w-full text-[11px] p-2.5 rounded-xl border border-neutral-850 bg-black text-white focus:outline-none focus:border-[#FF5A1F]"
                        />
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column (Dispatch and calculations) */}
              <div className="md:col-span-5 bg-[#070707]/80 rounded-3xl p-5 border border-neutral-855 flex flex-col justify-between space-y-6">
                
                {/* SELECT CHOOSE COORDINATES */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[10px] font-mono tracking-widest text-[#FFD166] uppercase font-black">Dispatch Location</h3>
                    {!showAddAddress && (
                      <button
                        type="button"
                        onClick={() => setShowAddAddress(true)}
                        className="text-[10px] font-black text-[#FF5A1F] hover:text-[#FF8C42] flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="h-3 w-3" /> New
                      </button>
                    )}
                  </div>

                  {/* Add address panel inside */}
                  <AnimatePresence>
                    {showAddAddress ? (
                      <motion.form
                        onSubmit={handleAddAddressSubmit}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-[#030303] border border-neutral-900 rounded-xl p-3 space-y-2 text-[10px]"
                      >
                        <input
                          type="text"
                          required
                          placeholder="Street block coordinates"
                          value={line1}
                          onChange={(e) => setLine1(e.target.value)}
                          className="w-full p-2 rounded-lg border border-neutral-850 bg-black text-white focus:outline-none focus:border-[#FF5A1F]"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full p-2 rounded-lg border border-neutral-850 bg-black text-white focus:outline-none"
                          />
                          <input
                            type="text"
                            required
                            placeholder="PIN"
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            className="w-full p-2 rounded-lg border border-neutral-850 bg-black text-white focus:outline-none"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-[#FF5A1F] text-white text-[9px] font-bold uppercase py-2 rounded-lg"
                        >
                          Confirm
                        </button>
                      </motion.form>
                    ) : (
                      <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-none">
                        {addresses.map((addr) => (
                          <div
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`p-2.5 rounded-xl border transition cursor-pointer flex gap-2.5 text-[11px] ${
                              selectedAddressId === addr.id
                                ? 'bg-[#FF5A1F]/5 border-[#FF5A1F]/30 text-white'
                                : 'bg-black/40 border-neutral-900 text-neutral-400 hover:text-neutral-200'
                            }`}
                          >
                            <MapPin className="h-4 w-4 text-[#FF5A1F]" />
                            <div className="truncate-1 flex-1">
                              <strong>{addr.type} Delivery</strong>
                              <p className="text-[10px] truncate-1 text-neutral-500 mt-0.5">{addr.addressLine1}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Ledger */}
                <div className="space-y-2.5 text-[11px] text-neutral-400 border-t border-neutral-900 pt-4">
                  <div className="flex justify-between">
                    <span>Base price total ({qty}x):</span>
                    <span className="font-mono text-white">₹{food.price * qty}</span>
                  </div>
                  {addonTotal > 0 && (
                    <div className="flex justify-between">
                      <span>Customization addons ({qty}x):</span>
                      <span className="font-mono text-white">₹{addonTotal * qty}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Thermal Courier Fee:</span>
                    <span className="font-mono text-white">{deliveryFee > 0 ? `₹${deliveryFee}` : 'FREE'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Services & GST (5%):</span>
                    <span className="font-mono text-white">₹{tax}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-white border-t border-neutral-900 pt-2.5 mt-2">
                    <span>Grand Outstanding:</span>
                    <span className="font-mono text-[#FF5A1F] text-base">₹{finalTotal}</span>
                  </div>
                </div>

                {/* Submit trigger */}
                <button
                  type="button"
                  onClick={handleDirectSubmit}
                  className="w-full bg-gradient-to-r from-[#FF5A1F] to-[#FF8C42] hover:brightness-110 text-white text-xs font-black uppercase tracking-widest py-3.5 rounded-xl cursor-pointer shadow-lg shadow-[#FF5A1F]/15 transition active:scale-95 text-center block"
                >
                  Confirm Direct Order
                </button>

              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
