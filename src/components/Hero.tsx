import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, CookingPot, Flame, Award, Users, CheckCircle, ShoppingCart, Check, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onExploreMenu: () => void;
  onAskAI: () => void;
  addToCart?: (foodId: string, add?: boolean) => void;
}

// 20 premium hand-curated dishes requested by the user with exact matching images
const CAROUSEL_DISHES = [
  {
    id: "disc-panipuri",
    name: "Crispy Pani Puri",
    price: 139,
    rating: 4.9,
    reviews: 284,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
    badge: "🔥 STREET SPECIAL",
    description: "Crisp hollow pastry balls filled with potato spice smash and loaded with vibrant mint spiced water."
  },
  {
    id: "disc-golgappa",
    name: "Golgappa Delhi Delight",
    price: 129,
    rating: 4.8,
    reviews: 219,
    image: "https://images.unsplash.com/photo-1626132027584-6d9bba1e9e73?w=600&auto=format&fit=crop&q=80",
    badge: "🥇 BEST SELLER",
    description: "Crunchy puffed spheres filled with black chickpeas potatoes and sweet tamarind paste."
  },
  {
    id: "disc-dahipuri",
    name: "Dahi Sev Puri",
    price: 169,
    rating: 4.9,
    reviews: 194,
    image: "https://images.unsplash.com/photo-1566417713040-40db38e61e05?w=600&auto=format&fit=crop&q=80",
    badge: "✨ MUST TRY",
    description: "Crispy flat puris loaded with potatoes, cooked seasoning, cooled sweet curd and fine yellow sev."
  },
  {
    id: "disc-bhelpuri",
    name: "Street Bhel Puri",
    price: 119,
    rating: 4.7,
    reviews: 162,
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80",
    badge: "🌟 MUMBAI HARBOR",
    description: "Traditional dry snack mix of puffed rice, roasted peanuts, tangy sauces and fresh coriander."
  },
  {
    id: "disc-samosa",
    name: "Classic Samosa",
    price: 99,
    rating: 4.7,
    reviews: 308,
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=80",
    badge: "☕ COFFEE COMPANION",
    description: "Golden triangular pastries loaded with cumin roasted potato bits and organic sweet green peas."
  },
  {
    id: "disc-kachori",
    name: "Moong Dal Kachori",
    price: 119,
    rating: 4.6,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=600&auto=format&fit=crop&crop=entropy",
    badge: "👑 SAVORY PREMIUM",
    description: "Flaky circular deep-fried shells packed with spiced moong lentils and dry ginger notes."
  },
  {
    id: "disc-pavbhaji",
    name: "Masala Pav Bhaji",
    price: 199,
    rating: 4.9,
    reviews: 388,
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop&q=80",
    badge: "👨‍🍳 CHEF SIGNATURE",
    description: "Thick hand-mashed vegetable griddle stew served with double-buttered fluffy pav buns."
  },
  {
    id: "disc-vadapav",
    name: "Midnight Vada Pav",
    price: 119,
    rating: 4.8,
    reviews: 341,
    image: "https://images.unsplash.com/photo-1542571361-a50172294c94?w=600&auto=format&fit=crop&q=80",
    badge: "🚀 HIGH SPICE",
    description: "Crispy chickpea-coated potato core dumpling stacked with dry hot garlic chili sand crumbs."
  },
  {
    id: "disc-momos",
    name: "Steamed Vegetable Momos",
    price: 159,
    rating: 4.8,
    reviews: 299,
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80",
    badge: "⚡ DUMPLING CLUB",
    description: "Delicate steamed visual pockets packed with seasoned cabbage shreds, ginger, and scallions."
  },
  {
    id: "disc-springroll",
    name: "Golden Spring Rolls",
    price: 149,
    rating: 4.7,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
    badge: "💎 SUPER CRUNCHY",
    description: "Crisp wheat wrappers loaded with wok cooked sweet julienned cabbage carrots and glass noodles."
  },
  {
    id: "disc-chowmein",
    name: "Street Style Chowmein",
    price: 179,
    rating: 4.8,
    reviews: 236,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80",
    badge: "🍜 HIGH SEAR WOK",
    description: "Classic stir-fried noodles tossed with green bell pepper juliennes and standard vinegar."
  },
  {
    id: "disc-hakkanoodles",
    name: "Hakka Sesame Noodles",
    price: 189,
    rating: 4.8,
    reviews: 254,
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&auto=format&fit=crop&q=80",
    badge: "🍜 INDO-CHINESE SELECT",
    description: "Premium wheat noodles wok tossed with sweet scallions, light soy essence, and rich garlic."
  },
  {
    id: "disc-paneertikka",
    name: "Tandoori Paneer Tikka",
    price: 329,
    rating: 4.9,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop&q=80",
    badge: "🔥 CLAY OVEN GRILLED",
    description: "Creamy fresh paneer blocks hand marinated with red Greek yogurt and chargrilled."
  },
  {
    id: "disc-masaladosa",
    name: "Chettinad Masala Dosa",
    price: 199,
    rating: 4.9,
    reviews: 460,
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80",
    badge: "🥞 CRISP SOUTH",
    description: "Delightful crispy stone ground rice crepe with a seasoned potatoes savory core."
  },
  {
    id: "disc-margheritapizza",
    name: "Woodfire Margherita Pizza",
    price: 499,
    rating: 4.9,
    reviews: 391,
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80",
    badge: "🍕 NAPOLI FARE",
    description: "Handcrafted thin wheat crust loaded with pure San Marzano tomatoes and mozzarella cheese."
  },
  {
    id: "disc-cheeseburger",
    name: "Premium Cheddar Burger",
    price: 299,
    rating: 4.8,
    reviews: 310,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    badge: "🍔 AMERICAN DELUXE",
    description: "Flame-grilled thick patty topped with aged melted cheddar cheese and salted gherkins."
  },
  {
    id: "disc-tacos",
    name: "Smoked Lime Tacos",
    price: 229,
    rating: 4.8,
    reviews: 198,
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80",
    badge: "🌮 MEXICAN CRAFT",
    description: "Double crispy pockets packed with seasoned refried beans, sweet corn, and lime."
  },
  {
    id: "disc-sushi",
    name: "Kyoto Style Maki Sushi",
    price: 449,
    rating: 4.9,
    reviews: 320,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80",
    badge: "🍣 AVOCADO LUXURY",
    description: "Short grain vinegar rice wrap supporting cool ripe avocado slices and fresh house wasabi paste."
  },
  {
    id: "disc-ramen",
    name: "Spiced Miso Ramen Bowl",
    price: 499,
    rating: 4.9,
    reviews: 350,
    image: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=600&auto=format&fit=crop&q=80",
    badge: "🍜 NOODLE MASTERPIECE",
    description: "Warm extraction vegetable broth layered with custom long wheat noodles and bamboo sheets."
  },
  {
    id: "disc-cheesecake",
    name: "New York Strawberry Cheesecake",
    price: 289,
    rating: 4.9,
    reviews: 351,
    image: "https://images.unsplash.com/photo-1524351199679-46cddf530c04?w=600&auto=format&fit=crop&q=80",
    badge: "🍰 PATISSERIE ROYAL",
    description: "Creamy vanilla cheese mousse over crusty honey graham cracker baked base with strawberry syrup."
  }
];

export default function Hero({ onExploreMenu, onAskAI, addToCart }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive device setup for beautiful side card transformations
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const len = CAROUSEL_DISHES.length;
  const prevIndex = (currentIndex - 1 + len) % len;
  const nextIndex = (currentIndex + 1) % len;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % len);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + len) % len);
  };

  // Autoplay function
  useEffect(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
    if (isPlaying) {
      autoplayTimerRef.current = setInterval(() => {
        handleNext();
      }, 3500);
    }
    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [currentIndex, isPlaying]);

  // Feed-back cart addition
  const handleAddToCartWithFeedback = (item: typeof CAROUSEL_DISHES[0], e: React.MouseEvent) => {
    e.stopPropagation();
    if (addToCart) {
      addToCart(item.id, true);
      setAddedIds((prev) => [...prev, item.id]);
      setTimeout(() => {
        setAddedIds((prev) => prev.filter((id) => id !== item.id));
      }, 1500);
    }
  };

  const trustStats = [
    { value: '48K+', label: 'Orders Delivered', subtext: 'Ultra-fast dispatch', icon: CookingPot },
    { value: '99.8%', label: 'Trust Score', subtext: 'Excellent rating metrics', icon: Star },
    { value: '12K+', label: 'Loyal Connoisseurs', subtext: 'Signed app accounts', icon: Users },
    { value: '2.5K+', label: 'Daily Fresh Platters', subtext: 'Sourced from elite kitchen', icon: Flame },
  ];

  return (
    <div className="relative overflow-hidden bg-[#0a0a0a] pt-12 pb-24 sm:pt-20 lg:pt-28 border-b border-neutral-900">
      {/* Brand Aesthetic Background Elements & Ambient Lighting */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF5A1F]/[0.05] blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 -z-10 h-[350px] w-[350px] rounded-full bg-[#FF8C42]/[0.03] blur-[110px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Headline and Narrative Column (LEFT SIDE) */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* VIP Welcoming Tag */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 px-4 py-1.5"
            >
              <Flame className="h-4 w-4 text-[#FF8C42] animate-pulse" />
              <span className="font-mono text-[10px] font-black tracking-[0.2em] text-[#FFD166] uppercase">
                EXCEPTIONAL CULINARY BRANDING
              </span>
            </motion.div>

            {/* Cinematic Large Typography */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-sans text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl leading-tight"
              >
                Experience <br className="hidden md:inline" />
                <span className="bg-gradient-to-r from-white via-white to-neutral-400 bg-clip-text text-transparent">
                  Extraordinary
                </span>{' '}
                <br />
                <span className="bg-gradient-to-r from-[#FF5A1F] via-[#FF8C42] to-[#FFD166] bg-clip-text text-transparent">
                  Food Delivery
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="mx-auto lg:mx-0 max-w-xl text-md text-neutral-400 font-sans leading-relaxed"
              >
                Discover freshly prepared meals, delivered fast with exceptional quality, premium thermal container sealing, and chef-curated premium flavors.
              </motion.p>
            </div>

            {/* Dynamic CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button
                onClick={onExploreMenu}
                className="group w-full sm:w-auto relative flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF5A1F] to-[#FF8C42] px-8 py-4.5 text-base font-bold text-white shadow-xl shadow-[#FF5A1F]/20 hover:shadow-[#FF5A1F]/40 hover:brightness-110 transition-all cursor-pointer"
                id="hero-explore-menu-btn"
              >
                Explore Interactive Menu
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onAskAI}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900 px-8 py-4.5 text-base font-bold text-neutral-200 hover:text-white hover:bg-neutral-800 hover:border-neutral-700 transition-all cursor-pointer"
                id="hero-ai-chat-btn"
              >
                Tailor with Spex Chef AI
              </button>
            </motion.div>

            {/* Visual reassurance stamps */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-medium text-neutral-500 font-mono"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-[#FF5A1F]" /> No minimum subtotal order
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-[#FF8C42]" /> 100% Thermal Bag Sealing
              </div>
            </motion.div>
          </div>

          {/* Interactive Food Showcase Carousel Column (RIGHT SIDE) */}
          <div 
            className="lg:col-span-5 relative mt-8 lg:mt-0 flex flex-col items-center justify-center select-none overflow-visible"
            onMouseEnter={() => setIsPlaying(false)}
            onMouseLeave={() => setIsPlaying(true)}
          >
            {/* Left and Right Glowing ambient circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-[#FF5A1F]/[0.02] border border-[#FF5A1F]/5 filter blur-3xl pointer-events-none" />

            {/* 3D Sliding Deck Container wrapper */}
            <div className="relative w-full h-[460px] flex items-center justify-center overflow-visible">
              
              <AnimatePresence initial={false}>
                {CAROUSEL_DISHES.map((item, index) => {
                  const isCenter = index === currentIndex;
                  const isLeft = index === prevIndex;
                  const isRight = index === nextIndex;

                  // Render only centered and partially visible left & right cards
                  if (!isCenter && !isLeft && !isRight) return null;

                  let xPosition = 0;
                  if (isLeft) xPosition = isMobile ? -100 : -140;
                  if (isRight) xPosition = isMobile ? 100 : 140;

                  return (
                    <motion.div
                      key={item.id}
                      style={{
                        position: 'absolute',
                      }}
                      initial={{
                        opacity: 0,
                        scale: 0.75,
                        x: isLeft ? -180 : 180,
                        rotateY: isLeft ? 35 : -35,
                        zIndex: 5,
                      }}
                      animate={{
                        opacity: isCenter ? 1 : 0.45,
                        scale: isCenter ? 1.05 : 0.82,
                        x: xPosition,
                        rotateY: isCenter ? 0 : (isLeft ? 24 : -24),
                        rotate: isCenter ? 0 : (isLeft ? -5 : 5),
                        zIndex: isCenter ? 30 : 10,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.7,
                        zIndex: 1,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 140,
                        damping: 20,
                      }}
                      drag={isCenter ? "x" : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={1}
                      onDragEnd={(e, info) => {
                        const swipeThreshold = 50;
                        if (info.offset.x < -swipeThreshold) {
                          handleNext();
                        } else if (info.offset.x > swipeThreshold) {
                          handlePrev();
                        }
                      }}
                      onClick={() => {
                        if (isLeft) handlePrev();
                        if (isRight) handleNext();
                      }}
                      className={`w-[260px] md:w-[305px] rounded-[30px] border overflow-hidden transition-all duration-300 ${
                        isCenter 
                          ? 'bg-[#0d0d0d] border-[#FF5A1F]/40 shadow-[0_0_35px_rgba(255,90,31,0.35)] cursor-grab active:cursor-grabbing ring-1 ring-[#FF5A1F]/20' 
                          : 'bg-[#0d0d0d]/85 border-neutral-850 scale-90 blur-[1px] hover:brightness-125 cursor-pointer'
                      }`}
                    >
                      {/* Food Card Cover and Badge */}
                      <div className="relative h-48 md:h-52 overflow-hidden bg-neutral-900">
                        {/* Status/Promo Badge */}
                        <div className="absolute top-3 left-3 z-40">
                          <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-lg font-mono ${
                            item.badge.includes('BEST') 
                              ? 'bg-[#FF5A1F] text-white' 
                              : 'bg-neutral-900 border border-neutral-700 text-[#FFD166]'
                          }`}>
                            {item.badge}
                          </span>
                        </div>

                        {/* Top Right Food Category Star */}
                        <div className="absolute top-3 right-3 z-40 bg-zinc-950/80 px-2.5 py-1 rounded-lg border border-neutral-800 flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current text-yellow-500" />
                          <span className="text-[10px] font-mono font-bold text-white">{item.rating}</span>
                        </div>

                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-700 pointer-events-none select-none hover:scale-105"
                        />
                        {/* Black and Orange fading vignette overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/40 to-transparent pointer-events-none" />
                      </div>

                      {/* Card Bottom Details & Quick Transaction Bar */}
                      <div className="p-5 space-y-3.5">
                        <div className="space-y-1">
                          <h3 className="text-sm md:text-base font-extrabold text-white tracking-tight leading-tight line-clamp-1">
                            {item.name}
                          </h3>
                          <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed min-h-[30px]">
                            {item.description}
                          </p>
                        </div>

                        {/* Price, Score Metrics & Button Actions */}
                        <div className="flex items-center justify-between pt-1 border-t border-neutral-900">
                          <div className="flex flex-col">
                            <span className="text-[7.5px] font-mono text-neutral-500 uppercase tracking-widest">Rate Card</span>
                            <span className="text-base md:text-lg font-black text-white">₹{item.price}</span>
                          </div>

                          {/* Quick Checkout / Add to cart with feedback */}
                          {isCenter && (
                            <button
                              onClick={(e) => handleAddToCartWithFeedback(item, e)}
                              className={`rounded-xl text-[9px] font-black tracking-widest px-4 py-2.5 uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                                addedIds.includes(item.id)
                                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-white text-black hover:bg-[#FF5A1F] hover:text-white border border-transparent shadow-lg shadow-white/5 active:scale-95'
                              }`}
                            >
                              {addedIds.includes(item.id) ? (
                                <>
                                  <Check className="h-3 w-3" />
                                  Added
                                </>
                              ) : (
                                <>
                                  <ShoppingCart className="h-3 w-3" />
                                  Add To Cart
                                </>
                              )}
                            </button>
                          )}
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

            </div>

            {/* Manual Slide Controls Arrow Blocks & Page Matrix */}
            <div className="flex items-center gap-6 mt-4 relative z-40">
              <button
                onClick={handlePrev}
                className="h-10 w-10 rounded-full border border-neutral-800 hover:border-[#FF5A1F]/30 bg-[#0d0d0d] text-white hover:text-[#FF5A1F] flex items-center justify-center transition active:scale-90 cursor-pointer"
                title="Previous delicious item"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex flex-col items-center">
                <div className="flex gap-1.5 mb-1.5">
                  {CAROUSEL_DISHES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1 cursor-pointer rounded-full transition-all duration-300 ${
                        currentIndex === idx ? 'w-4 bg-[#FF5A1F]' : 'w-1 bg-neutral-800 hover:bg-neutral-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                  {currentIndex + 1} OF {len} CURATED SPECIES
                </span>
              </div>

              <button
                onClick={handleNext}
                className="h-10 w-10 rounded-full border border-neutral-800 hover:border-[#FF5A1F]/30 bg-[#0d0d0d] text-white hover:text-[#FF5A1F] flex items-center justify-center transition active:scale-90 cursor-pointer"
                title="Next delicious item"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

          </div>

        </div>

        {/* Customer Trust Stats Section Container */}
        <div className="mt-20 border-t border-neutral-850 pt-16">
          <div className="text-center md:text-left mb-10">
            <h2 className="text-xs font-bold text-[#FFD166] uppercase tracking-[0.2em] font-mono">
              The Spex Trust Matrix
            </h2>
            <p className="text-sm text-neutral-400 mt-1">
              Engineered for seamless transactional excellence and food safety.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {trustStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative bg-[#0d0d0d] rounded-2xl p-5 border border-neutral-850 hover:border-[#FF5A1F]/30 transition duration-300 group"
              >
                <div className="absolute top-4 right-4 text-neutral-800 group-hover:text-[#FF8C42]/20 transition duration-300">
                  <stat.icon className="h-7 w-7" />
                </div>
                <div className="text-3xl font-black text-white tracking-tight">{stat.value}</div>
                <div className="text-sm font-semibold text-neutral-200 mt-2 font-sans">{stat.label}</div>
                <div className="text-xs text-neutral-500 mt-0.5 font-sans leading-relaxed">{stat.subtext}</div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
