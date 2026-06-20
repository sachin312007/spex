import React, { useState } from 'react';
import { X, MapPin, CreditCard, ShieldCheck, Wallet, ChevronRight, CheckCircle2, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Address, Coupon } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  appliedPromo?: Coupon;
  addresses: Address[];
  onAddAddress: (addr: Omit<Address, 'id' | 'isDefault'>) => void;
  onSubmitOrder: (paymentMethod: string, address: Address, notes: string) => void;
}

const PAYMENT_METHODS = [
  { id: 'UPI', label: 'UPI (GPay / PhonePe / Paytm)', icon: ShieldCheck, desc: 'Instant verification' },
  { id: 'CC', label: 'Credit Card / Debit Card', icon: CreditCard, desc: 'Visa, MasterCard, Amex' },
  { id: 'Net', label: 'Net Banking', icon: ChevronRight, desc: 'All local banks' },
  { id: 'Wallet', label: 'Digital Wallets', icon: Wallet, desc: 'MobilKwik, OlaMoney' },
  { id: 'COD', label: 'Cash On Delivery', icon: ShieldCheck, desc: '₹10 convenience fee added' },
];

export default function CheckoutModal({
  isOpen,
  onClose,
  subtotal,
  discount,
  deliveryFee,
  tax,
  total,
  appliedPromo,
  addresses,
  onAddAddress,
  onSubmitOrder,
}: CheckoutModalProps) {
  // states
  const [selectedAddressId, setSelectedAddressId] = useState<string>(addresses[0]?.id || '');
  const [selectedPayment, setSelectedPayment] = useState<string>('UPI');
  const [notes, setNotes] = useState('');
  
  // adding address trigger
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddrType, setNewAddrType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newAddrLine1, setNewAddrLine1] = useState('');
  const [newAddrLine2, setNewAddrLine2] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('Bengaluru');
  const [newAddrZipCode, setNewAddrZipCode] = useState('');

  const targetAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAddrLine1.trim() === '' || newAddrZipCode.trim() === '') return;

    onAddAddress({
      type: newAddrType,
      addressLine1: newAddrLine1,
      addressLine2: newAddrLine2,
      city: newAddrCity,
      zipCode: newAddrZipCode,
    });

    // Clear and collapse
    setNewAddrLine1('');
    setNewAddrLine2('');
    setNewAddrZipCode('');
    setShowAddAddress(false);
  };

  const handlePlaceOrder = () => {
    if (!targetAddress) return;
    onSubmitOrder(
      selectedPayment,
      targetAddress,
      notes
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-[#0d0d0d]/90 backdrop-blur-sm cursor-pointer" />

      {/* Sheet panel */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl border border-neutral-800 bg-[#171717] p-6 shadow-2xl z-50 text-white"
        id="order-deployment-checkout-modal"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF5A1F]/10 text-[#FF5A1F]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-sans">Deployment Gateway - Checkout</h1>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">Complete shipping credentials and authorize secure transactions.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white cursor-pointer"
            id="close-checkout-modal-btn"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form and info split layouts */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Columns: Address and Payment */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Shipping Address Picker */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-neutral-400 uppercase font-mono tracking-wider">
                  1. Dispatch Destination
                </h3>
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="text-xs text-[#FF5A1F] hover:text-[#FF8C42] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {showAddAddress ? 'Cancel' : '+ Add Address'}
                </button>
              </div>

              {/* Add Address Form popup inside checkout */}
              <AnimatePresence>
                {showAddAddress && (
                  <motion.form
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    onSubmit={handleCreateAddress}
                    className="border border-neutral-800 bg-[#0d0d0d] p-4 rounded-xl space-y-3 overflow-hidden text-xs"
                    id="checkout-add-address-form"
                  >
                    <div className="grid grid-cols-3 gap-2">
                      {(['Home', 'Work', 'Other'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setNewAddrType(t)}
                          className={`rounded-lg py-1.5 border font-semibold text-center cursor-pointer ${
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
                        placeholder="Flat, Mansion, Building, Row Street №"
                        required
                        value={newAddrLine1}
                        onChange={(e) => setNewAddrLine1(e.target.value)}
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-white focus:outline-none focus:border-[#FF5A1F]"
                      />
                      <input
                        type="text"
                        placeholder="Landmark details or Area layout (Optional)"
                        value={newAddrLine2}
                        onChange={(e) => setNewAddrLine2(e.target.value)}
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-white focus:outline-none"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          disabled
                          value="Bengaluru"
                          className="w-full rounded-lg border border-neutral-800 bg-neutral-900/60 text-neutral-500 px-3 py-2"
                        />
                        <input
                          type="text"
                          placeholder="ZIP Postal Code"
                          required
                          value={newAddrZipCode}
                          onChange={(e) => {
                            if (e.target.value.length <= 6) setNewAddrZipCode(e.target.value);
                          }}
                          className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-lg bg-[#FF5A1F] py-2 font-bold text-white hover:bg-[#FF8C42] cursor-pointer"
                    >
                      Authenticate Destination
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Main Address Selection Belt */}
              <div className="grid grid-cols-1 gap-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition ${
                      selectedAddressId === addr.id
                        ? 'border-[#FF8C42] bg-[#FF8C42]/5'
                        : 'border-neutral-800 bg-neutral-950 hover:bg-neutral-900'
                    }`}
                  >
                    <input
                      type="radio"
                      name="addressGroup"
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1 accent-[#FF5A1F]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#FF5A1F]" />
                        <span className="text-xs font-bold text-white">{addr.type} Destination</span>
                        {addr.isDefault && (
                          <span className="rounded bg-neutral-900 px-1 py-0.5 text-[8px] font-bold text-[#FFD166]">
                            Default Match
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed font-sans">
                        {addr.addressLine1}, {addr.addressLine2 && `${addr.addressLine2}, `}
                        {addr.city} - {addr.zipCode}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Method Selector Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-neutral-400 uppercase font-mono tracking-wider">
                2. Transaction Settlement Protocols
              </h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {PAYMENT_METHODS.map((pay) => (
                  <button
                    key={pay.id}
                    type="button"
                    onClick={() => setSelectedPayment(pay.id)}
                    className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition cursor-pointer ${
                      selectedPayment === pay.id
                        ? 'border-[#FF5A1F] bg-[#FF5A1F]/5 text-white'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:bg-neutral-900'
                    }`}
                  >
                    <pay.icon className={`h-4.5 w-4.5 shrink-0 ${selectedPayment === pay.id ? 'text-[#FF5A1F]' : ''}`} />
                    <div>
                      <p className="text-xs font-bold">{pay.label}</p>
                      <p className="text-[10px] text-neutral-500 mt-0.5">{pay.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* General Delivery Note */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase font-mono tracking-wider block">
                3. Dispatch Instructions / Comments
              </label>
              <textarea
                placeholder="Gate code, landmark details, request zero contact porch delivery, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs bg-[#0d0d0d] border border-neutral-800 rounded-xl p-3 h-20 text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF5A1F]"
              />
            </div>

          </div>

          {/* Right Column: Bill Review Summary */}
          <div className="md:col-span-5">
            <div className="rounded-2xl border border-neutral-800 bg-[#0d0d0d] p-5 space-y-5">
              <h3 className="text-xs font-bold text-[#FFD166] uppercase font-mono tracking-wider pb-2 border-b border-neutral-800">
                Summary Billing Ledger
              </h3>

              {/* Promo Applied Summary */}
              {appliedPromo && (
                <div className="flex gap-2.5 items-center rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 p-3">
                  <Ticket className="h-5 w-5 text-[#22C55E]" />
                  <div>
                    <p className="text-xs font-bold text-white leading-none">Voucher: {appliedPromo.code}</p>
                    <p className="text-[10px] text-neutral-400 mt-1">₹{discount} deducted from total charge.</p>
                  </div>
                </div>
              )}

              {/* Billing table details */}
              <div className="space-y-2.5 text-xs font-medium">
                <div className="flex justify-between text-neutral-400">
                  <span>Sourced foods subtotal</span>
                  <span className="text-white">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#22C55E]">
                    <span>Voucher credits applied</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-400">
                  <span>Thermal logistics deployment</span>
                  <span>{deliveryFee === 0 ? 'Complimentary' : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Goods & Service Tax duties (5%)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="border-t border-neutral-800/80 pt-3 flex justify-between text-sm font-bold">
                  <span className="text-[#FFD166] uppercase font-mono leading-none pt-1">Total aggregate cost</span>
                  <span className="text-xl font-black text-white">₹{total}</span>
                </div>
              </div>

              {/* Quality Guarantee stamps */}
              <div className="rounded-xl bg-[#171717] p-3 text-[10px] text-neutral-400 leading-relaxed font-sans space-y-1">
                <p className="font-bold text-white uppercase flex items-center gap-1">
                  <span className="text-[#22C55E]">●</span> Zero Contact Shield Guarantee
                </p>
                <p>All containers and thermal packs are double sterilized. Your delivery courier maintains contactless hygiene protocols.</p>
              </div>

              {/* Authorize and Dispatch CTA */}
              <button
                onClick={handlePlaceOrder}
                disabled={!targetAddress}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5A1F] to-[#FF8C42] py-4.5 font-bold text-white hover:brightness-110 shadow-lg shadow-[#FF5A1F]/15 disabled:opacity-50 cursor-pointer text-sm"
              >
                Place Secure Order & Dispatch
              </button>
            </div>
          </div>

        </div>

      </motion.div>
    </div>
  );
}
