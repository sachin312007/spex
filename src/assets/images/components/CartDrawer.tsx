import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Plus, Minus, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FoodItem, CartItem, Coupon, AddOn } from '../types';
import { availableCoupons, categoryAddOns } from '../data/foods';

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
  onCheckout: (appliedPromo?: Coupon) => void;
}

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
  onCheckout,
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<Coupon | null>(null);
  const [promoError, setPromoError] = useState('');

  // active versus saved lists
  const activeItems = cart.filter((i) => !i.savedForLater);
  const savedItems = cart.filter((i) => i.savedForLater);

  // Compute subtotal totals
  const subtotal = activeItems.reduce((acc, current) => {
    const f = foods.find((item) => item.id === current.foodId);
    if (!f) return acc;
    const addonsPrice = current.selectedAddOns?.reduce((sum, a) => sum + a.price, 0) || 0;
    return acc + (f.price + addonsPrice) * current.quantity;
  }, 0);

  // Apply Coupon Logic
  const discount = appliedPromo
    ? appliedPromo.discountType === 'percentage'
      ? Math.min((subtotal * appliedPromo.discountValue) / 100, appliedPromo.maxDiscount || Infinity)
      : appliedPromo.discountValue
    : 0;

  const deliveryFee = subtotal > 0 ? (subtotal > 600 ? 0 : 40) : 0;
  const tax = parseFloat((subtotal * 0.05).toFixed(2)); // 5% food tax
  const total = parseFloat((subtotal - discount + deliveryFee + tax).toFixed(2));

  const handleApplyPromo = () => {
    setPromoError('');
    if (promoCode.trim() === '') return;

    const findCoupon = availableCoupons.find((c) => c.code.toUpperCase() === promoCode.toUpperCase());
    if (!findCoupon) {
      setPromoError('Invalid promo coupon code.');
      return;
    }

    if (subtotal < findCoupon.minOrderValue) {
      setPromoError(`Minimum subtotal requirement of ₹${findCoupon.minOrderValue} must be met.`);
      return;
    }

    setAppliedPromo(findCoupon);
    setPromoError('');
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#0d0d0d] cursor-pointer backdrop-blur-sm"
          />

          {/* Drawer Sheet */}
          <motion.div
            initial={{ x: '100%', opacity: 0.95 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex h-full w-full max-w-md flex-col bg-[#171717] border-l border-neutral-800 shadow-2xl"
            id="shopping-cart-drawer"
          >
            {/* Header toolbar */}
            <div className="flex items-center justify-between border-b border-neutral-800 p-5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#FF5A1F]" />
                <h2 className="text-base font-bold text-white font-sans">Your Gastronomic Bag</h2>
                <span className="rounded-full bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-xs text-neutral-400 font-mono">
                  {activeItems.length} Key Dishes
                </span>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-900 hover:text-white transition cursor-pointer"
                id="close-cart-drawer-btn"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main Item Scroll List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {activeItems.length === 0 && savedItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <ShoppingBag className="h-12 w-12 text-neutral-700 stroke-1" />
                  <h3 className="text-sm font-bold text-white">Your bag is currently vacant</h3>
                  <p className="text-xs text-neutral-400 max-w-[240px]">Explore the interactive menu and experience premium catering.</p>
                  <button
                    onClick={onClose}
                    className="rounded-xl bg-gradient-to-r from-[#FF5A1F] to-[#FF8C42] px-6 py-2.5 text-xs font-semibold text-white cursor-pointer"
                  >
                    Start Exquisite Selection
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {activeItems.map((item) => {
                      const f = foods.find((food) => food.id === item.foodId);
                      if (!f) return null;

                      return (
                        <motion.div
                          key={item.foodId}
                          layout
                          initial={{ opacity: 0, y: 15, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.18 } }}
                          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                          className="rounded-xl border border-neutral-800 bg-[#0d0d0d] p-3 space-y-3"
                        >
                        <div className="flex gap-3">
                          {/* Image preview */}
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-900 border border-neutral-800">
                            <img src={f.image} alt={f.name} className="h-full w-full object-cover" />
                          </div>

                          {/* Detail fields */}
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="text-xs font-bold text-white font-sans line-clamp-1">{f.name}</h4>
                              <span className="text-xs font-black text-white">
                                ₹{(f.price + (item.selectedAddOns?.reduce((sum, a) => sum + a.price, 0) || 0)) * item.quantity}
                              </span>
                            </div>
                            <p className="text-[10px] text-neutral-500 font-sans mt-0.5">
                              ₹{f.price} base {item.selectedAddOns && item.selectedAddOns.length > 0 && `+ ₹${item.selectedAddOns.reduce((sum, a) => sum + a.price, 0)} add-ons`}
                            </p>

                            {/* Controls row */}
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-1 rounded-lg bg-neutral-900 border border-neutral-800 p-1">
                                <button
                                  onClick={() => addToCart(item.foodId, false)}
                                  className="p-1 text-xs font-bold text-neutral-400 hover:text-[#FF5A1F]"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="px-1 text-xs font-extrabold text-[#FF8C42] min-w-[14px] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => addToCart(item.foodId, true)}
                                  className="p-1 text-xs font-bold text-neutral-400 hover:text-[#FF5A1F]"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>

                              <div className="flex gap-2 text-[10px] font-bold">
                                <button
                                  onClick={() => saveForLater(item.foodId)}
                                  className="text-[#FFD166] hover:underline"
                                >
                                  Save for later
                                </button>
                                <button
                                  onClick={() => removeFromCart(item.foodId)}
                                  className="text-red-500 hover:underline"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Premium Category AddOns selector and universal cheese/herb options */}
                        <div className="pt-2 border-t border-neutral-900/60 space-y-1 text-xs">
                          <span className="text-neutral-400 font-bold tracking-wide text-[9px] block">Customize Item Stuffs:</span>
                          <div className="flex flex-wrap gap-1">
                            {[
                              ...(categoryAddOns[f.category] || []),
                              { id: 'extra-cheese-universal', name: 'Premium Loaded Cheese 🧀', price: 40 },
                              { id: 'extra-fresh-herbs', name: 'Fresh Exotic Herbs 🌿', price: 15 },
                            ].map((addon) => {
                              const isSelected = item.selectedAddOns?.some((a) => a.id === addon.id) || false;
                              return (
                                <button
                                  key={addon.id}
                                  onClick={() => {
                                    const currentSelected = item.selectedAddOns || [];
                                    const nextSelected = isSelected
                                      ? currentSelected.filter((a) => a.id !== addon.id)
                                      : [...currentSelected, addon];
                                    updateAddons(item.foodId, nextSelected);
                                  }}
                                  className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium border transition-all cursor-pointer ${
                                    isSelected
                                      ? 'border-[#FF5A1F] bg-[#FF5A1F]/15 text-[#FF8C42]'
                                      : 'border-neutral-800 bg-[#0d0d0d] text-neutral-400 hover:text-white hover:border-neutral-700'
                                  }`}
                                >
                                  <span>{addon.name}</span>
                                  <span className="font-bold opacity-80">+₹{addon.price}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Chef Custom Choice Notes */}
                        <div className="pt-2 border-t border-neutral-900/60 space-y-1.5">
                          <label className="text-[9px] text-[#10b981] font-bold uppercase tracking-wider block">
                            👨‍🍳 Chef Note - Cook under your choices:
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Less spicy, without onion/garlic, extra crispy"
                            value={item.deliveryNotes || ''}
                            onChange={(e) => updateNotes(item.foodId, e.target.value)}
                            className="w-full text-[11px] bg-neutral-900 border border-neutral-800 rounded-lg py-1.5 px-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF5A1F]"
                          />
                          {/* Suggested instant notes */}
                          <div className="flex flex-wrap gap-1">
                            {['Less Spicy', 'No Onion/Garlic', 'Extra Hot', 'Very Hot'].map((sug) => (
                              <button
                                key={sug}
                                onClick={() => {
                                  const current = item.deliveryNotes || '';
                                  if (current.includes(sug)) return;
                                  updateNotes(item.foodId, current ? `${current}, ${sug}` : sug);
                                }}
                                className="text-[8px] font-semibold bg-neutral-950 border border-neutral-850 text-neutral-400 hover:text-white hover:border-neutral-700 py-0.5 px-1.5 rounded"
                              >
                                + {sug}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  </AnimatePresence>
                </div>
              )}

              {/* Saved For Later items */}
              {savedItems.length > 0 && (
                <div className="pt-4 border-t border-neutral-800 space-y-3">
                  <h3 className="text-xs font-bold text-[#FFD166] font-mono uppercase tracking-wider">
                    Saved items ({savedItems.length})
                  </h3>
                  <div className="space-y-3">
                    {savedItems.map((item) => {
                      const f = foods.find((food) => food.id === item.foodId);
                      if (!f) return null;

                      return (
                        <div
                          key={item.foodId}
                          className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-[#0d0d0d] p-2.5 opacity-70"
                        >
                          <img src={f.image} alt={f.name} className="h-11 w-11 object-cover rounded" />
                          <div className="flex-1">
                            <h4 className="text-xs font-bold text-white line-clamp-1">{f.name}</h4>
                            <span className="text-xs font-bold text-neutral-400">₹{f.price}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveForLater(item.foodId)}
                              className="text-white text-xs hover:underline"
                            >
                              Move to bag
                            </button>
                            <button onClick={() => removeFromCart(item.foodId)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Summary details & voucher drawer */}
            {activeItems.length > 0 && (
              <div className="border-t border-neutral-800 bg-[#0d0d0d] p-5 space-y-4">
                {/* Coupon prompt container */}
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="VOUCHER PROTOCOL"
                        value={appliedPromo ? appliedPromo.code : promoCode}
                        disabled={!!appliedPromo}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        className="w-full uppercase font-mono rounded-xl border border-neutral-800 bg-[#171717] px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF5A1F] disabled:opacity-50"
                      />
                      <Tag className="absolute right-3.5 top-3 h-4 w-4 text-neutral-600" />
                    </div>
                    {appliedPromo ? (
                      <button
                        onClick={handleRemovePromo}
                        className="rounded-xl border border-red-500 bg-red-500/10 px-4 text-xs font-bold text-red-500 transition hover:bg-red-500 hover:text-white cursor-pointer"
                      >
                        Void
                      </button>
                    ) : (
                      <button
                        onClick={handleApplyPromo}
                        className="rounded-xl bg-[#171717] border border-neutral-800 hover:border-white px-4 text-xs font-bold text-white transition cursor-pointer"
                        id="apply-coupon-btn"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                  {promoError && (
                    <p className="text-[10px] text-red-500 font-sans flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {promoError}
                    </p>
                  )}
                  {appliedPromo && (
                    <p className="text-[10px] text-[#22C55E] font-medium font-sans">
                      ✓ Promo Applied: {appliedPromo.description} (Deducted ₹{discount})
                    </p>
                  )}
                </div>

                {/* Pricing values billing */}
                <div className="space-y-1.5 text-xs border-b border-neutral-800/80 pb-3">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal order value</span>
                    <span className="text-white">₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#22C55E]">
                      <span>Voucher discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-400">
                    <span>Eco friendly delivery</span>
                    {deliveryFee === 0 ? (
                      <span className="text-[#22C55E] font-bold">Complimentary (₹0)</span>
                    ) : (
                      <span className="text-white">₹{deliveryFee}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Municipal Goods & Service Tax (5%)</span>
                    <span className="text-white">₹{tax}</span>
                  </div>
                </div>

                {/* Total sum */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider font-mono">Grand Total To Pay</p>
                    <p className="text-2xl font-black text-white">₹{total}</p>
                  </div>

                  <button
                    onClick={() => onCheckout(appliedPromo || undefined)}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5A1F] to-[#FF8C42] px-6 py-4.5 text-sm font-bold text-white hover:brightness-110 shadow-lg shadow-[#FF5A1F]/10 cursor-pointer"
                    id="checkout-trigger"
                  >
                    Proceed to Delivery
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
