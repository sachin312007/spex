import React, { useState, useEffect } from 'react';
import { X, MapPin, CreditCard, ShieldCheck, Wallet, ChevronRight, ShoppingBag, Plus, Minus, Tag, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FoodItem, Address, AddOn, UserProfile } from '../types';
import { categoryAddOns } from '../data/foods';

interface DirectOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  food: FoodItem | null;
  addresses: Address[];
  onAddAddress: (addr: Omit<Address, 'id' | 'isDefault'>) => void;
  onSubmitDirectOrder: (
    food: FoodItem,
    quantity: number,
    selectedAddOns: AddOn[],
    address: Address,
    paymentMethod: string,
    notes: string,
    guestContact: { name: string; phone: string; email: string }
  ) => void;
  user: UserProfile | null;
}

const PAYMENT_METHODS = [
  { id: 'UPI', label: 'UPI (GPay / PhonePe / Paytm)', icon: ShieldCheck, desc: 'Instant verification' },
  { id: 'CC', label: 'Credit Card / Debit Card', icon: CreditCard, desc: 'Visa, MasterCard, Amex' },
  { id: 'Net', label: 'Net Banking', icon: ChevronRight, desc: 'All local banks' },
  { id: 'Wallet', label: 'Digital Wallets', icon: Wallet, desc: 'MobilKwik, OlaMoney' },
  { id: 'COD', label: 'Cash On Delivery', icon: ShieldCheck, desc: '₹10 convenience fee added' },
];

export default function DirectOrderModal({
  isOpen,
  onClose,
  food,
  addresses,
  onAddAddress,
  onSubmitDirectOrder,
  user,
}: DirectOrderModalProps) {
  if (!isOpen || !food) return null;

  // Form States
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string>('UPI');
  const [notes, setNotes] = useState('');
  
  // Custom user details (for Guest or logged-in overrides, caching in localStorage for returning users)
  const [guestName, setGuestName] = useState(() => {
    if (user?.name) return user.name;
    try {
      const saved = localStorage.getItem('spex_guest_details');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.name || '';
      }
    } catch (_) {}
    return '';
  });
  const [guestPhone, setGuestPhone] = useState(() => {
    if (user?.phone) return user.phone;
    try {
      const saved = localStorage.getItem('spex_guest_details');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.phone || '';
      }
    } catch (_) {}
    return '';
  });
  const [guestEmail, setGuestEmail] = useState(() => {
    if (user?.email) return user.email;
    try {
      const saved = localStorage.getItem('spex_guest_details');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.email || '';
      }
    } catch (_) {}
    return '';
  });

  // Address Selector States
  const [selectedAddressId, setSelectedAddressId] = useState<string>(addresses[0]?.id || 'temporary');
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddrType, setNewAddrType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newAddrLine1, setNewAddrLine1] = useState('');
  const [newAddrLine2, setNewAddrLine2] = useState('');
  const [newAddrZipCode, setNewAddrZipCode] = useState('');

  // Local/Temporary Address state (if they have no profile addresses)
  const [tempAddress, setTempAddress] = useState<Address>({
    id: 'temporary',
    type: 'Home',
    addressLine1: '',
    addressLine2: '',
    city: 'Bengaluru',
    zipCode: '',
    isDefault: true,
  });

  // Keep state updated with user profiles
  useEffect(() => {
    if (user) {
      setGuestName(user.name);
      setGuestPhone(user.phone);
      setGuestEmail(user.email);
    }
  }, [user]);

  // Sync current credentials changes to localStorage
  useEffect(() => {
    try {
      if (guestName || guestPhone || guestEmail) {
        localStorage.setItem(
          'spex_guest_details',
          JSON.stringify({ name: guestName, phone: guestPhone, email: guestEmail })
        );
      }
    } catch (_) {}
  }, [guestName, guestPhone, guestEmail]);

  // Handle setting default selected address when addresses list loads
  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddr.id);
    } else {
      setSelectedAddressId('temporary');
    }
  }, [addresses]);

  // Calc prices
  const basePrice = food.price;
  const addonsPrice = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const itemTotal = basePrice + addonsPrice;
  const subtotal = itemTotal * quantity;
  const deliveryFee = subtotal > 600 ? 0 : 40;
  const tax = parseFloat((subtotal * 0.05).toFixed(2));
  const total = parseFloat((subtotal + deliveryFee + tax).toFixed(2));

  const handleAddonOptionsToggle = (addon: AddOn) => {
    setSelectedAddOns((prev) => {
      const isSelected = prev.some((a) => a.id === addon.id);
      if (isSelected) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const handleCreateProfileAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAddrLine1.trim() === '' || newAddrZipCode.trim() === '') return;

    if (user) {
      // Add to server database
      onAddAddress({
        type: newAddrType,
        addressLine1: newAddrLine1,
        addressLine2: newAddrLine2,
        city: 'Bengaluru',
        zipCode: newAddrZipCode,
      });
    } else {
      // Just save to temporary guest address
      setTempAddress({
        id: 'temporary',
        type: newAddrType,
        addressLine1: newAddrLine1,
        addressLine2: newAddrLine2 ?? '',
        city: 'Bengaluru',
        zipCode: newAddrZipCode,
        isDefault: true,
      });
      setSelectedAddressId('temporary');
    }

    // Collapse and clear form
    setNewAddrLine1('');
    setNewAddrLine2('');
    setNewAddrZipCode('');
    setShowAddAddressForm(false);
  };

  const handleFormOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let targetAddress: Address | undefined;
    if (selectedAddressId === 'temporary') {
      if (!tempAddress.addressLine1 || !tempAddress.zipCode) {
        alert('Please define a shipping address first before placing order.');
        setShowAddAddressForm(true);
        return;
      }
      targetAddress = tempAddress;
    } else {
      targetAddress = addresses.find((a) => a.id === selectedAddressId);
    }

    if (!targetAddress) {
      alert('A valid delivery address is mandatory.');
      return;
    }

    if (!guestName || !guestPhone) {
      alert('Please fill out your contact Name and Phone Number.');
      return;
    }

    onSubmitDirectOrder(
      food,
      quantity,
      selectedAddOns,
      targetAddress,
      selectedPayment,
      notes,
      { name: guestName, phone: guestPhone, email: guestEmail }
    );
  };

  const availableAddons = [
    ...(categoryAddOns[food.category] || []),
    { id: 'extra-cheese-universal', name: 'Premium Loaded Melted Cheese 🧀', price: 40 },
    { id: 'extra-fresh-herbs', name: 'Fresh Exotic Herbs & Chili 🌿', price: 15 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Dark backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-[#0d0d0d]/90 backdrop-blur-sm cursor-pointer" />

      {/* Main modal surface container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-neutral-800 bg-[#171717] p-4 sm:p-6 shadow-2xl z-50 text-white"
        id="direct-order-deployment-modal"
      >
        {/* Header toolbar */}
        <div className="flex items-start justify-between border-b border-neutral-800 pb-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF5A1F]/10 text-[#FF5A1F]">
              <Zap className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold font-sans flex items-center gap-2">
                ⚡ Direct Order & Customization Terminal
              </h1>
              <p className="text-[11px] text-neutral-400 font-sans">
                Configure gourmet preferences and complete instant checkout for this dish.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition cursor-pointer"
            id="close-direct-order-modal-btn"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleFormOrderSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* Left Column: Product Selection & Configuration + Contact Details */}
          <div className="lg:col-span-7 space-y-5">
            {/* The Food Item details */}
            <div className="flex gap-4 p-3 rounded-2xl bg-neutral-900/65 border border-neutral-800/80">
              <img
                src={food.image}
                alt={food.name}
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl object-cover border border-neutral-800"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold text-[#FF5A1F] uppercase tracking-wider font-mono">
                    {food.category} Selection
                  </span>
                  <h2 className="text-sm font-bold text-white leading-tight font-sans mt-0.5">{food.name}</h2>
                  <p className="text-[11px] text-neutral-400 font-sans line-clamp-1 mt-0.5">{food.description}</p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-800/40">
                  <span className="text-sm font-black text-white">₹{food.price}</span>
                  {/* Quantity adjusts */}
                  <div className="flex items-center gap-2 rounded-lg bg-neutral-950 border border-neutral-800 p-0.5">
                    <button
                      type="button"
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="h-6 w-6 rounded flex items-center justify-center text-xs font-bold text-neutral-400 hover:bg-neutral-900 transition"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-2 text-xs font-bold text-[#FF8C42] min-w-[14px] text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="h-6 w-6 rounded flex items-center justify-center text-xs font-bold text-neutral-400 hover:bg-neutral-900 transition"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Configurable Add-ons */}
            {availableAddons.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-neutral-400 uppercase font-mono tracking-wider">
                  Select Custom Add-On Options
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableAddons.map((addon) => {
                    const isSelected = selectedAddOns.some((a) => a.id === addon.id);
                    return (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={() => handleAddonOptionsToggle(addon)}
                        className={`flex items-center justify-between gap-3 rounded-xl border p-3 text-left transition cursor-pointer ${
                          isSelected
                            ? 'border-[#FF5A1F] bg-[#FF5A1F]/5 text-white shadow-md shadow-[#FF5A1F]/5'
                            : 'border-neutral-800 bg-neutral-950/70 text-neutral-400 hover:bg-neutral-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="accent-[#FF5A1F] h-3.5 w-3.5 rounded border-neutral-700 bg-neutral-900 cursor-pointer"
                          />
                          <span className="text-xs font-semibold leading-tight text-white">{addon.name}</span>
                        </div>
                        <span className="text-xs font-black text-[#FF8C42]">+₹{addon.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-neutral-400 uppercase font-mono tracking-wider">
                Sustenance Owner Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-500 font-mono">Full Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-500 font-mono">Active Contact Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>
              </div>
              <div className="text-xs space-y-1">
                <label className="text-[10px] text-neutral-500 font-mono">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>
            </div>

            {/* Delivery address handling */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-neutral-400 uppercase font-mono tracking-wider">
                  Configure Delivery Destination
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddAddressForm(!showAddAddressForm)}
                  className="text-xs text-[#FF5A1F] hover:text-[#FF8C42] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {showAddAddressForm ? 'Cancel' : '+ Customize details'}
                </button>
              </div>

              {/* Add Address Mini Form popup */}
              <AnimatePresence>
                {(showAddAddressForm || (selectedAddressId === 'temporary' && !tempAddress.addressLine1)) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border border-neutral-800 bg-neutral-950 p-3.5 rounded-xl space-y-3 overflow-hidden text-xs"
                    id="direct-order-addr-form"
                  >
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['Home', 'Work', 'Other'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setNewAddrType(t)}
                          className={`rounded-lg py-1 border font-semibold text-center cursor-pointer text-[10px] ${
                            newAddrType === t
                              ? 'border-[#FF5A1F] bg-[#FF5A1F]/10 text-[#FF8C42]'
                              : 'border-neutral-800 text-neutral-400 hover:border-neutral-700'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="House/Flat/Mansion №, Building, Street Name"
                        required
                        value={newAddrLine1}
                        onChange={(e) => setNewAddrLine1(e.target.value)}
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF5A1F]"
                      />
                      <input
                        type="text"
                        placeholder="Area Landmark details (Optional)"
                        value={newAddrLine2}
                        onChange={(e) => setNewAddrLine2(e.target.value)}
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-white placeholder-neutral-600 focus:outline-none"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          disabled
                          value="Bengaluru"
                          className="w-full rounded-lg border border-neutral-800 bg-neutral-900/60 text-neutral-500 px-3 py-1.5"
                        />
                        <input
                          type="text"
                          placeholder="ZIP Code (6 digits)"
                          required
                          value={newAddrZipCode}
                          onChange={(e) => {
                            if (e.target.value.length <= 6) setNewAddrZipCode(e.target.value);
                          }}
                          className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-white focus:outline-none placeholder-neutral-600"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCreateProfileAddress}
                      className="w-full rounded-lg bg-[#FF5A1F] py-2 font-bold text-white hover:bg-[#FF8C42] cursor-pointer"
                    >
                      Lock In Address
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Display existing addresses or Guest details */}
              <div className="space-y-2">
                {addresses.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-3 rounded-xl border p-2.5 cursor-pointer transition ${
                          selectedAddressId === addr.id
                            ? 'border-[#FF8C42] bg-[#FF8C42]/5'
                            : 'border-neutral-800 bg-neutral-950/40 hover:bg-neutral-900'
                        }`}
                      >
                        <input
                          type="radio"
                          name="directAddressGroup"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-1 accent-[#FF5A1F]"
                        />
                        <div className="flex-1 text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3 text-[#FF5A1F]" />
                            <span className="font-bold text-white">{addr.type}</span>
                          </div>
                          <p className="text-neutral-400 mt-0.5 max-w-[90%]">
                            {addr.addressLine1}, {addr.addressLine2 && `${addr.addressLine2}, `} {addr.city} - {addr.zipCode}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  tempAddress.addressLine1 ? (
                    <div className="flex items-start gap-3 rounded-xl border border-[#FF8C42] bg-[#FF8C42]/5 p-2.5 text-[11px]">
                      <MapPin className="h-4.5 w-4.5 text-[#FF5A1F] shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white">{tempAddress.type} Guest Address</span>
                          <span className="text-[10px] text-[#22C55E] font-bold">Authenticated</span>
                        </div>
                        <p className="text-neutral-400 mt-1">
                          {tempAddress.addressLine1}, {tempAddress.addressLine2 && `${tempAddress.addressLine2}, `}
                          {tempAddress.city} - {tempAddress.zipCode}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 border border-dashed border-neutral-800 rounded-xl bg-neutral-950/20 text-neutral-400">
                      <p className="text-[11px] font-medium">No saved destination details found.</p>
                      <button
                        type="button"
                        onClick={() => setShowAddAddressForm(true)}
                        className="text-xs text-[#FF5A1F] hover:underline mt-1 font-bold block mx-auto cursor-pointer"
                      >
                        Click here to define shipping street address *
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Settlements, Summary & Authorization */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Settlements Option */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-neutral-400 uppercase font-mono tracking-wider">
                Settlement Protocols
              </h3>
              <div className="space-y-2">
                {PAYMENT_METHODS.slice(0, 3).map((pay) => (
                  <button
                    key={pay.id}
                    type="button"
                    onClick={() => setSelectedPayment(pay.id)}
                    className={`w-full flex items-center gap-3 rounded-xl border p-2.5 text-left transition cursor-pointer ${
                      selectedPayment === pay.id
                        ? 'border-[#FF5A1F] bg-[#FF5A1F]/5 text-white'
                        : 'border-neutral-800 bg-neutral-950/55 text-neutral-400 hover:bg-neutral-900'
                    }`}
                  >
                    <pay.icon className={`h-4 w-4 shrink-0 ${selectedPayment === pay.id ? 'text-[#FF5A1F]' : ''}`} />
                    <div className="text-xs">
                      <p className="font-bold leading-none">{pay.label}</p>
                      <p className="text-[9px] text-neutral-500 mt-1">{pay.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chef Cooking & Customization Notes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-[#10b981] font-bold uppercase tracking-wider block">
                  👨‍🍳 Chef Custom Note (Made under your choices)
                </label>
                <span className="text-[9px] text-[#FF5A1F] font-bold">Tailored Recipe</span>
              </div>
              
              <textarea
                placeholder="Make it less spicy, no onions, extra crunchy, cooked soft etc. Let us know..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full text-xs rounded-xl border border-[#262626] bg-neutral-950 px-3 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF5A1F] resize-none"
              />

              {/* Instant Choice Pills */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Less Spicy 🌶️',
                  'Extme Fire Spicy 🔥',
                  'No Onion/Garlic 🧄',
                  'Piping Hot ♨️',
                  'Salt on side 🧂',
                ].map((pill) => (
                  <button
                    key={pill}
                    type="button"
                    onClick={() => {
                      const cleanPill = pill.replace(/[^\w\s\&\/\u00C0-\u017F]/g, '').trim();
                      if (notes.toLowerCase().includes(cleanPill.toLowerCase())) return;
                      setNotes((prev) => (prev ? `${prev}, ${pill}` : pill));
                    }}
                    className="text-[9px] font-semibold bg-neutral-900 border border-neutral-850 text-[11px] text-neutral-400 hover:text-white hover:border-neutral-700 py-1 px-2 rounded-lg transition"
                  >
                    + {pill}
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing calculations details ledger */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-4 text-xs font-medium">
              <h3 className="text-[10px] font-bold text-[#FFD166] uppercase font-mono tracking-wider pb-1.5 border-b border-neutral-800/80">
                Direct Settlement Bill
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between text-neutral-400">
                  <span>Base food ({quantity}x)</span>
                  <span className="text-white">₹{basePrice * quantity}</span>
                </div>
                {addonsPrice > 0 && (
                  <div className="flex justify-between text-neutral-400">
                    <span>Premium Add-ons ({quantity}x)</span>
                    <span className="text-white">+₹{addonsPrice * quantity}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-400">
                  <span>Thermal logistics fee</span>
                  <span>{deliveryFee === 0 ? 'Complimentary' : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Tax duties (5% SGST)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="border-t border-neutral-800/80 pt-2 flex justify-between text-sm font-bold">
                  <span className="text-[#FFD166] uppercase font-mono mt-0.5">Grand Total</span>
                  <span className="text-lg font-black text-white">₹{total}</span>
                </div>
              </div>

              {/* Quality details info bullet */}
              <div className="text-[9px] text-neutral-500 leading-relaxed bg-[#171717] rounded-lg p-2 border border-neutral-800/40">
                <span className="font-bold text-neutral-400 uppercase">⚡ FAST SECURE CHANNEL</span>
                <p className="mt-0.5">By clicking below, this direct stream orders directly through Spex Logistics and prepares cooks immediately.</p>
              </div>

              {/* Authorize button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5A1F] to-[#FF8C42] py-3.5 font-bold text-white hover:brightness-110 shadow-lg shadow-[#FF5A1F]/15 tracking-wide cursor-pointer text-xs uppercase"
              >
                Place Secure Order Now
              </button>
            </div>

          </div>
        </form>
      </motion.div>
    </div>
  );
}
