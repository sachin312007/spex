import { useState, useMemo } from 'react';
import { FoodItem } from '../types';
import { Search, Flame, Clock, Heart, ShoppingBag, SlidersHorizontal, Check, RefreshCw, Sparkles, TrendingUp, Mic, MicOff } from 'lucide-react';

const SWIGGY_FILTERS = [
  { id: 'high-protein', label: 'High Protein 💪', color: 'border-rose-500/20 text-rose-400 bg-rose-500/5 hover:border-rose-500/50' },
  { id: 'less-calories', label: 'Less Calories 🥗', color: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5 hover:border-emerald-500/50' },
  { id: 'no-sugar', label: 'No Added Sugar 🌿', color: 'border-cyan-500/20 text-cyan-400 bg-cyan-500/5 hover:border-cyan-500/50' },
  { id: 'tangy', label: 'Tangy Swirls 🍋', color: 'border-amber-500/20 text-amber-400 bg-amber-500/5 hover:border-amber-500/50' },
  { id: 'spicy', label: 'Fiery Spicy 🌶️', color: 'border-orange-500/20 text-orange-400 bg-orange-500/5 hover:border-orange-500/50' },
  { id: 'fast-delivery', label: 'Super Fast (<12m) ⚡', color: 'border-purple-500/20 text-purple-400 bg-purple-500/5 hover:border-purple-500/50' },
  { id: 'bestseller', label: 'Best Sellers ⭐️', color: 'border-yellow-500/20 text-yellow-400 bg-yellow-500/5 hover:border-yellow-500/50' },
  { id: 'budget', label: 'Great Budget (<₹250) 🪙', color: 'border-blue-500/20 text-blue-400 bg-blue-500/5 hover:border-blue-500/50' },
];
import { motion, AnimatePresence } from 'motion/react';

interface MenuSectionProps {
  foods: FoodItem[];
  cart: { foodId: string; quantity: number }[];
  wishlist: string[];
  addToCart: (foodId: string, announce?: boolean) => void;
  toggleWishlist: (foodId: string) => void;
  onOpenDirectOrder: (food: FoodItem) => void;
}

const CATEGORIES: ('All' | FoodItem['category'])[] = [
  'All',
  'Pizza',
  'Burger',
  'Biryani',
  'Chinese',
  'North Indian',
  'South Indian',
  'Desserts',
  'Beverages',
  'Snacks',
  'Combo',
];

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  All: '🌐 All Heritage',
  Pizza: '🥖 Artisanal Naan & Kulcha',
  Burger: '🍢 Sigri Kebabs & Tikka',
  Biryani: '🍚 Shahi Dum Biryani',
  Chinese: '🍜 Indo-Chinese Fusion',
  'North Indian': '🍛 North Indian Shahi Mains',
  'South Indian': '🫓 Deccan & South Indian Meals',
  Desserts: '🍬 Shahi Sweets & Desserts',
  Beverages: '🥤 Elixir Drinks & Masala Chai',
  Snacks: '🍿 Street Chaat & Savories',
  Combo: '🍱 Imperial Royal Feasts',
};

const CATEGORY_BADGE_NAMES: Record<string, string> = {
  Pizza: 'Artisanal Naan',
  Burger: 'Sigri Kebab',
  Biryani: 'Shahi Biryani',
  Chinese: 'Indo-Chinese',
  'North Indian': 'North Indian',
  'South Indian': 'South Indian',
  Desserts: 'Shahi Sweets & Desserts',
  Beverages: 'Masala Chai & Drink',
  Snacks: 'Street Chaat',
  Combo: 'Royal Thali',
};

export default function MenuSection({
  foods,
  cart,
  wishlist,
  addToCart,
  toggleWishlist,
  onOpenDirectOrder,
}: MenuSectionProps) {
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<'All' | FoodItem['category']>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<number>(1000);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyVeg, setOnlyVeg] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'priceAsc' | 'priceDesc' | 'prepTime'>('rating');
  const [visibleCount, setVisibleCount] = useState<number>(12); // Lazy loading simulation
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Voice Recognition States
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    return !!SpeechRecognitionClass;
  });
  const [voiceFeedback, setVoiceFeedback] = useState<string>('');

  const startListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      setVoiceFeedback('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.lang = 'en-IN'; // Indian-English accent
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceFeedback('Listening... Say a food name like Biryani, Pizza, Kebab, Snickers, Dosa or sweet...');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setVisibleCount(12);
        setVoiceFeedback(`Search locked: "${transcript}"`);
        setTimeout(() => setVoiceFeedback(''), 4000);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          setVoiceFeedback('Microphone permission blocked by browser.');
        } else {
          setVoiceFeedback(`Error capturing voice: ${event.error}`);
        }
        setIsListening(false);
        setTimeout(() => setVoiceFeedback(''), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };
  
  // Advanced Swiggy/Zomato Multi-Faceted Filters
  const [activeSwiggyFilters, setActiveSwiggyFilters] = useState<string[]>([]);

  // Filter & Search computation
  const filteredFoods = useMemo(() => {
    let result = foods.slice();

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Search term query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Advanced Swiggy-style exact Multi-Filter criteria (Conjunctive - matches all selected)
    if (activeSwiggyFilters.includes('high-protein')) {
      result = result.filter((item) => {
        const titleAndDesc = (item.name + ' ' + item.description).toLowerCase();
        const hasProteinTag = item.tags.some(t => /protein/i.test(t));
        const highProteinIngredients = /(chicken|kebab|tikka|paneer|tofu|lamb|fish|prawn|egg|mutton|keema|almond|peanut|soy|soya|bean|chickpea|cod|kabab)/i.test(titleAndDesc);
        return hasProteinTag || highProteinIngredients;
      });
    }

    if (activeSwiggyFilters.includes('less-calories')) {
      result = result.filter((item) => item.calories > 0 && item.calories < 300);
    }

    if (activeSwiggyFilters.includes('no-sugar')) {
      result = result.filter((item) => {
        const titleAndDesc = (item.name + ' ' + item.description).toLowerCase();
        const matchesSugarFree = /no sugar|sugar free|sugar-free|unsweetened|diabetic|zero sugar/i.test(titleAndDesc);
        const isDessertOrShake = item.category === 'Desserts' || /shake|milkyway|fudge|chocolate|sweets|baklava|halwa|gulab|rasgulla/i.test(titleAndDesc);
        return matchesSugarFree || !isDessertOrShake;
      });
    }

    if (activeSwiggyFilters.includes('tangy')) {
      result = result.filter((item) => {
        const titleAndDesc = (item.name + ' ' + item.description).toLowerCase();
        return /tangy|zesty|citrus|lemon|lime|tomato|tamarind|kokum|mojito|sour|cranberry|pomegranate|orange/i.test(titleAndDesc);
      });
    }

    if (activeSwiggyFilters.includes('spicy')) {
      result = result.filter((item) => {
        const titleAndDesc = (item.name + ' ' + item.description).toLowerCase();
        const hasSpicyTag = item.tags.some(t => /spicy/i.test(t));
        return hasSpicyTag || /spicy|chili|hot|jalapeno|podi|sichuan|spiced|gunpowder|mirch|masala/i.test(titleAndDesc);
      });
    }

    if (activeSwiggyFilters.includes('fast-delivery')) {
      result = result.filter((item) => item.prepTime <= 10);
    }

    if (activeSwiggyFilters.includes('bestseller')) {
      result = result.filter((item) => item.isBestSeller || item.rating >= 4.7 || item.tags.some(t => /best seller/i.test(t)));
    }

    if (activeSwiggyFilters.includes('budget')) {
      result = result.filter((item) => item.price <= 250);
    }

    // Price limitation
    result = result.filter((item) => item.price <= priceRange);

    // Rating minimum
    if (minRating > 0) {
      result = result.filter((item) => item.rating >= minRating);
    }

    // Vegetarian filter (Tags contain Vegetarian or Veg or Paneer or Rice Crepe)
    if (onlyVeg) {
      result = result.filter((item) =>
        item.tags.some(
          (t) =>
            t.toLowerCase() === 'vegetarian' ||
            t.toLowerCase() === 'veg' ||
            t.toLowerCase().includes('paneer') ||
            item.description.toLowerCase().includes('paneer')
        )
      );
    }

    // Sorting operations
    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'prepTime') {
      result.sort((a, b) => a.prepTime - b.prepTime);
    }

    return result;
  }, [foods, selectedCategory, searchQuery, priceRange, minRating, onlyVeg, sortBy, activeSwiggyFilters]);

  const loadMoreItems = () => {
    setVisibleCount((prev) => Math.min(prev + 12, filteredFoods.length));
  };

  const getCartQuantity = (foodId: string) => {
    return cart.find((i) => i.foodId === foodId)?.quantity || 0;
  };

  const swiggyFilterCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    // 1. High Protein
    counts['high-protein'] = foods.filter((item) => {
      const titleAndDesc = (item.name + ' ' + item.description).toLowerCase();
      const hasProteinTag = item.tags.some(t => /protein/i.test(t));
      const highProteinIngredients = /(chicken|kebab|tikka|paneer|tofu|lamb|fish|prawn|egg|mutton|keema|almond|peanut|soy|soya|bean|chickpea|cod|kabab)/i.test(titleAndDesc);
      return hasProteinTag || highProteinIngredients;
    }).length;

    // 2. Less calories
    counts['less-calories'] = foods.filter((item) => item.calories > 0 && item.calories < 300).length;

    // 3. No added sugar
    counts['no-sugar'] = foods.filter((item) => {
      const titleAndDesc = (item.name + ' ' + item.description).toLowerCase();
      const matchesSugarFree = /no sugar|sugar free|sugar-free|unsweetened|diabetic|zero sugar/i.test(titleAndDesc);
      const isDessertOrShake = item.category === 'Desserts' || /shake|milkyway|fudge|chocolate|sweets|baklava|halwa|gulab|rasgulla/i.test(titleAndDesc);
      return matchesSugarFree || !isDessertOrShake;
    }).length;

    // 4. Tangy Swirls
    counts['tangy'] = foods.filter((item) => {
      const titleAndDesc = (item.name + ' ' + item.description).toLowerCase();
      return /tangy|zesty|citrus|lemon|lime|tomato|tamarind|kokum|mojito|sour|cranberry|pomegranate|orange/i.test(titleAndDesc);
    }).length;

    // 5. Fiery Spicy
    counts['spicy'] = foods.filter((item) => {
      const titleAndDesc = (item.name + ' ' + item.description).toLowerCase();
      const hasSpicyTag = item.tags.some(t => /spicy/i.test(t));
      return hasSpicyTag || /spicy|chili|hot|jalapeno|podi|sichuan|spiced|gunpowder|mirch|masala/i.test(titleAndDesc);
    }).length;

    // 6. Super Fast Delivery
    counts['fast-delivery'] = foods.filter((item) => item.prepTime <= 10).length;

    // 7. Best Sellers
    counts['bestseller'] = foods.filter((item) => item.isBestSeller || item.rating >= 4.7 || item.tags.some(t => /best seller/i.test(t))).length;

    // 8. Great budget
    counts['budget'] = foods.filter((item) => item.price <= 250).length;

    return counts;
  }, [foods]);

  const toggleSwiggyFilter = (filterId: string) => {
    setActiveSwiggyFilters((prev) => {
      const idx = prev.indexOf(filterId);
      if (idx !== -1) {
        return prev.filter((id) => id !== filterId);
      } else {
        return [...prev, filterId];
      }
    });
    setVisibleCount(12);
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setPriceRange(1000);
    setMinRating(0);
    setOnlyVeg(false);
    setSortBy('rating');
    setActiveSwiggyFilters([]);
    setVisibleCount(12);
  };

  return (
    <div className="bg-[#0d0d0d] py-16 scroll-mt-20 border-t border-neutral-900" id="interactive-menu-experience">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-xs font-bold text-[#FF5A1F] uppercase tracking-[0.2em] font-mono">
              The Gastronome Catalogue
            </h2>
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl mt-2 font-sans">
              Order Exceptional Creations
            </h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-xl">
              Freshly hand-cooked in-house matching elite quality standards, with high-fidelity thermal seals.
            </p>
          </div>

          {/* Quick Search and Filter Buttons */}
          <div className="flex flex-col items-end gap-2 text-right md:-mt-1">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <input
                  type="text"
                  placeholder="Search food, ingredients, categories..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleCount(12); // reset lazy load
                  }}
                  className="w-full rounded-xl border border-neutral-800 bg-[#171717] px-4 py-3 pl-11 pr-10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF5A1F] transition duration-200 font-sans"
                  id="menu-search-input"
                />
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-neutral-500" />
                
                {/* Voice Search Microphone Button with Web Speech API */}
                <button
                  type="button"
                  onClick={startListening}
                  className={`absolute right-3 top-2.5 p-1.5 rounded-lg transition-all duration-300 cursor-pointer select-none flex items-center justify-center ${
                    isListening
                      ? 'bg-rose-500/25 text-rose-400 border border-rose-500/40 animate-pulse shadow-md shadow-rose-500/5'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                  title={isListening ? "Listening... Speak now!" : "Search by voice (Microphone)"}
                  id="search-microphone-voice-btn"
                >
                  {isListening ? (
                    <Mic className="h-3.5 w-3.5 text-rose-400 animate-bounce" />
                  ) : (
                    <Mic className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`flex items-center gap-2 rounded-xl px-4 py-3 border text-xs font-semibold cursor-pointer transition ${
                  sidebarOpen || onlyVeg || priceRange < 1000 || minRating > 0
                    ? 'border-[#FF8C42] bg-[#FF8C42]/10 text-white'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:border-neutral-700'
                }`}
                id="toggle-sidebar-filters-btn"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>

            {/* Voice feedback mic helper active banner */}
            <AnimatePresence>
              {voiceFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-[10px] font-mono font-bold bg-[#141414] border border-neutral-850 px-3.5 py-1.5 rounded-lg flex items-center gap-2 text-neutral-300"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-rose-500 animate-pulse border border-rose-400' : 'bg-emerald-500'}`} />
                  <span className={isListening ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}>{voiceFeedback}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Floating Faceted Filters panel */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 overflow-hidden rounded-2xl border border-neutral-800 bg-[#171717] p-6 shadow-2xl"
              id="collapsed-filters-drawer"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Sort selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 font-mono uppercase">Sort Foods</label>
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-[#0d0d0d] p-3 text-xs text-white focus:outline-none focus:border-[#FF5A1F]"
                  >
                    <option value="rating">Top Rated (Default)</option>
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                    <option value="prepTime">Fast Preparation Time</option>
                  </select>
                </div>

                {/* Price Dial limits */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-400 font-mono">
                    <span className="uppercase">Maximum Budget</span>
                    <span className="text-[#FF5A1F]">₹{priceRange}</span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="1000"
                    step="50"
                    value={priceRange}
                    onChange={(e) => {
                      setPriceRange(parseInt(e.target.value));
                      setVisibleCount(12);
                    }}
                    className="w-full accent-[#FF5A1F] cursor-pointer bg-neutral-800 h-1.5 rounded-lg"
                  />
                </div>

                {/* Stars limits */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 font-mono uppercase block">Minimum Rating</label>
                  <div className="flex gap-2">
                    {[0, 4.2, 4.5, 4.7].map((stars) => (
                      <button
                        key={stars}
                        onClick={() => {
                          setMinRating(stars);
                          setVisibleCount(12);
                        }}
                        className={`flex-1 rounded-lg py-2 border text-xs font-bold transition duration-200 cursor-pointer ${
                          minRating === stars
                            ? 'border-[#FFD166] bg-[#FFD166]/10 text-[#FFD166]'
                            : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700 hover:text-white'
                        }`}
                      >
                        {stars === 0 ? 'Any' : `${stars}★+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vegetarian / Reset buttons */}
                <div className="flex flex-col justify-end gap-3">
                  <button
                    onClick={() => {
                      setOnlyVeg(!onlyVeg);
                      setVisibleCount(12);
                    }}
                    className={`flex items-center justify-center gap-2 rounded-xl py-2.5 border text-xs font-bold transition cursor-pointer ${
                      onlyVeg
                        ? 'border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700 hover:text-white'
                    }`}
                  >
                    <div className={`h-3.5 w-3.5 rounded-sm border flex items-center justify-center ${onlyVeg ? 'border-[#22C55E] bg-[#22C55E]' : 'border-neutral-700'}`}>
                      {onlyVeg && <Check className="h-2 w-2 text-[#0d0d0d] stroke-[4]" />}
                    </div>
                    <span>100% Pure Veg Sourced</span>
                  </button>

                  <button
                    onClick={resetFilters}
                    className="flex items-center justify-center gap-2 rounded-xl py-2.5 border border-dashed border-neutral-800 text-neutral-500 hover:text-white hover:border-neutral-500 text-xs transition cursor-pointer font-semibold"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Reset All Filters
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Horizontal Filter Pill Belt */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 h-14 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setVisibleCount(12); // reset simulation
              }}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-bold cursor-pointer transition duration-300 ${
                selectedCategory === cat
                  ? 'bg-[#FF5A1F] text-white shadow-lg shadow-[#FF5A1F]/10'
                  : 'bg-[#171717] text-neutral-400 hover:text-white border border-neutral-800/80 hover:border-[#FF5A1F]/30'
              }`}
            >
              {CATEGORY_DISPLAY_NAMES[cat] || cat}
            </button>
          ))}
        </div>

        {/* Swiggy/Zomato style dynamic quick-filter-bar */}
        <div className="bg-[#121212] border border-neutral-900/60 rounded-2xl p-4 sm:p-5 mb-10 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#FF5A1F]" />
              <span className="text-[11px] font-black uppercase tracking-wider text-white font-sans">
                Premium Gourmet Quick Filters
              </span>
              <span className="text-[9px] bg-[#FF5A1F]/10 text-[#FF8C42] border border-[#FF5A1F]/20 px-1.5 py-0.5 rounded-md font-mono font-bold">
                Live Counters
              </span>
            </div>
            {activeSwiggyFilters.length > 0 && (
              <button
                onClick={() => {
                  setActiveSwiggyFilters([]);
                  setVisibleCount(12);
                }}
                className="text-[10px] font-bold text-neutral-500 hover:text-white transition duration-200 cursor-pointer flex items-center gap-1 self-start sm:self-auto uppercase tracking-wide bg-neutral-950 py-1 px-2.5 rounded-lg border border-neutral-900/40"
              >
                Clear All Styles ({activeSwiggyFilters.length})
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {SWIGGY_FILTERS.map((f) => {
              const isActive = activeSwiggyFilters.includes(f.id);
              const count = swiggyFilterCounts[f.id] || 0;
              return (
                <button
                  key={f.id}
                  onClick={() => toggleSwiggyFilter(f.id)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 sm:px-3.5 sm:py-2 text-[11px] font-bold transition duration-300 cursor-pointer select-none active:scale-95 duration-200 ${
                    isActive
                      ? 'border-[#FF5A1F] bg-[#FF5A1F]/10 text-[#FF8C42] shadow-[0_0_15px_rgba(255,90,31,0.06)] scale-102 font-extrabold'
                      : f.color
                  }`}
                >
                  {isActive && <Check className="h-3 w-3 stroke-[3.5] text-[#FF8C42]" />}
                  <span>{f.label}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-black ${
                    isActive 
                      ? 'bg-[#FF5A1F] text-white' 
                      : 'bg-neutral-950 text-neutral-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Counter of Results */}
        <div className="flex items-center justify-between text-xs text-neutral-400 font-mono mb-6">
          <span>
            Showing <strong className="text-white">{Math.min(visibleCount, filteredFoods.length)}</strong> of{' '}
            <strong className="text-[#FF5A1F]">{filteredFoods.length}</strong> creations
          </span>
          {onlyVeg && <span className="text-[#22C55E] flex items-center gap-1">● Veg Only Active</span>}
        </div>

        {/* Food Grid */}
        {filteredFoods.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" id="foods-interactive-grid">
            <AnimatePresence mode="popLayout">
              {filteredFoods.slice(0, visibleCount).map((food) => {
                const isSelectedWishlist = wishlist.includes(food.id);
                const quantity = getCartQuantity(food.id);

                return (
                  <motion.div
                    key={food.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-800/80 bg-[#171717] p-3 transition-colors duration-300 hover:border-[#FF5A1F]/30 hover:bg-[#1f1f1f]/80"
                  >
                    
                    {/* Upper Image Section */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800">
                      
                      {/* Food Photo */}
                      <img
                        loading="lazy"
                        src={food.image}
                        alt={food.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />

                      {/* Floating badging */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                        {food.isBestSeller && (
                          <span className="rounded-md bg-gradient-to-r from-[#FF5A1F] to-[#FF8C42] px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                            Best Seller
                          </span>
                        )}
                        {food.isTrending && (
                          <span className="rounded-md bg-gradient-to-r from-blue-600 to-[#FFD166] px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                            Trending
                          </span>
                        )}
                      </div>

                      {/* Floating Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(food.id)}
                        className={`absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg border backdrop-blur-md transition cursor-pointer shadow-sm ${
                          isSelectedWishlist
                            ? 'bg-red-600/10 border-red-500 text-red-500'
                            : 'bg-[#0d0d0d]/40 border-neutral-700 text-neutral-300 hover:scale-110 hover:text-red-500'
                        }`}
                        title="Add to wishlist portfolio"
                        id={`wishlist-toggle-${food.id}`}
                      >
                        <Heart className={`h-4 w-4 ${isSelectedWishlist ? 'fill-current' : ''}`} />
                      </button>

                      {/* Prep Time & Calories indicator banner */}
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between rounded-lg bg-[#0d0d0d]/80 px-2.5 py-1 text-[10px] text-neutral-300 backdrop-blur-md font-mono border border-neutral-800/40">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-[#FF5A1F]" /> {food.prepTime} Mins
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame className="h-3 w-3 text-[#FFD166]" /> {food.calories} Kcal
                        </span>
                      </div>

                    </div>

                    {/* Meta and description block */}
                    <div className="mt-3 flex-1 flex flex-col justify-between">
                      <div>
                        
                        {/* Rating and category */}
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-neutral-500 uppercase tracking-widest">{CATEGORY_BADGE_NAMES[food.category] || food.category}</span>
                          <span className="text-[#FFD166] flex items-center gap-0.5">
                            ★ {food.rating}{' '}
                            <span className="text-neutral-500 font-normal">({food.reviewCount})</span>
                          </span>
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-sm font-bold text-white font-sans mt-1 group-hover:text-[#FF8C42] transition">
                          {food.name}
                        </h3>
                        <p className="text-xs text-neutral-400 font-sans mt-1 line-clamp-2 leading-relaxed">
                          {food.description}
                        </p>

                        {/* Tag badges */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {food.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-md bg-neutral-900 px-2 py-0.5 text-[9px] font-semibold text-neutral-500 border border-neutral-800"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                      </div>

                      {/* Card Action footer values */}
                      <div className="mt-4 flex items-center justify-between pt-2.5 border-t border-neutral-850">
                        <span className="text-sm font-black text-white">₹{food.price}</span>
                        <div className="flex items-center gap-1.5">
                          {/* Order Now (Immediate direct purchase terminal) */}
                          <button
                            onClick={() => onOpenDirectOrder(food)}
                            className="rounded-lg bg-gradient-to-r from-[#FF5A1F] to-[#FF8C42] hover:brightness-110 text-[10px] font-bold px-2 py-1.5 cursor-pointer flex items-center gap-1 text-white shadow-md shadow-[#FF5A1F]/5"
                          >
                            ⚡ Order Now
                          </button>

                          {quantity > 0 ? (
                            <div className="flex items-center gap-1 rounded-lg bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 p-0.5">
                              <button
                                onClick={() => addToCart(food.id, false)}
                                className="px-1.5 py-0.5 text-xs font-black text-[#FF5A1F] hover:text-white transition"
                              >
                                -
                              </button>
                              <span className="px-1 text-[10px] font-black text-[#FF8C42] min-w-[10px] text-center">
                                {quantity}
                              </span>
                              <button
                                onClick={() => addToCart(food.id, true)}
                                className="px-1.5 py-0.5 text-xs font-black text-[#FF5A1F] hover:text-white transition"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(food.id, true)}
                              className="flex items-center gap-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:text-white hover:border-[#FF5A1F]/40 px-2 py-1.5 text-[10px] font-bold text-neutral-400 transition cursor-pointer"
                              id={`add-to-cart-${food.id}`}
                            >
                              <span>Add</span>
                            </button>
                          )}
                        </div>
                      </div>

                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-neutral-800 rounded-3xl">
            <svg
              className="mx-auto h-12 w-12 text-neutral-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 text-sm font-bold text-white">No creations matched filters</h3>
            <p className="mt-2 text-xs text-neutral-400">Try loosening your price sliders, category picks or search terms.</p>
            <button
              onClick={resetFilters}
              className="mt-6 rounded-xl bg-gradient-to-r from-[#FF5A1F] to-[#FF8C42] px-4 py-2.5 text-xs font-semibold text-white cursor-pointer"
            >
              Clear All Filtres
            </button>
          </div>
        )}

        {/* Lazy Loading load-more CTAs */}
        {filteredFoods.length > visibleCount && (
          <div className="mt-12 text-center">
            <button
              onClick={loadMoreItems}
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 hover:border-neutral-700 hover:bg-neutral-800 px-6 py-3 px-8 text-xs font-extrabold text-white cursor-pointer transition-all"
              id="menu-load-more"
            >
              Load Additional Gourmet Dishes
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
