import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, CreditCard, ChevronRight, Check, Plus, ShoppingBag, Truck, DollarSign, KeyRound } from 'lucide-react';
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
  onAddAddress: (newAddr: Omit<Address, 'id' | 'isDefault'>) => void;
  onSubmitOrder: (payMethod: string, address: Address, orderNotes: string) => void;
}

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
  onSubmitOrder
}: CheckoutModalProps) {
  const [selectedAddressId, setSelectedAddressId] = useState<string>(addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Card' | 'UPI'>('COD');
  const [orderNotes, setOrderNotes] = useState('');
  
  // New address state form
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addrType, setAddrType] = useState<Address['type']>('Home');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');

  const activeAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

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
    // Reset form
    setLine1('');
    setLine2('');
    setCity('');
    setZip('');
    setShowAddAddress(false);
  };

  const handlesubmit = () => {
    if (!activeAddress) {
      alert('Please add or select a delivery address address to dispatch meals.');
      return;
    }
    onSubmitOrder(paymentMethod, activeAddress, orderNotes);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#070707]/90 backdrop-blur-md cursor-pointer"
          />

          {/* Modal box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3 }}
            className="relative bg-[#0d0d0d] border border-neutral-850 rounded-[30px] p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-none space-y-6 select-none"
          >
            {/* Header section panel */}
            <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-5 w-5 text-[#FF5A1F]" />
                <div>
                  <h2 className="text-base font-black text-white font-sans uppercase tracking-wider">Secure Payment Gateway</h2>
                  <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-0.5">Custom Sealing & Fast Dispatch</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="h-9 w-9 rounded-xl border border-neutral-850 flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-950 transition cursor-pointer active:scale-90"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Left Column (Address & payment options) */}
              <div className="md:col-span-7 space-y-6">
                
                {/* SELECT DELIVERY ADDRESS */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[10px] font-mono tracking-widest text-neutral-400 font-extrabold uppercase">1. CHOOSE DISPATCH MATRIX</h3>
                    {!showAddAddress && (
                      <button
                        onClick={() => setShowAddAddress(true)}
                        className="text-[10px] font-black text-[#FF5A1F] hover:text-[#FF8C42] flex items-center gap-1 cursor-pointer uppercase tracking-wider"
                      >
                        <Plus className="h-3 w-3" /> Add Address
                      </button>
                    )}
                  </div>

                  {/* Add address subform */}
                  <AnimatePresence>
                    {showAddAddress ? (
                      <motion.form
                        onSubmit={handleCreateAddress}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-[#070707] border border-neutral-855 rounded-2xl p-4 space-y-3"
                      >
                        <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#FFD166]">NEW COORDINATES</span>
                          <button
                            type="button"
                            onClick={() => setShowAddAddress(false)}
                            className="text-neutral-500 hover:text-white text-[9px] font-bold"
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {(['Home', 'Work', 'Other'] as const).map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setAddrType(type)}
                              className={`py-1 rounded text-[9px] font-black uppercase tracking-wider cursor-pointer ${
                                addrType === type
                                  ? 'bg-[#FF5A1F]/15 border border-[#FF5A1F]/35 text-[#FF5A1F]'
                                  : 'bg-black border border-neutral-900 text-neutral-400'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="Street Address, Block..."
                          value={line1}
                          onChange={(e) => setLine1(e.target.value)}
                          className="w-full text-[10px] p-2.5 rounded-xl border border-neutral-850 bg-black text-white focus:outline-none focus:border-[#FF5A1F]"
                        />
                        <input
                          type="text"
                          placeholder="Apartment, Landmark, Suite (optional)..."
                          value={line2}
                          onChange={(e) => setLine2(e.target.value)}
                          className="w-full text-[10px] p-2.5 rounded-xl border border-neutral-850 bg-black text-white focus:outline-none focus:border-[#FF5A1F]"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="text-[10px] p-2.5 rounded-xl border border-neutral-850 bg-black text-white focus:outline-none focus:border-[#FF5A1F]"
                          />
                          <input
                            type="text"
                            required
                            placeholder="PIN / Zip Code"
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            className="text-[10px] p-2.5 rounded-xl border border-neutral-850 bg-black text-white focus:outline-none focus:border-[#FF5A1F]"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-[#FF5A1F] hover:bg-[#FF8C42] text-white text-[9px] font-black uppercase tracking-wider py-2.5 rounded-xl cursor-pointer"
                        >
                          Confirm Coordinates
                        </button>
                      </motion.form>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-none">
                        {addresses.map((addr) => (
                          <div
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`p-3.5 rounded-2xl border transition cursor-pointer flex gap-3 text-xs ${
                              selectedAddressId === addr.id
                                ? 'bg-[#FF5A1F]/5 border-[#FF5A1F]/30 text-white'
                                : 'bg-[#070707]/60 border-neutral-900 text-neutral-400 hover:text-neutral-200'
                            }`}
                          >
                            <MapPin className={`h-4.5 w-4.5 shrink-0 ${selectedAddressId === addr.id ? 'text-[#FF5A1F]' : 'text-neutral-600'}`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 font-bold text-[10.5px]">
                                <span className={selectedAddressId === addr.id ? 'text-[#FFD166]' : 'text-white'}>{addr.type} Delivery</span>
                                {addr.isDefault && <span className="text-[8px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-500 px-1 py-0.2 rounded">Default</span>}
                              </div>
                              <p className="text-[10px] truncate mt-1 leading-normal">{addr.addressLine1}</p>
                              <p className="text-[9.5px] truncate text-neutral-500 mt-0.5">{addr.city}, {addr.zipCode}</p>
                            </div>
                            {selectedAddressId === addr.id && <Check className="h-4 w-4 text-[#FF5A1F] shrink-0 self-center" />}
                          </div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* CHOOSE PAYMENT METHOD */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-mono tracking-widest text-neutral-400 font-extrabold uppercase">2. SECURE PAYMENT CHANNEL</h3>
                  <div className="grid grid-cols-3 gap-2 text-xs font-black tracking-wider uppercase font-mono">
                    <button
                      onClick={() => setPaymentMethod('COD')}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition ${
                        paymentMethod === 'COD'
                          ? 'border-[#FF5A1F]/30 bg-[#FF5A1F]/[0.05] text-[#FF5A1F]'
                          : 'border-neutral-900 bg-[#070707] text-neutral-400 hover:text-white'
                      }`}
                    >
                      <DollarSign className="h-4 w-4" />
                      <span>COD</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('Card')}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition ${
                        paymentMethod === 'Card'
                          ? 'border-[#FF5A1F]/30 bg-[#FF5A1F]/[0.05] text-[#FF5A1F]'
                          : 'border-neutral-900 bg-[#070707] text-neutral-400 hover:text-white'
                      }`}
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>CARD</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition ${
                        paymentMethod === 'UPI'
                          ? 'border-[#FF5A1F]/30 bg-[#FF5A1F]/[0.05] text-[#FF5A1F]'
                          : 'border-neutral-900 bg-[#070707] text-neutral-400 hover:text-white'
                      }`}
                    >
                      <KeyRound className="h-4 w-4" />
                      <span>UPI</span>
                    </button>
                  </div>
                </div>

                {/* EXHAUSTIVE REMARKS */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-mono tracking-widest text-neutral-400 font-extrabold uppercase">3. DISPATCH DIRECTIONS</h3>
                  <textarea
                    placeholder="Provide gate numbers, specific floor directions, custom requests, thermal preferences here..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-850 bg-black text-neutral-300 focus:outline-none focus:border-[#FF5A1F] h-16 resize-none font-sans"
                  />
                </div>

              </div>

              {/* Right Column (Outstanding bill review) */}
              <div className="md:col-span-5 bg-[#070707]/80 border border-neutral-855 rounded-3xl p-5 space-y-5 flex flex-col justify-between">
                
                <div className="space-y-4">
                  <h3 className="text-[10px] font-mono tracking-widest text-[#FFD166] uppercase font-black">OUTSTANDING LEDGER</h3>
                  
                  <div className="space-y-2.5 text-[11px] text-neutral-400 pb-4 border-b border-neutral-900">
                    <div className="flex justify-between">
                      <span>Platters total:</span>
                      <span className="font-mono text-white">₹{subtotal}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-400 font-medium">
                        <span>Rebate Applied:</span>
                        <span className="font-mono">-₹{discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Thermal Dispatch:</span>
                      <span className="font-mono text-white">{deliveryFee > 0 ? `₹${deliveryFee}` : 'FREE'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Services & SGST (5%):</span>
                      <span className="font-mono text-white">₹{tax}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm font-black text-white">
                    <span>Outstanding Total:</span>
                    <span className="font-mono text-[#FF5A1F] text-lg">₹{total}</span>
                  </div>

                  {appliesBriefPromoText(appliedPromo)}
                </div>

                {/* Proceed Checkout checkout button */}
                <button
                  onClick={handlesubmit}
                  className="w-full bg-gradient-to-r from-[#FF5A1F] to-[#FF8C42] hover:brightness-110 text-white text-xs font-black uppercase tracking-widest py-3.5 rounded-xl cursor-pointer shadow-lg shadow-[#FF5A1F]/15 transition duration-300 transform active:scale-98 flex items-center justify-center gap-2"
                >
                  <Truck className="h-4 w-4" />
                  Place Order
                </button>

              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function appliesBriefPromoText(promo?: Coupon) {
  if (!promo) return null;
  return (
    <div className="p-3 bg-[#FF5A1F]/5 border border-[#FF5A1F]/25 rounded-2xl text-[10px] font-sans text-neutral-400 leading-normal">
      🎁 Ticket applied: <strong>{promo.code}</strong>. {promo.description}
    </div>
  );
}
