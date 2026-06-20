import React, { useState } from 'react';
import { FoodItem, AddOn } from '../types';
import { Heart, Sparkles, Check, ChevronDown, ChevronUp, MessageSquare, Flame, Clock, Hammer, ShieldCheck, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VegSectionProps {
  foods: FoodItem[];
  cart: any[];
  addToCart: (foodId: string, add?: boolean, selectedAddOns?: AddOn[]) => void;
  updateNotes: (foodId: string, notes: string) => void;
  updateAddons: (foodId: string, addons: AddOn[]) => void;
  onOpenDirectOrder: (food: FoodItem) => void;
}

const CUSTOMIZABLE_STUFFS = [
  { id: 'extra-cheese', name: 'Extra Melted Monterey Cheese 🧀', price: 40 },
  { id: 'ghee-splash', name: 'Golden Swirl of A2 Cow Saffron Ghee 🧈', price: 25 },
  { id: 'chili-gunpowder', name: 'Fiery Mirch Gunpowder Rub 🌶️', price: 15 },
  { id: 'thick-malai', name: 'Fresh Clotted Rabri Cream 🥛', price: 30 },
];

export default function VegSection({
  foods,
  cart,
  addToCart,
  updateNotes,
  updateAddons,
  onOpenDirectOrder,
}: VegSectionProps) {
  // Extract premium vegetarian meals to highlight
  const vegMeals = foods.filter((f) => {
    const titleAndDesc = (f.name + ' ' + f.description).toLowerCase();
    const hasVeganOrVegTag = f.tags.some(t => {
      const l = t.toLowerCase();
      return l.includes('veg') || l.includes('vegan') || l.includes('pure veg');
    });
    const hasAnimalWord = /(chicken|mutton|egg|meat|beef|crab|fish|prawn|shrimp)/i.test(titleAndDesc);
    return (hasVeganOrVegTag || f.category === 'South Indian' || titleAndDesc.includes('paneer') || titleAndDesc.includes('masala dosa')) && !hasAnimalWord;
  }).slice(0, 4);

  // Customization States for each food item ID
  const [expandedCustomizerId, setExpandedCustomizerId] = useState<string | null>(null);
  const [selectedStuffs, setSelectedStuffs] = useState<Record<string, string[]>>({}); // foodId -> stuffIds[]
  const [customChefNotes, setCustomChefNotes] = useState<Record<string, string>>({}); // foodId -> noteText
  const [feedbackMsg, setFeedbackMsg] = useState<Record<string, string>>({}); // foodId -> successMsg

  const toggleCustomizer = (foodId: string) => {
    setExpandedCustomizerId(expandedCustomizerId === foodId ? null : foodId);
  };

  const handleToggleStuff = (foodId: string, stuffId: string) => {
    setSelectedStuffs((prev) => {
      const active = prev[foodId] || [];
      const updated = active.includes(stuffId)
        ? active.filter((id) => id !== stuffId)
        : [...active, stuffId];
      return { ...prev, [foodId]: updated };
    });
  };

  const handleApplyCustomOptionsToCart = (food: FoodItem) => {
    const activeStuffs = selectedStuffs[food.id] || [];
    const chosenAddons: AddOn[] = CUSTOMIZABLE_STUFFS.filter(s => activeStuffs.includes(s.id)).map(s => ({
      id: s.id,
      name: s.name,
      price: s.price
    }));

    const note = customChefNotes[food.id] || '';

    // Add to cart with these addons
    addToCart(food.id, true, chosenAddons);

    // If there is a note, save it in the system notes
    if (note.trim() !== '') {
      updateNotes(food.id, note);
    }

    // Trigger visual toast
    setFeedbackMsg(prev => ({ ...prev, [food.id]: 'Custom mix pushed to cart successfully!' }));
    setTimeout(() => {
      setFeedbackMsg(prev => ({ ...prev, [food.id]: '' }));
    }, 4000);
  };

  const getCartQuantity = (foodId: string) => {
    return cart.find((i) => i.foodId === foodId)?.quantity || 0;
  };

  return (
    <div className="bg-gradient-to-b from-[#0a0f0d] to-[#0a0a0a] py-16 border-t border-b border-emerald-950/40 relative overflow-hidden">
      {/* Background radial glowing effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-80 w-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-10 right-10 h-64 w-64 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Glowing Green Decorative Title Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#10b981]/10 border border-[#10b981]/20 rounded-full px-3.5 py-1">
              <span className="flex h-2 w-2 rounded-full bg-[#10b981] animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.2em] text-[#10b981] uppercase font-mono">
                100% Pure Shakahari
              </span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
              Noticeable Veg Meal Varieties 🍀
            </h2>
            <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
              Majestic, pure whole-plant traditional delicacies crafted premium with natural organic ingredients. Click <strong className="text-emerald-400">Customize</strong> to double your cheese, glaze with saffron ghee, and write custom chef requests!
            </p>
          </div>
          
          <div className="flex items-center gap-1.5 bg-neutral-950/80 border border-neutral-850 px-4 py-2 rounded-xl text-xs font-mono">
            <Sparkles className="h-4 w-4 text-[#FFD166] animate-pulse" />
            <span className="text-neutral-400 font-medium">Under Customer Choice Chef Customization</span>
          </div>
        </div>

        {/* The Noticeable Veg Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {vegMeals.map((food) => {
            const isCustomizerOpen = expandedCustomizerId === food.id;
            const currentQuantity = getCartQuantity(food.id);
            const activeStuffsForFood = selectedStuffs[food.id] || [];
            const activeNoteForFood = customChefNotes[food.id] || '';
            const successText = feedbackMsg[food.id];

            return (
              <div
                key={food.id}
                className="rounded-3xl border border-emerald-950/30 bg-[#0d120f] overflow-hidden p-4 sm:p-5 flex flex-col justify-between hover:border-emerald-500/20 transition-all duration-300 shadow-xl relative group"
                id={`veg-noticeable-${food.id}`}
              >
                {/* Veg Tag Badge inside Card */}
                <span className="absolute top-4 right-4 z-20 flex h-5 w-5 items-center justify-center rounded border border-[#10b981] bg-[#0d120f]/80 p-0.5" title="Pure Veg Certified">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                </span>

                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Food Picture section with decorative badges */}
                  <div className="sm:w-2/5 aspect-square relative rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-900 group-hover:border-emerald-500/20 transition duration-300">
                    <img
                      src={food.image}
                      alt={food.name}
                      ref-y="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-950 to-transparent p-2">
                      <div className="flex items-center justify-between text-[10px] text-emerald-400 font-mono font-bold bg-[#0d120f]/90 px-2 py-0.5 rounded backdrop-blur-sm">
                        <span>★ {food.rating}</span>
                        <span>{food.prepTime}m</span>
                      </div>
                    </div>
                  </div>

                  {/* Right description block */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {food.tags.slice(0, 2).map(t => (
                          <span key={t} className="text-[9px] font-bold text-neutral-400 bg-[#16271c] hover:bg-[#124426] border border-emerald-900/30 px-2 py-0.5 rounded-md">
                            {t}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white mt-1.5 group-hover:text-[#10b981] transition">
                        {food.name}
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed mt-1 line-clamp-3">
                        {food.description}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-emerald-950/20">
                      <span className="text-lg font-extrabold text-[#10b981]">₹{food.price}</span>
                      <div className="flex items-center gap-2">
                        {/* Customizer trigger BUTTON */}
                        <button
                          onClick={() => toggleCustomizer(food.id)}
                          className={`rounded-xl px-3 py-2 text-xs font-bold transition flex items-center gap-1 cursor-pointer select-none border ${
                            isCustomizerOpen
                              ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-emerald-500/10'
                              : 'bg-neutral-900 border-neutral-850 text-neutral-300 hover:text-white hover:border-emerald-950'
                          }`}
                        >
                          <span>⚙️ Customize & Mix</span>
                          {isCustomizerOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>

                        <button
                          onClick={() => handleApplyCustomOptionsToCart(food)}
                          className="rounded-xl bg-gradient-to-r from-[#10b981] to-emerald-600 hover:brightness-110 text-xs font-bold px-4 py-2 cursor-pointer text-white flex items-center gap-1.5"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Micro Expandable Cusomization Engine Plate */}
                <AnimatePresence>
                  {isCustomizerOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 border-t border-emerald-950/20 pt-4 overflow-hidden"
                    >
                      <div className="bg-[#090d0b] border border-emerald-950/40 rounded-2xl p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[10px] font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> Enhance Stuffs (Add Extra Cheese, Cream flakes etc.)
                          </h4>
                          <span className="text-[9px] font-mono text-neutral-500">Multiselector</span>
                        </div>

                        {/* Stuffs check grids */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {CUSTOMIZABLE_STUFFS.map((stuff) => {
                            const isSelected = activeStuffsForFood.includes(stuff.id);
                            return (
                              <button
                                key={stuff.id}
                                onClick={() => handleToggleStuff(food.id, stuff.id)}
                                className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition text-[11px] cursor-pointer select-none ${
                                  isSelected
                                    ? 'border-emerald-500/40 bg-[#10b981]/10 text-emerald-300'
                                    : 'border-neutral-900 bg-neutral-950/40 text-neutral-400 hover:border-neutral-800'
                                }`}
                              >
                                <span className="font-semibold">{stuff.name}</span>
                                <span className="font-mono text-emerald-400 font-extrabold">+₹{stuff.price}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Text note area for "under customer choice" */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider flex items-center gap-1">
                            <MessageSquare className="h-3 w-3 text-[#10b981]" /> Define Custom Notes (Tailor for your Choices)
                          </label>
                          <textarea
                            rows={2}
                            placeholder="e.g. Please cook without onion/garlic, double roasts, serve very hot with sweet red chutney..."
                            value={activeNoteForFood}
                            onChange={(e) => setCustomChefNotes(prev => ({ ...prev, [food.id]: e.target.value }))}
                            className="w-full text-xs rounded-xl border border-neutral-900 bg-neutral-950/80 px-3 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        {/* Action apply CTA inside customized strip */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                          <div className="text-[10px] text-neutral-400 font-medium">
                            Total modifications price: <strong className="text-emerald-400 font-black">
                              ₹{food.price + CUSTOMIZABLE_STUFFS.filter(s => activeStuffsForFood.includes(s.id)).reduce((sum, s) => sum + s.price, 0)}
                            </strong>
                          </div>
                          
                          <button
                            onClick={() => handleApplyCustomOptionsToCart(food)}
                            className="rounded-lg bg-emerald-500 hover:bg-emerald-600 text-[10px] font-black text-white px-4 py-2 cursor-pointer flex items-center justify-center gap-1 uppercase tracking-wider"
                          >
                            <Check className="h-3 w-3" /> Lock In Custom Mix & Add
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success local popups */}
                <AnimatePresence>
                  {successText && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute bottom-4 left-4 right-4 bg-emerald-500/10 border border-emerald-500 text-emerald-400 rounded-xl py-2 px-3 text-center text-xs font-bold font-sans backdrop-blur-md z-30 flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="h-4 w-4 animate-bounce" />
                      <span>{successText}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
