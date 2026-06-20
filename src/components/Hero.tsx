import { motion } from 'motion/react';
import { ArrowRight, Star, CookingPot, Flame, Award, Users, CheckCircle } from 'lucide-react';

interface HeroProps {
  onExploreMenu: () => void;
  onAskAI: () => void;
}

export default function Hero({ onExploreMenu, onAskAI }: HeroProps) {
  // Stats counters to show Customer Trust Section
  const trustStats = [
    { value: '48K+', label: 'Orders Delivered', subtext: 'Ultra-fast dispatch', icon: CookingPot },
    { value: '99.8%', label: 'Trust Score', subtext: 'Excellent rating metrics', icon: Star },
    { value: '12K+', label: 'Loyal Connoisseurs', subtext: 'Signed app accounts', icon: Users },
    { value: '2.5K+', label: 'Daily Fresh Platters', subtext: 'Sourced from elite kitchen', icon: Flame },
  ];

  return (
    <div className="relative overflow-hidden bg-[#0d0d0d] pt-12 pb-24 sm:pt-20 lg:pt-28">
      {/* Cinematic Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF5A1F]/10 blur-[120px]" />
      <div className="absolute top-1/3 right-10 -z-10 h-[300px] w-[300px] rounded-full bg-[#FF8C42]/5 blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Headline and Narrative Column */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* VIP Welcoming Tag */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 px-4 py-1.5"
            >
              <Flame className="h-4 w-4 text-[#FF8C42] animate-pulse" />
              <span className="font-mono text-xs font-semibold tracking-wider text-[#FFD166] uppercase">
                Enterprise Culinary Standard
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
                <span className="bg-gradient-to-r from-white via-white to-[#FF8C42] bg-clip-text text-transparent">
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
                className="mx-auto lg:mx-0 max-w-xl text-lg text-neutral-400 font-sans leading-relaxed"
              >
                Discover freshly prepared meals, delivered fast with exceptional quality, premium thermal container sealing, and unforgettable taste.
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
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-[#FF5A1F]" /> No minimum subtotal order
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-[#FF8C42]" /> 100% Thermal Bag Sealing
              </div>
            </motion.div>
          </div>

          {/* Interactive Floating Food Showcase Collage Column */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-80 sm:w-96 select-none"
            >
              {/* Floating Base Ambient Ring */}
              <div className="absolute -inset-4 rounded-full border border-neutral-800/60 [mask-image:linear-gradient(to_bottom,white,transparent)] animate-spin" style={{ animationDuration: '40s' }} />

              {/* Main Gorgeous Burger Base Asset Card */}
              <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-[#171717] p-4 shadow-2xl transition duration-500 hover:border-neutral-700">
                <div className="aspect-square w-full overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 relative group">
                  <img
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80"
                    alt="Premium Signature Wagyu"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-[#0d0d0d]/90 px-3 py-1 text-[10px] font-bold text-[#FFD166] uppercase tracking-wider backdrop-blur-sm">
                    <Award className="h-3 w-3 text-[#FF5A1F]" /> Best Seller
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white font-sans">Wagyu Double Stack</h3>
                    <p className="text-xs text-[#FFC107] flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 fill-current" /> 4.9 <span className="text-neutral-500">(240 reviews)</span>
                    </p>
                  </div>
                  <span className="text-xl font-black text-[#FF5A1F]">₹499</span>
                </div>
              </div>

              {/* Floating mini card 1: Prep Time */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute -top-6 -left-12 flex items-center gap-3 rounded-2xl border border-neutral-800 bg-[#0d0d0d] p-3 shadow-xl backdrop-blur-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22C55E]/10 text-[#22C55E]">
                  <Flame className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Fast Prep</p>
                  <p className="text-xs font-extrabold text-white">Under 25 mins</p>
                </div>
              </motion.div>

              {/* Floating mini card 2: Delivery Rating */}
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-6 -right-10 flex items-center gap-3 rounded-2xl border border-neutral-800 bg-[#0d0d0d] p-3 shadow-xl backdrop-blur-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD166]/10 text-[#FFD166]">
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Hot Dispatch</p>
                  <p className="text-xs font-extrabold text-white">Superb 4.9 Rating</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>

        {/* Customer Trust Stats Section Container */}
        <div className="mt-20 border-t border-neutral-800/80 pt-16">
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
                className="relative bg-[#171717] rounded-2xl p-5 border border-neutral-800 hover:border-[#FF5A1F]/30 transition duration-300 group"
              >
                <div className="absolute top-4 right-4 text-neutral-700 group-hover:text-[#FF8C42]/20 transition duration-300">
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
