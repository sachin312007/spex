import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, ShoppingBag, Heart, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { FoodItem } from '../types';

export const DISCOVERY_ITEMS = [
  {
    id: "disc-panipuri",
    name: "Crispy Pani Puri",
    price: 139,
    rating: 4.9,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80",
    description: "Crisp hollow pastry balls filled with potato spice smash and loaded with mint spiced water."
  },
  {
    id: "disc-samosa",
    name: "Classic Samosa",
    price: 99,
    rating: 4.7,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=80",
    description: "Golden triangular pastries loaded with cumin roasted potato bits and organic green peas."
  },
  {
    id: "disc-momos",
    name: "Steamed Vegetable Momos",
    price: 159,
    rating: 4.8,
    category: "Chinese",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80",
    description: "Delicate steamed visual pockets packed with seasoned cabbage shreds, ginger, and scallions."
  },
  {
    id: "disc-springroll",
    name: "Golden Spring Rolls",
    price: 149,
    rating: 4.7,
    category: "Chinese",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
    description: "Crisp wheat wrappers loaded with wok cooked julienned cabbage carrots and glass noodles."
  }
];

interface FoodDiscoverySliderProps {
  addToCart: (foodId: string, add?: boolean) => void;
  toggleWishlist: (foodId: string) => void;
  wishlist: string[];
  onOpenDirectOrder: (food: FoodItem | any) => void;
}

export default function FoodDiscoverySlider({
  addToCart,
  toggleWishlist,
  wishlist,
  onOpenDirectOrder
}: FoodDiscoverySliderProps) {
  const [startIndex, setStartIndex] = useState(0);

  const handleNext = () => {
    if (startIndex + 1 < DISCOVERY_ITEMS.length) {
      setStartIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(prev => prev - 1);
    }
  };

  return (
    <div className="bg-[#0a0a0a] py-16 border-t border-neutral-900 select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title row */}
        <div className="flex justify-between items-end mb-10 gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-[#FFD166] uppercase font-mono tracking-wider">CHEF SECTOR MAP</span>
            <h2 className="text-2xl font-black text-white font-sans tracking-tight leading-none">Curated Street Accolades</h2>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={startIndex === 0}
              className="h-10 w-10 border border-neutral-850 bg-[#0d0d0d] disabled:opacity-30 rounded-xl flex items-center justify-center text-white cursor-pointer active:scale-90"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={startIndex + 1 >= DISCOVERY_ITEMS.length}
              className="h-10 w-10 border border-neutral-850 bg-[#0d0d0d] disabled:opacity-30 rounded-xl flex items-center justify-center text-white cursor-pointer active:scale-90"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Display cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DISCOVERY_ITEMS.slice(startIndex, startIndex + 2).map((item) => {
            const isFav = wishlist.includes(item.id);
            // Construct a fake FoodItem for direct ordering
            const partialFoodItem: FoodItem = {
              id: item.id,
              name: item.name,
              description: item.description,
              rating: item.rating,
              reviewCount: 150,
              price: item.price,
              category: item.category as any,
              tags: ["street", "special"],
              prepTime: 15,
              calories: 220,
              image: item.image,
              isAvailable: true
            };

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-[#0d0d0d] rounded-3xl p-5 border border-neutral-855 flex gap-5 items-center hover:border-[#FF5A1F]/25 transition duration-300"
              >
                <img src={item.image} alt={item.name} className="h-28 w-28 rounded-2xl object-cover shrink-0 select-none bg-neutral-900" />
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-white truncate">{item.name}</h3>
                    <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>

                  {/* Rating & Action Panel */}
                  <div className="pt-2 border-t border-neutral-900 flex items-center justify-between text-xs">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-black text-white">₹{item.price}</span>
                      <div className="flex items-center gap-1.5 text-[9px] text-[#FFD166] mt-0.5">
                        <Star className="h-3 w-3 fill-current" />
                        <span>{item.rating} Score</span>
                      </div>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => onOpenDirectOrder(partialFoodItem)}
                        className="bg-black border border-neutral-850 hover:border-[#FF5A1F]/30 px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase text-neutral-300 hover:text-[#FF5A1F] cursor-pointer"
                      >
                        Direct
                      </button>
                      <button
                        onClick={() => addToCart(item.id, true)}
                        className="bg-white text-black hover:bg-[#FF5A1F] hover:text-white px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition cursor-pointer"
                      >
                        Add Cart
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
