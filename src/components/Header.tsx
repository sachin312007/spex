import { useState, useEffect } from 'react';
import { ShoppingBag, Heart, User, ShieldAlert, Sparkles, LogIn, Menu, X, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  activeView: 'home' | 'menu' | 'user' | 'admin' | 'tracking' | 'reservations';
  setActiveView: (view: 'home' | 'menu' | 'user' | 'admin' | 'tracking' | 'reservations') => void;
  openCart: () => void;
  user: UserProfile | null;
  toggleLoginModal: () => void;
  toggleAIModal: () => void;
}

export default function Header({
  cartCount,
  wishlistCount,
  activeView,
  setActiveView,
  openCart,
  user,
  toggleLoginModal,
  toggleAIModal,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [prevCartCount, setPrevCartCount] = useState(cartCount);

  if (cartCount !== prevCartCount) {
    if (cartCount > prevCartCount) {
      setIsPulsing(true);
    }
    setPrevCartCount(cartCount);
  }

  useEffect(() => {
    if (isPulsing) {
      const timer = setTimeout(() => setIsPulsing(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isPulsing]);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Interactive Menu' },
    { id: 'tracking', label: 'Live Tracking' },
    { id: 'reservations', label: 'Reservations' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-[#0d0d0d]/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo Identity */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => setActiveView('home')}
            className="group flex items-center gap-2 cursor-pointer focus:outline-none"
            id="logo-button"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-black shadow-lg shadow-black/40">
              <svg 
                viewBox="0 0 100 100" 
                className="h-full w-full"
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Majestic Orange to Red Warm Luxury Gradient for Line Geometry */}
                  <linearGradient id="logoOrangeRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF8C42" />
                    <stop offset="60%" stopColor="#FF5A1F" />
                    <stop offset="100%" stopColor="#E63946" />
                  </linearGradient>
                  
                  {/* Subtle Background Glow helper */}
                  <radialGradient id="innerSultryGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FF5A1F" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Black Background Circle */}
                <circle cx="50" cy="50" r="50" fill="black" />
                <circle cx="50" cy="50" r="45" fill="url(#innerSultryGlow)" />
                
                {/* Inner shadow grey subtle geometries with warm undertone */}
                <path 
                  d="M50,24 L24,35 L50,51 Z" 
                  fill="#140a05" 
                  stroke="#261208" 
                  strokeWidth="0.5" 
                />
                <path 
                  d="M50,24 L76,35 L50,51 Z" 
                  fill="#1a0d07" 
                  stroke="#261208" 
                  strokeWidth="0.5" 
                />
                <path 
                  d="M10,72 L24,35 L50,57 Z" 
                  fill="#0e0603" 
                  stroke="#1c0c05" 
                  strokeWidth="0.5" 
                />
                <path 
                  d="M90,72 L76,35 L50,57 Z" 
                  fill="#0c0502" 
                  stroke="#1c0c05" 
                  strokeWidth="0.5" 
                />
                <path 
                  d="M32,59 L50,51 L68,59" 
                  stroke="#5c2612" 
                  strokeWidth="0.75" 
                  strokeLinecap="round" 
                />
                <path 
                  d="M32,59 L35,42 M68,59 L65,42" 
                  stroke="#5c2612" 
                  strokeWidth="0.75" 
                  strokeLinecap="round" 
                />
                
                {/* Primary Orange-Red Gradient Line Geometries */}
                <polygon 
                  points="50,24 76,35 50,57 24,35" 
                  stroke="url(#logoOrangeRedGrad)" 
                  strokeWidth="1.5" 
                  strokeLinejoin="round" 
                  fill="none" 
                />
                <polygon 
                  points="50,24 90,72 50,57 10,72" 
                  stroke="url(#logoOrangeRedGrad)" 
                  strokeWidth="1.5" 
                  strokeLinejoin="round" 
                  fill="none" 
                />
                <line 
                  x1="50" 
                  y1="24" 
                  x2="50" 
                  y2="57" 
                  stroke="url(#logoOrangeRedGrad)" 
                  strokeWidth="1.5" 
                />
              </svg>
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-[#FF5A1F] to-[#FF8C42] opacity-0 blur-sm group-hover:opacity-40 transition duration-300"></div>
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="font-mono text-2xl font-black bg-gradient-to-r from-white via-neutral-100 to-[#FF5A1F] bg-clip-text text-transparent tracking-widest uppercase">
                SPEX<span className="text-[#FF5A1F] font-sans">.</span>
              </span>
              <span className="font-mono text-[9px] tracking-widest text-[#FFD166] uppercase mt-0.5">Luxury FoodTech</span>
            </div>
          </button>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveView(link.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`text-sm font-medium transition-colors cursor-pointer relative py-2 ${
                  activeView === link.id ? 'text-[#FF5A1F]' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {link.label}
                {activeView === link.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 h-[2px] w-full bg-[#FF5A1F]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Action Widgets Toolbar */}
        <div className="flex items-center gap-3">
          {/* AI Culinary Assistant Trigger */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleAIModal}
            className="flex items-center gap-2 rounded-full border border-[#FFD166]/30 bg-[#FFD166]/10 px-4 py-2 text-xs font-semibold text-[#FFD166] hover:bg-[#FFD166]/20 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,209,102,0.1)]"
            id="ai-assistant-button"
          >
            <Sparkles className="h-4 w-4 animate-pulse text-[#FFD166]" />
            <span className="hidden sm:inline">Ask AI Chef</span>
          </motion.button>

          {/* Wishlist Button */}
          <button
            onClick={() => setActiveView('user')}
            className="hidden sm:flex relative items-center justify-center p-2.5 text-neutral-400 hover:text-[#FF8C42] border border-neutral-800 rounded-xl hover:bg-neutral-900 transition-all cursor-pointer"
            id="wishlist-header-btn"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF8C42] text-[9px] font-black text-white">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Bag / Cart */}
          <motion.button
            animate={isPulsing ? {
              scale: [1, 1.25, 0.9, 1.1, 1],
              rotate: [0, -12, 12, -6, 6, 0],
              borderColor: ['rgba(38, 38, 38, 1)', 'rgba(255, 90, 31, 1)', 'rgba(255, 90, 31, 1)', 'rgba(38, 38, 38, 1)'],
              backgroundColor: ['rgba(23, 23, 23, 1)', 'rgba(255, 90, 31, 0.15)', 'rgba(255, 90, 31, 0.1)', 'rgba(23, 23, 23, 1)'],
            } : {}}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            onClick={openCart}
            className="relative flex items-center justify-center p-2.5 text-white bg-neutral-900 border border-neutral-800 hover:border-[#FF5A1F]/40 rounded-xl hover:bg-neutral-800 transition-all cursor-pointer"
            id="cart-header-btn"
          >
            <ShoppingBag className="h-5 w-5 text-[#FF5A1F]" />
            {cartCount > 0 && (
              <motion.span
                animate={isPulsing ? {
                  scale: [1, 1.4, 0.9, 1.15, 1],
                } : {}}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-[#FF5A1F] to-[#FF8C42] text-[10px] font-black text-white shadow-lg shadow-[#FF5A1F]/20"
              >
                {cartCount}
              </motion.span>
            )}
          </motion.button>

          {/* User Profile Login / Account Dashboard */}
          {user ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveView('user')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  activeView === 'user' ? 'border-[#FF5A1F] bg-neutral-900' : 'border-neutral-800 bg-neutral-950 hover:bg-neutral-900'
                }`}
                id="user-profile-header-btn"
              >
                <div className="h-7 w-7 overflow-hidden rounded-full border border-neutral-700">
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                </div>
                <div className="hidden lg:flex flex-col items-start leading-none">
                  <span className="text-xs font-semibold text-white">{user.name}</span>
                  <span className="text-[9px] font-mono text-[#FFD166]">{user.loyaltyTier} VIP</span>
                </div>
              </button>

              {/* Quick Route to Enterprise Admin Dashboard */}
              <button
                onClick={() => setActiveView('admin')}
                className={`flex items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                  activeView === 'admin'
                    ? 'border-[#FFD166] text-[#FFD166] bg-neutral-900'
                    : 'border-neutral-800 text-neutral-400 hover:text-[#FFD166] hover:bg-neutral-900 hover:border-[#FFD166]/40'
                }`}
                title="Admin Dashboard Portal"
                id="admin-portal-header-btn"
              >
                <ShieldAlert className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={toggleLoginModal}
              className="flex items-center gap-2 rounded-xl bg-[#FF5A1F] hover:bg-[#FF8C42] px-4 py-2.5 text-xs font-semibold text-white tracking-wider cursor-pointer shadow-lg shadow-[#FF5A1F]/10 transition-all font-sans"
              id="login-header-btn"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden md:inline">Connect Account</span>
            </button>
          )}

          {/* Mobile Hamburguer Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center p-2.5 text-neutral-400 hover:text-white md:hidden hover:bg-neutral-900 rounded-xl cursor-pointer"
            id="mobile-hamburguer-btn"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-neutral-800 bg-[#0d0d0d] px-4 py-4 space-y-3"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveView(link.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium ${
                  activeView === link.id
                    ? 'text-white bg-neutral-900 border-l-4 border-[#FF5A1F]'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t border-neutral-900 flex justify-between gap-2">
              <button
                onClick={() => {
                  setActiveView('admin');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-neutral-800 py-2.5 text-xs font-semibold text-[#FFD166] hover:bg-neutral-900"
              >
                <ShieldAlert className="h-4 w-4" />
                Admin Panel
              </button>
              <button
                onClick={() => {
                  setActiveView('user');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-neutral-800 py-2.5 text-xs font-semibold text-white hover:bg-neutral-900"
              >
                <User className="h-4 w-4" />
                Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
