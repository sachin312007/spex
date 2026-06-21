import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ShoppingBag, Heart, Search, HelpCircle, UtensilsCrossed, Zap } from 'lucide-react';
import { FoodItem, CartItem } from '../types';

interface MenuSectionProps {
  foods: FoodItem[];
  cart: CartItem[];
  wishlist: string[];
  addToCart: (foodId: string, add?: boolean) => void;
  toggleWishlist: (foodId: string) => void;
  onOpenDirectOrder: (food: FoodItem) => void;
}

const CATEGORIES = ['All', 'Pizza', 'Burger', 'Biryani', 'Chinese', 'North Indian', 'South Indian', 'Desserts', 'Beverages', 'Snacks', 'Combo'] as const;

export default function MenuSection({
  foods,
  cart,
  wishlist,
  addToCart,
  toggleWishlist,
  onOpenDirectOrder
}: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating'>('default');

  // Filter foods
  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchCategory = selectedCategory === 'All' || food.category === selectedCategory;
      const matchSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          food.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          food.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [foods, selectedCategory, searchQuery]);

  // Sort foods
  const sortedFoods = useMemo(() => {
    const list = [...filteredFoods];
    if (sortBy === 'price-low') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-high') {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'rating') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [filteredFoods, sortBy]);

  return (
    <div className="bg-[#070707] py-16 sm:py-24 border-t border-neutral-900 select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title and Intro */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[#FF5A1F] uppercase font-mono tracking-[0.2em]">The Gastronome Selection</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Crafted for Gourmet Palates
          </h2>
          <p className="text-sm text-neutral-400 font-sans leading-relaxed">
            Choose from our premium menu cards, prepared fresh with organic components, customized spices, and thermal safe deliveries.
          </p>
        </div>

        {/* Search, Filter, and Sort Toolbar bar */}
        <div className="bg-[#0b0b0b] border border-neutral-850 rounded-2xl p-4 sm:p-6 mb-12 space-y-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Input bar */}
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Query by title, specs, taglines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-medium pl-11 pr-4 py-3.5 rounded-xl border border-neutral-800 bg-[#070707] text-white focus:outline-none focus:border-[#FF5A1F]/50 transition font-sans"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
              <span className="text-xs font-semibold text-neutral-500 font-mono uppercase tracking-wider">Arrange:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#070707] border border-neutral-800 text-neutral-300 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#FF5A1F] cursor-pointer font-sans"
              >
                <option value="default">Default Chef Selection</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Vibe Rating & Score</option>
              </select>
            </div>
          </div>

          {/* Categories Horizontal scrolling tabs bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-t border-neutral-900 pt-4">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-extrabold tracking-wider uppercase transition cursor-pointer ${
                    isActive
                      ? 'bg-[#FF5A1F] text-white shadow-lg shadow-[#FF5A1F]/15'
                      : 'bg-neutral-950 border border-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-800'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Food grid container */}
        <AnimatePresence mode="popLayout">
          {sortedFoods.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {sortedFoods.map((food) => {
                const isItemInCart = cart.some((c) => c.foodId === food.id && !c.savedForLater);
                const cartQty = cart.find((c) => c.foodId === food.id && !c.savedForLater)?.quantity || 0;
                const isFavorited = wishlist.includes(food.id);

                return (
                  <motion.div
                    layout
                    key={food.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="group flex flex-col justify-between bg-[#0a0a0a] border border-neutral-855 rounded-[22px] overflow-hidden hover:border-[#FF5A1F]/30 hover:shadow-[0_0_30px_rgba(255,90,31,0.05)] transition duration-300 relative"
                  >
                    {/* Top image box */}
                    <div className="relative aspect-square w-full bg-neutral-900 overflow-hidden">
                      {/* Wishlist toggle badge */}
                      <button
                        onClick={() => toggleWishlist(food.id)}
                        className={`absolute top-3 right-3 z-30 h-8 w-8 rounded-lg flex items-center justify-center border transition active:scale-90 cursor-pointer ${
                          isFavorited
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                            : 'bg-black/40 border-white/10 text-white/70 hover:text-white hover:bg-black/60'
                        }`}
                        title="Add to wishlist portfolio"
                      >
                        <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
                      </button>

                      {/* BestSeller / Chef Special tag badge */}
                      <div className="absolute top-3 left-3 z-30 flex flex-col gap-1">
                        {food.isChefSpecial && (
                          <span className="text-[7.5px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-[#FFD166] text-black font-mono shadow-md">
                            🍳 chef spec
                          </span>
                        )}
                        {food.isBestSeller && (
                          <span className="text-[7.5px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-[#FF5A1F] text-white font-mono shadow-md">
                            🔥 bestseller
                          </span>
                        )}
                      </div>

                      <img
                        src={food.image}
                        alt={food.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none select-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
                    </div>

                    {/* Metadata body */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-neutral-500 text-[10px] font-mono tracking-wider uppercase font-extrabold">
                          <span>{food.category}</span>
                          <span>•</span>
                          <span>{food.calories} kCal</span>
                          <span>•</span>
                          <span>{food.prepTime}m</span>
                        </div>
                        <h3 className="text-sm font-extrabold text-white group-hover:text-[#FF5A1F] transition duration-200 line-clamp-1">
                          {food.name}
                        </h3>
                        <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed h-[34px]">
                          {food.description}
                        </p>
                      </div>

                      {/* Transaction and action bar */}
                      <div className="pt-3.5 border-t border-neutral-900 flex items-center justify-between">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
                            <span className="text-xs font-black text-white font-mono">{food.rating}</span>
                            <span className="text-[8.5px] text-neutral-500 font-medium tracking-tight">({food.reviewCount})</span>
                          </div>
                          <span className="text-base font-black text-white mt-1">₹{food.price}</span>
                        </div>

                        {/* Order action button */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onOpenDirectOrder(food)}
                            className="bg-neutral-900 border border-neutral-800 hover:border-[#FF5A1F]/30 text-neutral-300 hover:text-white px-2.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition active:scale-95 cursor-pointer flex items-center gap-1 leading-none shadow-sm"
                          >
                            <Zap className="h-3.5 w-3.5 text-[#FF5A1F]" />
                            Direct
                          </button>
                          
                          <button
                            onClick={() => addToCart(food.id, true)}
                            className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition active:scale-95 cursor-pointer flex items-center gap-1.5 leading-none ${
                              isItemInCart
                                ? 'bg-gradient-to-tr from-[#FF5A1F] to-[#FF8C42] text-white shadow-lg'
                                : 'bg-white text-black hover:bg-neutral-100 hover:scale-102 font-heavy'
                            }`}
                          >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            {isItemInCart ? `In Cart (${cartQty})` : 'Add Platter'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 text-center space-y-4 max-w-sm mx-auto"
            >
              <UtensilsCrossed className="h-12 w-12 text-neutral-700 mx-auto animate-pulse" />
              <div className="space-y-1">
                <p className="font-mono text-xs tracking-widest text-neutral-400 font-extrabold uppercase">NO ENTRÉES FOUND</p>
                <p className="text-xs text-neutral-500 font-sans leading-relaxed">
                  Your filtration tags didn't return any specimens. Adjust queries or search strings.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="text-xs font-extrabold text-[#FF5A1F] hover:underline uppercase tracking-wider"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
