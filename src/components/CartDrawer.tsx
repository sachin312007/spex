import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Heart, Plus, Minus, Tag, Notebook, PlusCircle, Check, ShoppingBag, Utensils } from 'lucide-react';
import { CartItem, FoodItem, Coupon, AddOn } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  foods: FoodItem[];
  addToCart: (foodId: string, add?: boolean) => void;
  removeFromCart: (foodId: string) => void;
  saveForLater: (foodId: string) => void;
  updateNotes: (foodId: string, notes: string) => void;
  updateAddons: (foodId: string, addons: AddOn[]) => void;
  onCheckout: (promo?: Coupon) => void;
}

const AVAILABLE_PROMOS: Coupon[] = [
  { code: 'FIRST90', description: '90% off your delicious first order!', discountType: 'percentage', discountValue: 90, minOrderValue: 200, maxDiscount: 450, expiresAt: '2026-12-31' },
  { code: 'SPEX300', description: 'Flat ₹300 off on gourmet orders above ₹999', discountType: 'fixed', discountValue: 300, minOrderValue: 999, expiresAt: '2026-12-31' },
  { code: 'FREEPASS', description: 'Gourmet standard rebate of ₹150', discountType: 'fixed', discountValue: 150, minOrderValue: 500, expiresAt: '2026-12-31' },
];

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  foods,
  addToCart,
  removeFromCart,
  saveForLater,
  updateNotes,
  updateAddons,
  onCheckout
}: CartDrawerProps) {
  const [promoInput, setPromoInput] = useState('');
  const [selectedPromo, setSelectedPromo] = useState<Coupon | null>(null);
  const [promoError, setPromoError] = useState('');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState('');

  // Divide active and saved items
  const activeItems = useMemo(() => cart.filter((i) => !i.savedForLater), [cart]);
  const savedItems = useMemo(() => cart.filter((i) => i.savedForLater), [cart]);

  // Subtotal calculations
  const subtotal = useMemo(() => {
    return activeItems.reduce((acc, c) => {
      const f = foods.find((it) => it.id === c.foodId);
      if (!f) return acc;
      const addonTotal = c.selectedAddOns?.reduce((sum, a) => sum + a.price, 0) || 0;
      return acc + (f.price + addonTotal) * c.quantity;
    }, 0);
  }, [activeItems, foods]);

  // Apply promo algorithm
  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    const found = AVAILABLE_PROMOS.find((p) => p.code === code);
    if (!found) {
      setPromoError('Invalid coupon identifier.');
      return;
    }

    if (subtotal < found.minOrderValue) {
      setPromoError(`Minimum subtotal ₹${found.minOrderValue} required for this coupon.`);
      return;
    }

    setSelectedPromo(found);
    setPromoInput('');
  };

  const discountAmount = useMemo(() => {
    if (!selectedPromo) return 0;
    if (selectedPromo.discountType === 'percentage') {
      const reduction = (subtotal * selectedPromo.discountValue) / 100;
      return selectedPromo.maxDiscount ? Math.min(reduction, selectedPromo.maxDiscount) : reduction;
    }
    return selectedPromo.discountValue;
  }, [selectedPromo, subtotal]);

  const finalTotal = useMemo(() => {
    const calculated = subtotal - discountAmount;
    return Math.max(calculated, 0);
  }, [subtotal, discountAmount]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-[#000000] backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-[90] w-full max-w-md bg-[#090909] border-l border-neutral-900 shadow-2xl flex flex-col justify-between"
          >
            {/* Header section */}
            <div className="p-6 border-b border-neutral-900 flex items-center justify-between col-span-1">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#FF5A1F]" />
                <h2 className="text-base font-black text-white font-sans uppercase tracking-wider">Gourmet Cart Sheet</h2>
                <span className="text-[10px] bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 text-[#FF5A1F] px-2 py-0.5 rounded-full font-mono font-bold font-sans">
                  {activeItems.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="h-9 w-9 rounded-xl border border-neutral-850 flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-950 transition cursor-pointer active:scale-90"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrolling item block */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none select-none">
              
              {/* Active Items list */}
              {activeItems.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-[10px] font-mono tracking-widest text-[#FF5A1F] uppercase font-black">ENTRÉES READY TO DISPATCH</p>
                  <div className="space-y-3.5">
                    {activeItems.map((cartItem) => {
                      const food = foods.find((f) => f.id === cartItem.foodId);
                      if (!food) return null;
                      const addonsTotal = cartItem.selectedAddOns?.reduce((sum, a) => sum + a.price, 0) || 0;
                      const singleWithAddons = food.price + addonsTotal;

                      return (
                        <div key={cartItem.foodId} className="bg-[#0e0e0e] border border-neutral-855 rounded-2xl p-4 space-y-3.5 relative">
                          <div className="flex gap-4">
                            <img src={food.image} alt={food.name} className="h-16 w-16 rounded-xl object-cover bg-neutral-900 shrink-0 select-none pointer-events-none" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-black text-white truncate">{food.name}</h4>
                              <p className="text-[9px] font-mono text-neutral-500 mt-0.5 uppercase tracking-wide">₹{food.price} base price</p>
                              <div className="text-xs font-black text-white mt-2">₹{singleWithAddons * cartItem.quantity}</div>
                            </div>
                          </div>

                          {/* Controls & Options Bar */}
                          <div className="flex items-center justify-between pt-3 border-t border-neutral-900 text-xs">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => addToCart(cartItem.foodId, false)}
                                className="h-7 w-7 rounded-lg bg-neutral-950 border border-neutral-900 flex items-center justify-center text-neutral-400 hover:text-white transition active:scale-90 cursor-pointer"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="font-mono font-bold text-white w-6 text-center">{cartItem.quantity}</span>
                              <button
                                onClick={() => addToCart(cartItem.foodId, true)}
                                className="h-7 w-7 rounded-lg bg-neutral-950 border border-neutral-900 flex items-center justify-center text-neutral-400 hover:text-white transition active:scale-90 cursor-pointer"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Edit deliver note */}
                              <button
                                onClick={() => {
                                  setEditingNotesId(cartItem.foodId);
                                  setTempNoteText(cartItem.deliveryNotes || '');
                                }}
                                className="h-7 px-2.5 rounded-lg border border-neutral-900 hover:border-[#FF5A1F]/30 bg-neutral-950 text-neutral-500 hover:text-[#FF5A1F] flex items-center gap-1 transition text-[10px] font-black uppercase tracking-wider cursor-pointer"
                              >
                                <Notebook className="h-3 w-3" />
                                {cartItem.deliveryNotes ? 'Note Added' : 'Custom Note'}
                              </button>

                              <button
                                onClick={() => saveForLater(cartItem.foodId)}
                                className="h-7 w-7 rounded-lg border border-neutral-900 text-neutral-500 hover:text-rose-500 hover:border-rose-500/30 flex items-center justify-center transition active:scale-90 cursor-pointer"
                                title="Lock for later orders"
                              >
                                <Heart className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => removeFromCart(cartItem.foodId)}
                                className="h-7 w-7 rounded-lg border border-neutral-900 text-neutral-500 hover:text-rose-500 hover:border-rose-500/30 flex items-center justify-center transition active:scale-90 cursor-pointer"
                                title="Remove totally"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Notes field expanded edit */}
                          <AnimatePresence>
                            {editingNotesId === cartItem.foodId && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden pt-2 space-y-2"
                              >
                                <textarea
                                  placeholder="Leave delivery directions for kitchen (eg: extremely spicy, no onions, extra tissue)..."
                                  value={tempNoteText}
                                  onChange={(e) => setTempNoteText(e.target.value)}
                                  className="w-full text-[11px] p-2.5 rounded-xl border border-neutral-850 bg-black text-neutral-300 focus:outline-none focus:border-[#FF5A1F] h-16 resize-none font-sans"
                                />
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => setEditingNotesId(null)}
                                    className="px-3 py-1.5 rounded-lg text-[9px] font-bold text-neutral-500 uppercase tracking-wider hover:text-white"
                                  >
                                    Close
                                  </button>
                                  <button
                                    onClick={() => {
                                      updateNotes(cartItem.foodId, tempNoteText);
                                      setEditingNotesId(null);
                                    }}
                                    className="bg-[#FF5A1F] hover:bg-[#FF8C42] text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer"
                                  >
                                    Apply Notes
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center space-y-4">
                  <Utensils className="h-10 w-10 text-neutral-800 mx-auto animate-pulse" />
                  <div className="space-y-1">
                    <p className="font-mono text-xs text-neutral-400 font-extrabold uppercase">VACANT PLATTER SHEET</p>
                    <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                      Go to the explore menu and stack delicious bites onto your plate.
                    </p>
                  </div>
                </div>
              )}

              {/* Saved For Later Section panel */}
              {savedItems.length > 0 && (
                <div className="border-t border-neutral-900 pt-6 space-y-3.5">
                  <p className="text-[10px] font-mono tracking-widest text-[#FFD166] uppercase font-black">LOCKED FOR LATER ORDERS</p>
                  <div className="space-y-3">
                    {savedItems.map((cartItem) => {
                      const food = foods.find((f) => f.id === cartItem.foodId);
                      if (!food) return null;
                      return (
                        <div key={cartItem.foodId} className="flex items-center justify-between border border-neutral-900 bg-neutral-950/40 rounded-xl p-3">
                          <div className="flex items-center gap-3">
                            <img src={food.image} alt={food.name} className="h-11 w-11 rounded-lg object-cover bg-neutral-900 pointer-events-none select-none shrink-0" />
                            <div>
                              <h5 className="text-[11px] font-black text-neutral-200 truncate max-w-[150px]">{food.name}</h5>
                              <p className="text-[10px] font-semibold text-neutral-500">₹{food.price}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => saveForLater(cartItem.foodId)}
                              className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-850 px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider text-neutral-300 hover:text-white cursor-pointer"
                            >
                              Move To Cart
                            </button>
                            <button
                              onClick={() => removeFromCart(cartItem.foodId)}
                              className="text-neutral-600 hover:text-rose-500 transition px-1 py-1"
                              title="Delete permanently"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* Calculations & Checkout action box */}
            {activeItems.length > 0 && (
              <div className="p-6 border-t border-neutral-900 bg-[#070707] space-y-4">
                {/* Promo Code Input panel */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                      <input
                        type="text"
                        placeholder="Coupon Identifier (eg: FIRST90)"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        className="w-full text-[11px] font-mono pl-9 pr-3 py-2.5 rounded-xl border border-neutral-850 bg-black text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF5A1F]"
                      />
                    </div>
                    {selectedPromo ? (
                      <button
                        onClick={() => setSelectedPromo(null)}
                        className="bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-[10px] px-3.5 rounded-xl font-mono font-black uppercase tracking-wider transition cursor-pointer"
                      >
                        Clear
                      </button>
                    ) : (
                      <button
                        onClick={handleApplyPromo}
                        className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-[10px] px-3.5 rounded-xl font-mono font-black uppercase tracking-wider transition cursor-pointer"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                  {promoError && (
                    <p className="text-[10px] font-mono text-rose-500 mt-1 leading-none">{promoError}</p>
                  )}
                  {selectedPromo && (
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 mt-1">
                      <Check className="h-3 w-3 shrink-0" />
                      <span>Applied: <strong>{selectedPromo.code}</strong> (Save ₹{discountAmount})</span>
                    </div>
                  )}
                </div>

                {/* Bill details */}
                <div className="space-y-2 pt-2 border-t border-neutral-900/40 text-xs text-neutral-400">
                  <div className="flex justify-between items-center">
                    <span>Base items total:</span>
                    <span className="font-mono text-white">₹{subtotal}</span>
                  </div>
                  {selectedPromo && (
                    <div className="flex justify-between items-center text-emerald-400">
                      <span>Applied Coupon discount:</span>
                      <span className="font-mono">-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm font-extrabold text-white pt-2.5 border-t border-neutral-900">
                    <span>Outstanding Total:</span>
                    <span className="font-mono text-[#FF5A1F] text-base">₹{finalTotal}</span>
                  </div>
                </div>

                {/* Checkout Trigger */}
                <button
                  onClick={() => onCheckout(selectedPromo || undefined)}
                  className="w-full bg-gradient-to-r from-[#FF5A1F] to-[#FF8C42] hover:brightness-110 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl cursor-pointer shadow-lg shadow-[#FF5A1F]/15 transition duration-300 hover:scale-[1.01] active:scale-99 uppercase"
                >
                  Proceed to Delivery Gateway
                </button>
              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
