import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Heart, User, Sparkles, Compass, History, Calendar, LayoutDashboard } from 'lucide-react';
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
  activeAddress?: any;
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
  activeAddress
}: HeaderProps) {
  const navItems: { id: 'home' | 'menu' | 'user' | 'admin' | 'tracking' | 'reservations'; label: string; icon: typeof Compass }[] = [
    { id: 'home', label: 'Explore', icon: Compass },
    { id: 'menu', label: 'Menu', icon: Sparkles },
    { id: 'reservations', label: 'Reserve Table', icon: Calendar },
    { id: 'tracking', label: 'Live Tracking', icon: History },
    { id: 'admin', label: 'Admin Panel', icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-[50] w-full border-b border-neutral-900 bg-[#070707]/80 backdrop-blur-md select-none transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* Logo Brand and Delivery Loc Indicator */}
          <div className="flex items-center gap-4">
            <div 
              onClick={() => setActiveView('home')} 
              className="flex items-center gap-2.5 cursor-pointer group active:scale-95 transition"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF5A1F] to-[#FF8C42] shadow-lg shadow-[#FF5A1F]/20 group-hover:scale-105 transition-transform">
                <span className="font-mono text-xl font-black text-white italic">S</span>
              </div>
              <div>
                <span className="text-xl font-black text-white font-sans tracking-tight leading-none group-hover:text-[#FF5A1F] transition duration-200">
                  SPEX
                </span>
                <span className="text-[10px] font-mono block tracking-widest text-neutral-500 font-extrabold uppercase mt-0.5">
                  CULINARY SUITE
                </span>
              </div>
            </div>

            {activeAddress && (
              <div 
                onClick={() => setActiveView('home')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-850 hover:border-neutral-750 transition duration-200 text-xs cursor-pointer"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-[#FF5A1F]" />
                <span className="text-[9px] font-mono font-bold text-[#FF8C42] uppercase tracking-wider shrink-0">Deliver To:</span>
                <span className="text-[10px] font-sans font-extrabold text-neutral-300 truncate max-w-[110px]">
                  {activeAddress.locality || activeAddress.city}
                </span>
              </div>
            )}
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase font-sans transition duration-300 cursor-pointer flex items-center gap-2 relative ${
                    isActive 
                      ? 'text-white bg-neutral-900 border border-neutral-800' 
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-950 border border-transparent'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-[#FF5A1F]' : 'text-neutral-500'}`} />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeHeaderNavGlow"
                      className="absolute inset-0 rounded-xl border border-[#FF5A1F]/30 bg-[#FF5A1F]/[0.02]"
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Interactive Tools Panel */}
          <div className="flex items-center gap-3">
            {/* AI Assistant Button */}
            <button
              onClick={toggleAIModal}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 text-[#FF5A1F] hover:bg-[#FF5A1F]/15 transition cursor-pointer text-xs font-black font-sans tracking-wider uppercase active:scale-95 shadow-md shadow-[#FF5A1F]/5"
            >
              <Sparkles className="h-4 w-4 animate-pulse" />
              AI Assistant
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => setActiveView('user')}
              className={`relative h-10 w-10 rounded-xl flex items-center justify-center border transition cursor-pointer active:scale-95 ${
                activeView === 'user'
                  ? 'bg-[#151515] border-neutral-800 text-white'
                  : 'bg-neutral-950 border-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-800'
              }`}
            >
              <Heart className="h-4.5 w-4.5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4.5 min-w-[18px] rounded-full bg-rose-500 flex items-center justify-center text-[9px] font-mono font-black text-white px-1 shadow border border-[#070707]">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Icon button */}
            <button
              onClick={openCart}
              className="relative h-10 w-10 rounded-xl bg-neutral-950 border border-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-800 flex items-center justify-center transition cursor-pointer active:scale-95"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4.5 min-w-[18px] rounded-full bg-[#FF5A1F] flex items-center justify-center text-[9px] font-mono font-black text-white px-1 shadow-md border border-[#070707] animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Connect User Portfolio action */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveView('user')}
                  className={`h-10 w-10 rounded-xl border flex items-center justify-center overflow-hidden transition cursor-pointer active:scale-95 ${
                    activeView === 'user' ? 'border-[#FF5A1F]' : 'border-neutral-850'
                  }`}
                >
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                </button>
                {(user.role === 'Admin' || user.isAdmin) && (
                  <button
                    onClick={() => setActiveView('admin')}
                    className={`h-10 w-10 rounded-xl border flex items-center justify-center transition cursor-pointer active:scale-95 ${
                      activeView === 'admin'
                        ? 'bg-[#FF5A1F]/10 border-[#FF5A1F]/35 text-[#FF5A1F]'
                        : 'bg-neutral-950 border-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-800'
                    }`}
                    title="Control Suite"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={toggleLoginModal}
                className="h-10 px-4 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white transition cursor-pointer text-xs font-bold tracking-wider uppercase flex items-center gap-2 active:scale-95 shadow"
              >
                <User className="h-4 w-4" />
                Log In
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
