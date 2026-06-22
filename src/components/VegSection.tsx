import React from 'react';
import { motion } from 'motion/react';
import { Leaf, Star, Sparkles, CheckCircle, Flame, ArrowRight, ShoppingCart } from 'lucide-react';
import { FoodItem, CartItem } from '../types';

interface VegSectionProps {
  foods: FoodItem[];
  cart: CartItem[];
  addToCart: (foodId: string, add?: boolean) => void;
  updateNotes: (foodId: string, notes: string) => void;
  updateAddons: (foodId: string, addons: any[]) => void;
  onOpenDirectOrder: (food: FoodItem) => void;
}

export default function VegSection({
  foods,
  cart,
  addToCart,
  onOpenDirectOrder
}: VegSectionProps) {
  // Filter pure veg items based on tags or categories. All items in Spex are vegetarian!
  const vegFoods = React.useMemo(() => {
    if (!Array.isArray(foods)) return [];
    return foods.filter((f) => {
      if (!f) return false;
      const tags = Array.isArray(f.tags) ? f.tags : [];
      return tags.some(t => typeof t === 'string' && (t.toLowerCase().includes('veg') || t.toLowerCase().includes('healthy')));
    }).slice(0, 4);
  }, [foods]);

  if (vegFoods.length === 0) return null;

  return (
    <div className="bg-[#0b0b0b] py-16 sm:py-24 border-t border-neutral-900 select-none overflow-hidden relative">
      {/* Decorative green lens flare */}
      <div className="absolute right-10 top-1/4 h-80 w-80 rounded-full bg-emerald-500/[0.02] filter blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header callout */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <Leaf className="h-3.5 w-3.5" />
              <span className="font-mono text-[9px] font-black tracking-[0.15em] uppercase">PURE GREEN RESERVE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans mt-2">
              Garden Fresh & Organic Delights
            </h2>
            <p className="text-xs text-neutral-400 max-w-xl font-sans leading-relaxed">
              100% vegetarian culinary creations curated with organic farm-fresh greens, clean cold-press oils, and allergen-free dairy.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-neutral-500 font-mono">
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-400" /> Trans-Fat Free</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-400" /> Preservative-Free</span>
          </div>
        </div>

        {/* Veg catalog grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {vegFoods.map((food, i) => {
            const isInCart = Array.isArray(cart) && cart.some((c) => c && c.foodId === food.id && !c.savedForLater);
            const qty = Array.isArray(cart) ? (cart.find((c) => c && c.foodId === food.id && !c.savedForLater)?.quantity || 0) : 0;

            return (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col justify-between bg-[#070707] border border-neutral-900 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition duration-300 relative p-4"
              >
                {/* Visual Cover */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900 mb-4 select-none">
                  {/* Veg indicator dot label */}
                  <div className="absolute top-2.5 left-2.5 z-30 flex items-center justify-center p-1 rounded bg-[#070707]/90 border border-emerald-500/50">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </div>

                  <img
                    src={food.image}
                    alt={food.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                  />
                  
                  {/* Calorie check */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-zinc-950/80 border border-neutral-800 text-[8.5px] font-mono font-bold text-neutral-400">
                    {food.calories} calories
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-xs font-black text-white group-hover:text-emerald-400 transition truncate-1">
                      {food.name}
                    </h3>
                    <p className="text-[10px] text-neutral-400 leading-normal line-clamp-2 h-[30px] mt-1">
                      {food.description}
                    </p>
                  </div>

                  {/* Pricing and quick triggers */}
                  <div className="pt-3 border-t border-neutral-900 flex items-center justify-between text-xs">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-black text-white">₹{food.price}</span>
                      <span className="text-[8px] font-mono text-emerald-400 uppercase font-black tracking-widest mt-0.5">Organic Certified</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onOpenDirectOrder(food)}
                        className="bg-black border border-neutral-905 hover:border-emerald-500/30 px-2 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider text-neutral-400 hover:text-emerald-400 cursor-pointer text-center"
                      >
                        Direct
                      </button>
                      <button
                        onClick={() => addToCart(food.id, true)}
                        className={`h-8 px-3 rounded-xl text-[9px] font-black uppercase tracking-wider transition active:scale-95 cursor-pointer flex items-center gap-1 ${
                          isInCart
                            ? 'bg-emerald-500/15 border border-emerald-500/35 text-emerald-400'
                            : 'bg-white text-black hover:bg-emerald-500 hover:text-white'
                        }`}
                      >
                        <ShoppingCart className="h-3 w-3" />
                        {isInCart ? `Added (${qty})` : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
