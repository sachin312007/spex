import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { FoodItem } from '../types';
import { ShoppingBag, X, RotateCcw, Sparkles, Flame, Clock, Star, ArrowRight, Heart } from 'lucide-react';

interface SwipeDeckProps {
  foods: FoodItem[];
  addToCart: (foodId: string, add?: boolean) => void;
  toggleWishlist?: (foodId: string) => void;
  wishlist?: string[];
}

export default function SwipeDeck({
  foods,
  addToCart,
  toggleWishlist,
  wishlist = [],
}: SwipeDeckProps) {
  // Select matching items from the foods list that represent our spectacular swipe deck
  const swipeFoods = foods.filter((f) => f.id.startsWith('swipe-'));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedHistory, setSwipedHistory] = useState<Record<string, 'left' | 'right'>>({});
  const [addedItemsCount, setAddedItemsCount] = useState(0);

  // Motion values to track drag offset of current top card
  const x = useMotionValue(0);
  
  // Transform drag offset to opacity of labels (Yep / Nope) and rotation of top card
  const rotate = useTransform(x, [-180, 180], [-15, 15]);
  const opacityLike = useTransform(x, [0, 120], [0, 1]);
  const opacitySkip = useTransform(x, [-120, 0], [1, 0]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex >= swipeFoods.length) return;
    
    const currentItem = swipeFoods[currentIndex];
    setSwipedHistory((prev) => ({ ...prev, [currentItem.id]: direction }));

    if (direction === 'right') {
      addToCart(currentItem.id, true);
      setAddedItemsCount((c) => c + 1);
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handleDragEnd = (_: any, info: any) => {
    const threshold = 120;
    if (info.offset.x > threshold) {
      handleSwipe('right');
    } else if (info.offset.x < -threshold) {
      handleSwipe('left');
    }
  };

  const resetDeck = () => {
    setCurrentIndex(0);
    setSwipedHistory({});
    setAddedItemsCount(0);
  };

  const isOutOfCards = currentIndex >= swipeFoods.length;

  return (
    <div className="bg-gradient-to-b from-[#0d0d0d] via-[#120f0d] to-[#0d0d0d] py-16 border-t border-b border-[#FF5A1F]/10 relative overflow-hidden">
      {/* Decorative abstract backglow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 bg-[#FF5A1F]/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 h-48 w-48 bg-amber-500/5 rounded-full blur-[70px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title and Intro */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 rounded-full px-3.5 py-1">
            <Sparkles className="h-3.5 w-3.5 text-[#FF5A1F]" />
            <span className="text-[10px] font-black tracking-[0.2em] text-[#FF5A1F] uppercase font-mono">
              Spex Culinary tinder
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Swipe to Discover Specialty Sizzlers 🍕🔥
          </h2>
          <p className="text-sm text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Can't decide? Swipe <strong className="text-emerald-400">Right to Add to Cart</strong>, or swipe <strong className="text-red-400">Left to Skip</strong>. Experience beautiful premium street chaat, pizzas, high-crunch samosas, and juicy curries!
          </p>
        </div>

        {/* The Card Stage */}
        <div className="flex flex-col items-center justify-center max-w-sm mx-auto h-[480px] relative select-none">
          
          <AnimatePresence mode="popLayout">
            {isOutOfCards ? (
              <motion.div
                key="end-screen"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="w-full bg-[#171717] border border-neutral-800 rounded-3xl p-8 text-center flex flex-col justify-center items-center shadow-2xl h-[450px]"
              >
                <div className="h-16 w-16 bg-neutral-900 border border-neutral-800 flex items-center justify-center rounded-full mb-6 relative">
                  <span className="absolute inset-0 bg-[#FF5A1F]/10 animate-ping rounded-full" />
                  <ShoppingBag className="h-6 w-6 text-[#FF5A1F]" />
                </div>
                
                <h3 className="text-xl font-black text-white">Full Deck Explorated!</h3>
                <p className="text-xs text-neutral-400 mt-2 max-w-xs leading-relaxed">
                  You added <strong className="text-[#FF5A1F] font-extrabold">{addedItemsCount}</strong> specialty items to your basket. Open your Checkout cart to place order or swipe through the deck again!
                </p>

                <div className="flex flex-col gap-2.5 w-full mt-8">
                  <button
                    onClick={resetDeck}
                    className="flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-800 hover:border-white/20 text-white rounded-xl py-3.5 text-xs font-black tracking-wider uppercase cursor-pointer transition duration-200"
                  >
                    <RotateCcw className="h-4 w-4" /> Swipe Again
                  </button>
                </div>
              </motion.div>
            ) : (
              // Active Food Stack Cards
              swipeFoods.map((food, index) => {
                // We only render the top card and the one immediately underneath to save DOM weight and look professional
                if (index < currentIndex || index > currentIndex + 1) return null;

                const isTop = index === currentIndex;

                return (
                  <motion.div
                    key={food.id}
                    style={isTop ? { x, rotate } : {}}
                    drag={isTop ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.65}
                    onDragEnd={isTop ? handleDragEnd : undefined}
                    initial={isTop ? { scale: 0.95, y: -5, opacity: 0 } : { scale: 0.9, y: 12, opacity: 0.4 }}
                    animate={isTop ? { scale: 1, y: 0, opacity: 1 } : { scale: 0.95, y: 8, opacity: 0.8 }}
                    exit={
                      swipedHistory[food.id] === 'left'
                        ? { x: -350, opacity: 0, scale: 0.9, rotate: -25, transition: { duration: 0.25, ease: 'easeIn' } }
                        : { x: 350, opacity: 0, scale: 0.9, rotate: 25, transition: { duration: 0.25, ease: 'easeIn' } }
                    }
                    transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                    className={`absolute inset-0 w-full h-[450px] bg-[#141414] border border-neutral-800/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between ${
                      isTop ? 'z-30 cursor-grab active:cursor-grabbing' : 'z-20 pointer-events-none'
                    }`}
                    id={`swipe-card-${food.id}`}
                  >
                    
                    {/* Visual indicators overlay for dragging and visual feedback */}
                    {isTop && (
                      <>
                        <motion.div
                          style={{ opacity: opacityLike }}
                          className="absolute top-6 left-6 z-40 bg-emerald-500/95 text-white border border-emerald-400 border-2 font-black tracking-widest text-[11px] uppercase py-1 px-3 rounded-md shadow-lg rotate-[-10deg]"
                        >
                          ADD TO BASKET 🛒
                        </motion.div>
                        <motion.div
                          style={{ opacity: opacitySkip }}
                          className="absolute top-6 right-6 z-40 bg-red-600/95 text-white border border-red-500 border-2 font-black tracking-widest text-[11px] uppercase py-1 px-3 rounded-md shadow-lg rotate-[10deg]"
                        >
                          NOPE / SKIP ➔
                        </motion.div>
                      </>
                    )}

                    {/* Food Picture section */}
                    <div className="relative h-56 w-full bg-neutral-950 overflow-hidden shrink-0">
                      <img
                        src={food.image}
                        alt={food.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover select-none pointer-events-none"
                      />
                      
                      {/* Premium labels overlay on the image */}
                      <div className="absolute top-3 inset-x-3 flex justify-between items-start pointer-events-none">
                        <span className="rounded bg-black/75 border border-neutral-800/80 text-[8px] font-black text-[#FFD166] uppercase px-2.5 py-1 backdrop-blur-sm tracking-widest">
                          ★ {food.rating} ({food.reviewCount} reviews)
                        </span>
                        
                        <div className="flex gap-1">
                          {food.tags.slice(0, 2).map((t, idx) => (
                            <span key={idx} className="rounded bg-neutral-900/95 border border-neutral-800/90 text-[7px] font-black text-white uppercase px-2.5 py-1 backdrop-blur-sm font-mono tracking-wider">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Gradient Fade on bottom of picture */}
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#141414] to-transparent" />
                    </div>

                    {/* Food Info section */}
                    <div className="px-5 pb-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-1 text-left">
                        <div className="flex items-center gap-1 text-[9px] text-[#FF5A1F] font-mono font-bold uppercase tracking-wider">
                          <span>{food.category}</span>
                          <span className="text-neutral-600">•</span>
                          <Clock className="h-2.5 w-2.5" />
                          <span>{food.prepTime} Min</span>
                          <span className="text-neutral-600">•</span>
                          <Flame className="h-2.5 w-2.5" />
                          <span>{food.calories} Kcal</span>
                        </div>
                        
                        <h3 className="text-base font-black text-white line-clamp-1">{food.name}</h3>
                        <p className="text-[10px] text-neutral-400 leading-relaxed line-clamp-3 font-sans">
                          {food.description}
                        </p>
                      </div>

                      {/* Pricing and interaction bar inside card */}
                      <div className="pt-3 border-t border-neutral-850 flex items-center justify-between">
                        <div>
                          <p className="text-[8px] uppercase tracking-wider text-neutral-500 font-mono">Special Price</p>
                          <span className="text-lg font-black text-white">₹{food.price}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {toggleWishlist && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(food.id);
                              }}
                              className="p-2 bg-neutral-900 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-red-500 border border-neutral-800 cursor-pointer"
                            >
                              <Heart className={`h-4.5 w-4.5 ${wishlist.includes(food.id) ? 'fill-red-500 text-red-500' : ''}`} />
                            </button>
                          )}
                          <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest font-mono select-none">
                            {index + 1} of {swipeFoods.length}
                          </span>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                );
              })
            )}
          </AnimatePresence>

        </div>

        {/* Action Controls Panel below the card */}
        {!isOutOfCards && (
          <div className="flex justify-center items-center gap-6 mt-2 relative z-40">
            {/* Skip button (Left swipe simulation) */}
            <button
              onClick={() => handleSwipe('left')}
              className="flex items-center justify-center h-12 w-12 rounded-full border border-neutral-800 bg-[#171717] text-neutral-400 hover:text-red-400 hover:border-red-500/20 active:scale-95 transition-all duration-200 shadow-lg shadow-black/50 hover:bg-[#1f1616] cursor-pointer group"
              title="Skip (Swipe Left)"
            >
              <X className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
            </button>

            {/* Indicator badge */}
            <div className="bg-[#090909] border border-neutral-850 px-4 py-2 rounded-xl text-[10px] uppercase font-bold text-[#FFD166] select-none text-center tracking-widest flex items-center gap-1.5 font-mono shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
              </span>
              DRAG LEFT OR RIGHT
            </div>

            {/* Like and Add button (Right swipe simulation) */}
            <button
              onClick={() => handleSwipe('right')}
              className="flex items-center justify-center h-12 w-12 rounded-full border border-neutral-800 bg-[#171717] text-[#FF5A1F] hover:text-emerald-400 hover:border-emerald-500/20 active:scale-95 transition-all duration-200 shadow-lg shadow-black/50 hover:bg-[#131c17] cursor-pointer group"
              title="Add to Basket (Swipe Right)"
            >
              <ShoppingBag className="h-5 w-5 transition-transform duration-200 group-hover:scale-110 text-[#10b981]" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
