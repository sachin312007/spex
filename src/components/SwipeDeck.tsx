import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Heart, X, ShoppingBag, RotateCcw, Flame, Check } from 'lucide-react';
import { FoodItem } from '../types';

interface SwipeDeckProps {
  foods: FoodItem[];
  addToCart: (foodId: string, add?: boolean) => void;
  toggleWishlist: (foodId: string) => void;
  wishlist: string[];
}

export default function SwipeDeck({
  foods,
  addToCart,
  toggleWishlist,
  wishlist
}: SwipeDeckProps) {
  const swipeFoods = React.useMemo(() => {
    return foods.filter((f) => f.isTrending || f.isMostLoved).slice(0, 10);
  }, [foods]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeAction, setSwipeAction] = useState<'right' | 'left' | null>(null);

  const activeFood = swipeFoods[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!activeFood) return;
    setSwipeAction(direction);
    
    // Perform swipe consequence after animation Delay
    setTimeout(() => {
      if (direction === 'right') {
        addToCart(activeFood.id, true);
        if (!wishlist.includes(activeFood.id)) {
          toggleWishlist(activeFood.id);
        }
      }
      setCurrentIndex((prev) => prev + 1);
      setSwipeAction(null);
    }, 280);
  };

  const handleReset = () => {
    setCurrentIndex(0);
  };

  return (
    <div className="bg-[#070707] py-16 sm:py-24 border-t border-neutral-900 select-none overflow-hidden relative">
      <div className="absolute left-1/4 bottom-10 h-72 w-72 rounded-full bg-[#FF5A1F]/[0.01] filter blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-lg px-4 text-center space-y-8">
        
        {/* Intro */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#FF5A1F] uppercase font-mono tracking-[0.2em] inline-flex items-center gap-1">
            <Flame className="h-4 w-4 animate-pulse text-[#FF8C42]" /> Interactive Culinary Tinder
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
            Gourmet Swipe Deck
          </h2>
          <p className="text-xs text-neutral-400 font-sans max-w-sm mx-auto leading-normal">
            Drag right to add delicious bites onto your plate and tag them. Drag left to pass or explore other entries.
          </p>
        </div>

        {/* Tinder Deck */}
        <div className="relative w-full h-[400px] flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            {activeFood ? (
              <motion.div
                key={activeFood.id}
                className="absolute w-[285px] h-[380px] bg-[#0c0c0c] border border-neutral-855 rounded-[32px] overflow-hidden p-3.5 space-y-4 shadow-xl flex flex-col justify-between"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  x: swipeAction === 'right' ? 350 : (swipeAction === 'left' ? -350 : 0),
                  rotate: swipeAction === 'right' ? 20 : (swipeAction === 'left' ? -20 : 0),
                }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(e, info) => {
                  const swipeThreshold = 80;
                  if (info.offset.x > swipeThreshold) {
                    handleSwipe('right');
                  } else if (info.offset.x < -swipeThreshold) {
                    handleSwipe('left');
                  }
                }}
              >
                {/* Visual */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 pointer-events-none select-none">
                  <img src={activeFood.image} alt={activeFood.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-[10px] font-mono text-[#FFD166] font-bold uppercase tracking-wider bg-black/50 px-2 py-0.5 rounded">
                    ₹{activeFood.price}
                  </span>
                </div>

                {/* Info details */}
                <div className="text-left space-y-1">
                  <h3 className="text-xs font-black text-white">{activeFood.name}</h3>
                  <p className="text-[10px] text-neutral-400 line-clamp-3 leading-relaxed">
                    {activeFood.description}
                  </p>
                </div>

                {/* Mini buttons */}
                <div className="flex justify-center gap-4 pt-2.5 border-t border-neutral-900 shrink-0">
                  <button
                    onClick={() => handleSwipe('left')}
                    className="h-10 w-10 rounded-full border border-neutral-805 hover:bg-neutral-900 hover:text-rose-500 hover:border-rose-500/30 flex items-center justify-center transition active:scale-90 cursor-pointer"
                    title="Skip dish"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleSwipe('right')}
                    className="h-10 w-[100px] rounded-full bg-gradient-to-tr from-[#FF5A1F] to-[#FF8C42] text-white hover:brightness-110 flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-wider transition active:scale-95 cursor-pointer shadow-md"
                    title="Add into Gourmet Cart"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Bite
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center space-y-4 max-w-xs"
              >
                <div className="h-10 w-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 mx-auto">
                  <Heart className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-widest font-mono">ALL DELICACIES RATED</h4>
                  <p className="text-[11px] text-neutral-500 mt-1 font-sans">
                    You have sifted through our exclusive spotlight deck entries. Reload to swipe again!
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#FF5A1F] hover:text-[#FF8C42] uppercase tracking-wider cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reload Deck
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
