import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import DirectOrderModal from './components/DirectOrderModal';
import VegSection from './components/VegSection';
import TrackingSection from './components/TrackingSection';
import TestimonialsSection from './components/TestimonialsSection';
import SwipeDeck from './components/SwipeDeck';
import FoodDiscoverySlider, { DISCOVERY_ITEMS } from './components/FoodDiscoverySlider';
import OrderByBudget, { BUDGET_FOODS } from './components/OrderByBudget';

// Code Splitting & Lazy-Loaded Bundles for high performance scaling to 10k+ concurrent users
const UserDashboard = React.lazy(() => import('./components/UserDashboard'));
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard'));
const AIChatModal = React.lazy(() => import('./components/AIChatModal'));
const ReservationsSection = React.lazy(() => import('./components/ReservationsSection'));
import { FoodItem, CartItem, Order, Review, UserProfile, Address, Coupon, OrderStatus, AddOn, Reservation } from './types';
import { LogIn, ArrowRight, X, Heart, Star, Sparkles, Navigation, CookingPot, Flame, ShieldCheck } from 'lucide-react';

export default function App() {
  // Global Animated Toast Notification system
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'info' | 'error' | 'warning' }[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Intercept standard alert functions with beautiful non-blocking in-app notifications
  useEffect(() => {
    const handleInterceptAlert = (msg: string) => {
      let type: 'success' | 'info' | 'error' | 'warning' = 'info';
      const m = msg.toLowerCase();
      if (m.includes('fail') || m.includes('error') || m.includes('mandatory') || m.includes('required') || m.includes('not supported') || m.includes('invalid') || m.includes('first define')) {
        type = 'error';
      } else if (m.includes('success') || m.includes('placed') || m.includes('authorized') || m.includes('connected') || m.includes('registered') || m.includes('added')) {
        type = 'success';
      } else if (m.includes('warn') || m.includes('attention')) {
        type = 'warning';
      }
      showToast(msg, type);
    };
    
    window.alert = handleInterceptAlert;
  }, []);

  // Navigation
  const [activeView, setActiveView] = useState<'home' | 'menu' | 'user' | 'admin' | 'tracking' | 'reservations'>('home');

  // Server Sourced States
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);

  // Reservations State
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem('spex_reservations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync reservations to local storage
  useEffect(() => {
    localStorage.setItem('spex_reservations', JSON.stringify(reservations));
  }, [reservations]);

  const handleAddReservation = (newRes: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => {
    const fresh: Reservation = {
      id: `RES-${Math.floor(100000 + Math.random() * 900000)}`,
      ...newRes,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };
    setReservations(prev => [fresh, ...prev]);
  };

  const handleCancelReservation = (id: string) => {
    setReservations(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'Cancelled' as const } : r)
    );
  };

  // Local/Temporary State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedPromo, setSelectedPromo] = useState<Coupon | undefined>(undefined);

  // Modals Toggles
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDirectOrderOpen, setIsDirectOrderOpen] = useState(false);
  const [directOrderFood, setDirectOrderFood] = useState<FoodItem | null>(null);

  // Login Form States
  const [loginMethod, setLoginMethod] = useState<'email' | 'userid'>('email');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginUserId, setLoginUserId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginAsAdmin, setLoginAsAdmin] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Dietary Preference Filter State
  const [dietaryPreference, setDietaryPreference] = useState<'All' | 'Vegan' | 'Gluten-Free' | 'High-Protein'>('All');

  // Dietary Preference Filter Logic
  const filteredFoodsByDiet = React.useMemo(() => {
    if (dietaryPreference === 'Vegan') {
      return foods.filter((item) => {
        const titleAndDesc = (item.name + ' ' + item.description).toLowerCase();
        const hasVeganTag = (item.tags || []).some(t => {
          if (typeof t !== 'string') return false;
          const l = t.toLowerCase();
          return l === 'vegan' || l === 'vegan special' || l === 'vegan blend' || l === 'vegan pure' || l === 'pure veg';
        });

        const hasAnimalOrDairy = /(chicken|paneer|cheese|mutton|egg|butter|cream|milk|ghee|rabri|crab|fish|prawn|cod|lamb|beef|shrimp|bacon|keema|tikka|lassi|custard|fondant|souffle|mayo|cheesy)/i.test(titleAndDesc);

        if (hasVeganTag && !hasAnimalOrDairy) return true;
        
        const matchesPlantBased = /(tofu|coconut milk|aubergine|eggplant|chickpea|almond milk|oat milk|chia|maple|olive oil|avocado|lentil|guacamole|mint|basil|mango nectar|pomegranate|podi|herbs|lime|pineapple|orange)/i.test(titleAndDesc);
        
        return matchesPlantBased && !hasAnimalOrDairy;
      });
    }

    if (dietaryPreference === 'Gluten-Free') {
      return foods.filter((item) => {
        const titleAndDesc = (item.name + ' ' + item.description).toLowerCase();
        const hasGFTag = (item.tags || []).some(t => {
          if (typeof t !== 'string') return false;
          const l = t.toLowerCase();
          return l === 'gluten free' || l === 'gluten-free' || l === 'glutenfree';
        });

        if (hasGFTag) return true;

        const hasGlutenKeywords = /(pizza|burger|flatbread|bun|focaccia|noodle|noodles|ramen|pasta|spaghetti|macaroni|bread|naan|kulcha|roti|paratha|samosa|puff|roll|wrapper|dumpling|dumplings|baklava)/i.test(titleAndDesc);

        if (hasGlutenKeywords) return false;

        const naturallyGF = /(rice|dosa|idli|lassi|juice|shake|fruit|vegetable|salad|curry|thandai|smoothie|lentil|pappad|beans|corn taco|nachos|kebab|tikka)/i.test(titleAndDesc);

        return naturallyGF || item.category === 'Beverages' || item.category === 'Biryani' || item.category === 'South Indian';
      });
    }

    if (dietaryPreference === 'High-Protein') {
      return foods.filter((item) => {
        const titleAndDesc = (item.name + ' ' + item.description).toLowerCase();
        const hasProteinTag = (item.tags || []).some(t => {
          if (typeof t !== 'string') return false;
          const l = t.toLowerCase();
          return l === 'high protein' || l === 'protein' || l === 'protein rich';
        });

        if (hasProteinTag) return true;

        const highProteinIngredients = /(chicken|kebab|tikka|paneer|tofu|lamb|fish|prawn|egg|mutton|keema|almond|peanut|whey|lentil|soy|soya|bean|chickpea|cod|kabab)/i.test(titleAndDesc);

        return (highProteinIngredients || item.calories > 360) && item.category !== 'Desserts' && item.category !== 'Beverages';
      });
    }

    return foods;
  }, [foods, dietaryPreference]);

  // Fetch initial collections from server API
  useEffect(() => {
    async function loadData() {
      try {
        const [foodsRes, profileRes, ordersRes, reviewsRes] = await Promise.all([
          fetch('/api/foods'),
          fetch('/api/profile'),
          fetch('/api/orders'),
          fetch('/api/reviews'),
        ]);

        const fData = await foodsRes.json();
        const pData = await profileRes.json();
        const oData = await ordersRes.json();
        const rData = await reviewsRes.json();

        const mergedFoods = [...fData];
        DISCOVERY_ITEMS.forEach((discItem) => {
          if (!mergedFoods.some(f => f.id === discItem.id)) {
            mergedFoods.push(discItem);
          }
        });
        BUDGET_FOODS.forEach((bufItem) => {
          if (!mergedFoods.some(f => f.id === bufItem.id)) {
            mergedFoods.push(bufItem);
          }
        });
        setFoods(mergedFoods);
        setUser(pData.profile);
        setAddresses(pData.addresses);
        setOrders(oData);
        setReviews(rData);
      } catch (err) {
        console.error('Failed to communicate with Express APIs, pulling fallback local databases:', err);
      }
    }
    loadData();
  }, []);

  // Sync / Cart logic
  const addToCart = (foodId: string, add = true, selectedAddOns?: AddOn[]) => {
    setCart((prevCart) => {
      const idx = prevCart.findIndex((i) => i.foodId === foodId);
      if (idx !== -1) {
        const currentItem = prevCart[idx];
        const newQty = add ? currentItem.quantity + 1 : currentItem.quantity - 1;
        if (newQty <= 0) {
          return prevCart.filter((i) => i.foodId !== foodId);
        } else {
          const updated = [...prevCart];
          updated[idx] = { 
            ...currentItem, 
            quantity: newQty,
            selectedAddOns: selectedAddOns !== undefined ? selectedAddOns : currentItem.selectedAddOns 
          };
          return updated;
        }
      } else if (add) {
        return [...prevCart, { foodId, quantity: 1, selectedAddOns: selectedAddOns || [] }];
      }
      return prevCart;
    });
  };

  const updateAddons = (foodId: string, addons: AddOn[]) => {
    setCart((prev) =>
      prev.map((i) => {
        if (i.foodId === foodId) {
          return { ...i, selectedAddOns: addons };
        }
        return i;
      })
    );
  };

  const removeFromCart = (foodId: string) => {
    setCart((prev) => prev.filter((i) => i.foodId !== foodId));
  };

  const saveForLater = (foodId: string) => {
    setCart((prev) =>
      prev.map((i) => {
        if (i.foodId === foodId) {
          return { ...i, savedForLater: !i.savedForLater };
        }
        return i;
      })
    );
  };

  const updateNotes = (foodId: string, notes: string) => {
    setCart((prev) =>
      prev.map((i) => {
        if (i.foodId === foodId) {
          return { ...i, deliveryNotes: notes };
        }
        return i;
      })
    );
  };

  const toggleWishlist = (foodId: string) => {
    setWishlist((prev) =>
      prev.includes(foodId) ? prev.filter((id) => id !== foodId) : [...prev, foodId]
    );
  };

  // Profile Address API
  const handleAddAddress = async (newAddr: Omit<Address, 'id' | 'isDefault'>) => {
    try {
      const res = await fetch('/api/profile/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddr),
      });
      const data = await res.json();
      setAddresses(data.addresses);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveAddress = async (id: string) => {
    try {
      const res = await fetch(`/api/profile/address/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      setAddresses(data.addresses);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReorderPastOrder = (order: Order) => {
    setCart((prevCart) => {
      const nextCart = [...prevCart];
      order.items.forEach((item) => {
        const existingIdx = nextCart.findIndex((ci) => ci.foodId === item.foodId);
        if (existingIdx !== -1) {
          nextCart[existingIdx] = {
            ...nextCart[existingIdx],
            quantity: nextCart[existingIdx].quantity + item.quantity,
            selectedAddOns: item.selectedAddOns || nextCart[existingIdx].selectedAddOns || [],
          };
        } else {
          nextCart.push({
            foodId: item.foodId,
            quantity: item.quantity,
            selectedAddOns: item.selectedAddOns || [],
          });
        }
      });
      return nextCart;
    });
    setIsCartOpen(true);
  };

  // Coupon Proceed
  const handleProceedToDelivery = (promo?: Coupon) => {
    setSelectedPromo(promo);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Submit Order API
  const handleSubmitOrder = async (payMethod: string, address: Address, orderNotes: string) => {
    const activeItems = cart.filter((i) => !i.savedForLater);
    const subtotal = activeItems.reduce((acc, c) => {
      const f = foods.find((it) => it.id === c.foodId);
      if (!f) return acc;
      const addonTotal = c.selectedAddOns?.reduce((sum, a) => sum + a.price, 0) || 0;
      return acc + (f.price + addonTotal) * c.quantity;
    }, 0);

    const discount = selectedPromo
      ? selectedPromo.discountType === 'percentage'
        ? Math.min((subtotal * selectedPromo.discountValue) / 100, selectedPromo.maxDiscount || Infinity)
        : selectedPromo.discountValue
      : 0;

    const deliveryFee = subtotal > 600 ? 0 : 40;
    const tax = parseFloat((subtotal * 0.05).toFixed(2));
    const total = parseFloat((subtotal - discount + deliveryFee + tax).toFixed(2));

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: activeItems,
          subtotal,
          discount,
          deliveryFee,
          tax,
          total,
          couponApplied: selectedPromo?.code,
          paymentMethod: payMethod,
          deliveryAddress: address,
          deliveryNotes: orderNotes,
        }),
      });

      const data = await res.json();
      setOrders((prev) => [data.order, ...prev]);

      // Clear Cart
      setCart([]);
      setSelectedPromo(undefined);
      setIsCheckoutOpen(false);

      // Launch tracking view
      setActiveView('tracking');
      alert(`Success: Order placed! Identification code: ${data.order.id}. Diverting to tracking terminal...`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenDirectOrder = (food: FoodItem) => {
    setDirectOrderFood(food);
    setIsDirectOrderOpen(true);
  };

  const handleSubmitDirectOrder = async (
    food: FoodItem,
    qty: number,
    selectedAddOns: AddOn[],
    address: Address,
    paymentMethod: string,
    notes: string,
    guestContact: { name: string; phone: string; email: string }
  ) => {
    // calculate values
    const subtotal = (food.price + selectedAddOns.reduce((sum, a) => sum + a.price, 0)) * qty;
    const deliveryFee = subtotal > 600 ? 0 : 40;
    const tax = parseFloat((subtotal * 0.05).toFixed(2));
    const total = parseFloat((subtotal + deliveryFee + tax).toFixed(2));

    const directItem = {
      foodId: food.id,
      quantity: qty,
      selectedAddOns: selectedAddOns,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [directItem],
          subtotal,
          discount: 0,
          deliveryFee,
          tax,
          total,
          paymentMethod,
          deliveryAddress: address,
          deliveryNotes: notes,
        }),
      });

      const data = await res.json();
      setOrders((prev) => [data.order, ...prev]);

      setIsDirectOrderOpen(false);
      setDirectOrderFood(null);

      // Launch tracking view
      setActiveView('tracking');
      alert(`⚡ Direct Order Placed! Identification Code: ${data.order.id}. Diverting to tracking terminal...`);
    } catch (err) {
      console.error('Failed to submit direct order:', err);
    }
  };

  // Administrative / Simulator update status
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: data.order.status } : o))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Administrative: Food modifiers
  const handleAddFoodItem = async (food: Omit<FoodItem, 'id' | 'rating' | 'reviewCount'>) => {
    try {
      const res = await fetch('/api/admin/foods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(food),
      });
      const data = await res.json();
      setFoods((prev) => [...prev, data.item]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateFoodItem = async (id: string, updates: Partial<FoodItem>) => {
    try {
      const res = await fetch(`/api/admin/foods/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      setFoods((prev) => prev.map((f) => (f.id === id ? data.item : f)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFoodItem = async (id: string) => {
    try {
      await fetch(`/api/admin/foods/${id}`, { method: 'DELETE' });
      setFoods((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Connecting account mock
  const handleGoogleGmailLogin = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      setIsGoogleLoading(false);
      setUser({
        name: 'GMAIL ADMIN',
        email: 'admin.dashboard@gmail.com',
        phone: '+91 99999 88888',
        joinedDate: new Date().toISOString().split('T')[0],
        loyaltyPoints: 9500,
        loyaltyTier: 'Platinum',
        avatar: 'https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?w=150&auto=format&fit=crop&q=80',
        isAdmin: true,
        role: 'Admin',
      });
      setIsLoginModalOpen(false);
      alert("Successfully Authorized via Google Gmail API! Admin Control Granted.");
    }, 1200);
  };

  const handleMockLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMethod === 'email') {
      if (loginEmail.trim() === '') return;
      const isGmail = loginEmail.toLowerCase().endsWith('@gmail.com') || loginEmail.toLowerCase().includes('gmail');
      const becomeAdmin = loginAsAdmin || isGmail || loginEmail.toLowerCase().includes('admin');
      
      setUser({
        name: loginEmail.split('@')[0].toUpperCase(),
        email: loginEmail,
        phone: '+91 97799 90022',
        joinedDate: new Date().toISOString().split('T')[0],
        loyaltyPoints: becomeAdmin ? 9999 : 120,
        loyaltyTier: becomeAdmin ? 'Platinum' : 'Silver',
        avatar: becomeAdmin 
          ? 'https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1624561172888-ac93c696e10c?w=150&auto=format&fit=crop&q=80',
        isAdmin: becomeAdmin,
        role: becomeAdmin ? 'Admin' : 'User',
      });
      setIsLoginModalOpen(false);
      if (becomeAdmin) {
        alert(`Connected with Gmail: Welcoming Admin ${loginEmail.split('@')[0]} with VIP control permissions!`);
      } else {
        alert(`Connected: Welcoming ${loginEmail.split('@')[0]} to the Spex private lounge!`);
      }
    } else {
      if (loginUserId.trim() === '') return;
      const becomeAdmin = loginUserId.toLowerCase().includes('admin') || loginAsAdmin;
      setUser({
        name: loginUserId.trim().toUpperCase(),
        email: `${loginUserId.trim().toLowerCase()}@spexsystems.com`,
        phone: '+91 98888 77711',
        joinedDate: new Date().toISOString().split('T')[0],
        loyaltyPoints: becomeAdmin ? 9999 : 200,
        loyaltyTier: 'Platinum',
        avatar: 'https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?w=150&auto=format&fit=crop&q=80',
        isAdmin: becomeAdmin,
        role: becomeAdmin ? 'Admin' : 'User',
      });
      setIsLoginModalOpen(false);
      alert(`Connected: Welcoming VIP Member ${loginUserId} to the Spex private lounge!`);
    }
  };

  // Shopping bags variables for summaries
  const activeCartItems = cart.filter((i) => !i.savedForLater);
  const cartSubtotal = activeCartItems.reduce((acc, c) => {
    const f = foods.find((it) => it.id === c.foodId);
    if (!f) return acc;
    const addonTotal = c.selectedAddOns?.reduce((sum, a) => sum + a.price, 0) || 0;
    return acc + (f.price + addonTotal) * c.quantity;
  }, 0);

  const cartDiscount = selectedPromo
    ? selectedPromo.discountType === 'percentage'
      ? Math.min((cartSubtotal * selectedPromo.discountValue) / 100, selectedPromo.maxDiscount || Infinity)
      : selectedPromo.discountValue
    : 0;

  const cartDeliveryFee = cartSubtotal > 600 ? 0 : 40;
  const cartTax = parseFloat((cartSubtotal * 0.05).toFixed(2));
  const cartTotal = parseFloat((cartSubtotal - cartDiscount + cartDeliveryFee + cartTax).toFixed(2));

  return (
    <div className="min-h-screen bg-[#0d0d0d] font-sans scroll-smooth text-white antialiased">
      {/* Global Promotional Announcement Ticker */}
      <div className="bg-gradient-to-r from-neutral-950 via-[#FF5A1F] to-neutral-950 text-white text-center py-2.5 px-4 border-b border-[#FF5A1F]/20 flex items-center justify-center gap-2 overflow-hidden text-xs font-semibold select-none">
        <span className="inline-flex h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
        <span className="font-sans tracking-wide">
          🎁🔥 Get up to <span className="text-[#FFD166] font-black text-sm">90% OFF</span> on your first delicious meal! Use code <span className="font-mono bg-black/40 px-2 py-0.5 rounded text-[#FFD166] font-extrabold border border-[#FFD166]/25">FIRST90</span> at checkout! 🔥🎁
        </span>
      </div>

      {/* Navigation Header bar and tools */}
      <Header
        cartCount={activeCartItems.reduce((acc, c) => acc + c.quantity, 0)}
        wishlistCount={wishlist.length}
        activeView={activeView}
        setActiveView={setActiveView}
        openCart={() => setIsCartOpen(true)}
        user={user}
        toggleLoginModal={() => setIsLoginModalOpen(true)}
        toggleAIModal={() => setIsAIModalOpen(true)}
      />

      {/* Main Multi route render view */}
      <main className="min-h-[80vh]">
        <ErrorBoundary>
          <React.Suspense fallback={
            <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-4 text-white bg-[#0d0d0d]">
              <div className="h-10 w-10 border-4 border-[#FF5A1F] border-t-transparent rounded-full animate-spin shadow-lg" />
              <p className="font-mono text-xs tracking-widest text-neutral-400 uppercase animate-pulse">Summoning Spex Suite...</p>
            </div>
          }>
            <AnimatePresence mode="wait">
          {activeView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Hero
                onExploreMenu={() => setActiveView('menu')}
                onAskAI={() => setIsAIModalOpen(true)}
                addToCart={addToCart}
              />

              {/* Food Discovery Slider Slider carousel */}
              <FoodDiscoverySlider
                addToCart={addToCart}
                toggleWishlist={toggleWishlist}
                wishlist={wishlist}
                onOpenDirectOrder={handleOpenDirectOrder}
              />

              {/* Premium Budget Section */}
              <OrderByBudget
                addToCart={addToCart}
                toggleWishlist={toggleWishlist}
                wishlist={wishlist}
                onOpenDirectOrder={handleOpenDirectOrder}
              />

              {/* Home interactive Trending spotlight carousel */}
              <div className="bg-[#0f0f0f] py-16 border-t border-neutral-905">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-2">
                    <div>
                      <span className="text-xs font-bold text-[#FF5A1F] uppercase font-mono tracking-wider">Spotlight Collections</span>
                      <h2 className="text-2xl font-black text-white mt-1">Sizzling & Highly Rated</h2>
                    </div>
                    <button
                      onClick={() => setActiveView('menu')}
                      className="text-xs font-bold text-[#FFD166] hover:text-[#FF8C42] flex items-center gap-1 cursor-pointer"
                    >
                      See full 100-dish catalog <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {foods.filter(f => f.isTrending || f.isChefSpecial).slice(0, 4).map((food) => (
                      <div
                        key={food.id}
                        className="rounded-2xl border border-neutral-800 bg-[#171717] overflow-hidden p-3 flex flex-col justify-between"
                      >
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-900">
                          <img src={food.image} alt={food.name} className="h-full w-full object-cover" />
                          <span className="absolute top-2 left-2 rounded bg-gradient-to-tr from-[#FF5A1F] to-[#FF8C42] text-[8px] font-black text-white uppercase px-2 py-0.5">
                            Spotlight
                          </span>
                        </div>
                        <div className="mt-3 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-xs font-bold text-white line-clamp-1">{food.name}</h3>
                            <p className="text-[10px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">{food.description}</p>
                          </div>
                          <div className="mt-4 flex items-center justify-between pt-2.5 border-t border-neutral-850">
                            <span className="text-sm font-black text-white">₹{food.price}</span>
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => handleOpenDirectOrder(food)}
                                className="rounded-lg bg-gradient-to-r from-[#FF5A1F] to-[#FF8C42] hover:brightness-110 text-[10px] font-bold px-2.5 py-1.5 cursor-pointer flex items-center gap-1"
                              >
                                ⚡ Order Now
                              </button>
                              <button
                                onClick={() => addToCart(food.id, true)}
                                className="rounded-lg bg-neutral-900 border border-neutral-800 hover:text-[#FF5A1F] text-[10px] font-bold px-2.5 py-1.5 cursor-pointer"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

               {/* Special Tinder-Style Culinary Swipe Deck */}
              <SwipeDeck
                foods={foods}
                addToCart={addToCart}
                toggleWishlist={toggleWishlist}
                wishlist={wishlist}
              />

              {/* Noticeable Veg Meal Varieties Section */}
              <VegSection
                foods={foods}
                cart={cart}
                addToCart={addToCart}
                updateNotes={updateNotes}
                updateAddons={updateAddons}
                onOpenDirectOrder={handleOpenDirectOrder}
              />

              {/* Special festival offer callout */}
              <div className="bg-[#0d0d0d] py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="relative overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-800 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="absolute -right-10 -bottom-10 h-64 w-64 bg-[#FF5A1F]/10 rounded-full blur-[80px]" />
                    <div className="space-y-3 relative z-10 text-center md:text-left">
                      <span className="inline-block rounded-full bg-[#FFD166]/15 hover:bg-[#FFD166]/25 border border-[#FFD166]/30 text-xs font-bold text-[#FFD166] px-4 py-1.5">
                        Festval Season Deal
                      </span>
                      <h3 className="text-3xl font-black text-white tracking-tight">Unlock Flat 20% OFF</h3>
                      <p className="text-sm text-neutral-400 max-w-lg">
                        Connect account today, apply code <strong className="text-white font-mono">SPEXFIRST</strong> on checkout drawer, and receive premium thermal delivery at zero dispatch fee!
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveView('menu')}
                      className="relative z-10 whitespace-nowrap rounded-2xl bg-gradient-to-r from-[#FF5A1F] to-[#FF8C42] px-8 py-4.5 font-bold hover:brightness-110 shadow-lg shadow-[#FF5A1F]/10 cursor-pointer text-sm"
                    >
                      Summon Your First Banquet
                    </button>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {activeView === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10"
            >
              {/* Premium Dietary Selector Panel */}
              <div className="bg-gradient-to-b from-[#171717] to-[#121212] rounded-3xl border border-neutral-850 p-6 md:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 h-40 w-40 bg-[#FF5A1F]/5 rounded-full blur-[40px] pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-emerald-500/5 rounded-full blur-[30px] pointer-events-none" />
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-[#FF5A1F] animate-pulse" />
                      <span className="text-[10px] font-black tracking-[0.2em] text-[#FF5A1F] uppercase font-mono">
                        Culinary Pathway Facilitator
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                      Express Dietary Matcher
                    </h3>
                    <p className="text-xs text-neutral-400 max-w-xl">
                      Select an immersive dietary lens below to instantly isolate pure plant-based, gluten-free safe, or protein-rich recipes curated across our imperial menu.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 bg-neutral-950 py-1.5 px-3 rounded-xl border border-neutral-900 shadow-inner">
                    <Sparkles className="h-3.5 w-3.5 text-[#FFD166]" />
                    <span className="text-[10px] font-bold text-[#FFD166] font-mono uppercase tracking-wide">
                      {filteredFoodsByDiet.length} masterpieces active
                    </span>
                  </div>
                </div>

                {/* Dietary preference switcher controls */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                  <button
                    onClick={() => setDietaryPreference('All')}
                    className={`relative rounded-2xl p-4 text-center border transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                      dietaryPreference === 'All'
                        ? 'border-white/20 bg-white/[0.03] text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]'
                        : 'border-neutral-900 bg-neutral-950/60 text-neutral-400 hover:text-white hover:border-neutral-800'
                    }`}
                  >
                    <span className="text-xl">🌐</span>
                    <div className="space-y-0.5">
                      <p className="text-xs font-black font-sans uppercase tracking-wide">All Heritage</p>
                      <p className="text-[9px] text-neutral-500 font-medium">Standard full spread</p>
                    </div>
                    {dietaryPreference === 'All' && (
                      <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </button>

                  <button
                    onClick={() => setDietaryPreference('Vegan')}
                    className={`relative rounded-2xl p-4 text-center border transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                      dietaryPreference === 'Vegan'
                        ? 'border-emerald-500/30 bg-emerald-500/[0.04] text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.08)]'
                        : 'border-neutral-900 bg-neutral-950/60 text-neutral-400 hover:text-emerald-300 hover:border-neutral-800'
                    }`}
                  >
                    <span className="text-xl">🌿</span>
                    <div className="space-y-0.5">
                      <p className="text-xs font-black font-sans uppercase tracking-wide font-sans">Pure Vegan</p>
                      <p className="text-[9px] text-neutral-500 font-medium font-sans">100% plant & herb based</p>
                    </div>
                    {dietaryPreference === 'Vegan' && (
                      <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </button>

                  <button
                    onClick={() => setDietaryPreference('Gluten-Free')}
                    className={`relative rounded-2xl p-4 text-center border transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                      dietaryPreference === 'Gluten-Free'
                        ? 'border-amber-500/30 bg-amber-500/[0.04] text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.08)]'
                        : 'border-neutral-900 bg-neutral-950/60 text-neutral-400 hover:text-amber-300 hover:border-neutral-800'
                    }`}
                  >
                    <span className="text-xl">🌾</span>
                    <div className="space-y-0.5">
                      <p className="text-xs font-black font-sans uppercase tracking-wide font-sans">Gluten-Free</p>
                      <p className="text-[9px] text-neutral-500 font-medium font-sans">Coeliac safe ingredients</p>
                    </div>
                    {dietaryPreference === 'Gluten-Free' && (
                      <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    )}
                  </button>

                  <button
                    onClick={() => setDietaryPreference('High-Protein')}
                    className={`relative rounded-2xl p-4 text-center border transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                      dietaryPreference === 'High-Protein'
                        ? 'border-rose-500/30 bg-rose-500/[0.04] text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.08)]'
                        : 'border-neutral-900 bg-neutral-950/60 text-neutral-400 hover:text-rose-300 hover:border-neutral-800'
                    }`}
                  >
                    <span className="text-xl">💪</span>
                    <div className="space-y-0.5">
                      <p className="text-xs font-black font-sans uppercase tracking-wide font-sans">High-Protein</p>
                      <p className="text-[9px] text-neutral-500 font-medium font-sans">Power seeds & dark proteins</p>
                    </div>
                    {dietaryPreference === 'High-Protein' && (
                      <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                    )}
                  </button>
                </div>
              </div>

              <MenuSection
                foods={filteredFoodsByDiet}
                cart={cart}
                wishlist={wishlist}
                addToCart={addToCart}
                toggleWishlist={toggleWishlist}
                onOpenDirectOrder={handleOpenDirectOrder}
              />
            </motion.div>
          )}

          {activeView === 'tracking' && (
            <motion.div
              key="tracking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TrackingSection
                orders={orders}
                onProgressOrderState={handleUpdateOrderStatus}
              />
            </motion.div>
          )}

          {activeView === 'reservations' && (
            <motion.div
              key="reservations"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ReservationsSection
                user={user}
                reservations={reservations}
                onAddReservation={handleAddReservation}
                onCancelReservation={handleCancelReservation}
                toggleLoginModal={() => setIsLoginModalOpen(true)}
              />
            </motion.div>
          )}

          {activeView === 'user' && (
            <motion.div
              key="user"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {user ? (
                <UserDashboard
                  user={user}
                  orders={orders}
                  addresses={addresses}
                  wishlist={wishlist}
                  foods={foods}
                  addToCart={addToCart}
                  toggleWishlist={toggleWishlist}
                  onAddAddress={handleAddAddress}
                  onRemoveAddress={handleRemoveAddress}
                  onReorder={handleReorderPastOrder}
                />
              ) : (
                <div className="py-24 text-center space-y-4">
                  <h2 className="text-xl font-bold">Please Connect Account to see Portfolio</h2>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="rounded-xl bg-[#FF5A1F] px-6 py-3 font-semibold text-white tracking-wide cursor-pointer"
                  >
                    Authenticate Now
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeView === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AdminDashboard
                orders={orders}
                foods={foods}
                reviews={reviews}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onAddFoodItem={handleAddFoodItem}
                onDeleteFoodItem={handleDeleteFoodItem}
                onUpdateFoodItem={handleUpdateFoodItem}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Beautiful Testimonials & Customer Reviews Section at the very end of the page */}
        <TestimonialsSection />
        </React.Suspense>
        </ErrorBoundary>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-neutral-900 bg-[#0d0d0d] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black border border-neutral-800 shadow-md">
              <svg 
                viewBox="0 0 100 100" 
                className="h-full w-full"
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Majestic Orange to Red Warm Luxury Gradient for Line Geometry */}
                  <linearGradient id="footerLogoOrangeRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF8C42" />
                    <stop offset="60%" stopColor="#FF5A1F" />
                    <stop offset="100%" stopColor="#E63946" />
                  </linearGradient>
                  
                  {/* Subtle Background Glow helper */}
                  <radialGradient id="footerInnerSultryGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FF5A1F" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Black Background Circle */}
                <circle cx="50" cy="50" r="50" fill="black" />
                <circle cx="50" cy="50" r="45" fill="url(#footerInnerSultryGlow)" />
                
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
                  stroke="url(#footerLogoOrangeRedGrad)" 
                  strokeWidth="1.5" 
                  strokeLinejoin="round" 
                  fill="none" 
                />
                <polygon 
                  points="50,24 90,72 50,57 10,72" 
                  stroke="url(#footerLogoOrangeRedGrad)" 
                  strokeWidth="1.5" 
                  strokeLinejoin="round" 
                  fill="none" 
                />
                <line 
                  x1="50" 
                  y1="24" 
                  x2="50" 
                  y2="57" 
                  stroke="url(#footerLogoOrangeRedGrad)" 
                  strokeWidth="1.5" 
                />
              </svg>
            </div>
            <div>
              <span className="font-mono text-xl font-extrabold bg-gradient-to-r from-white via-neutral-100 to-[#FF5A1F] bg-clip-text text-transparent tracking-widest uppercase">SPEX<span className="text-[#FF5A1F] font-sans">.</span></span>
              <p className="text-[10px] text-neutral-500 font-mono mt-0.5">Fresh Food. Fast Delivery. Exceptional Taste.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6 pt-6 border-t border-neutral-900">
            <p className="text-[11px] text-neutral-600 font-mono text-center md:text-left">
              © 2026 Spex FoodTech Inc. All rights reserved. Sourced & Cooked with Sourdough Love.
            </p>
            <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
              <div className="flex items-center gap-1.5 bg-[#090909] py-1.5 px-3 rounded-full border border-neutral-900 shadow-inner select-none text-[11px] font-semibold text-neutral-400 font-sans tracking-wide">
                <span>💖</span>
                <span>Made with love in</span>
                <span className="bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] bg-clip-text text-transparent font-black tracking-widest text-[12px]">BHARAT</span>
                <span>🇮🇳</span>
              </div>
              
              {/* Sachin Pal developer credit badge */}
              <div className="flex items-center gap-1.5 bg-[#0a0a0a] border border-neutral-900 px-3 py-1 rounded-lg select-none">
                <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500">
                  SYSTEM:
                </span>
                <span className="font-mono text-xs font-bold bg-gradient-to-r from-white to-[#FF5A1F] bg-clip-text text-transparent tracking-widest uppercase">
                  by Sachin Pal
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Drawer sheet */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        foods={foods}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        saveForLater={saveForLater}
        updateNotes={updateNotes}
        updateAddons={updateAddons}
        onCheckout={handleProceedToDelivery}
      />

      {/* Checkout Modal Overlay */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        subtotal={cartSubtotal}
        discount={cartDiscount}
        deliveryFee={cartDeliveryFee}
        tax={cartTax}
        total={cartTotal}
        appliedPromo={selectedPromo}
        addresses={addresses}
        onAddAddress={handleAddAddress}
        onSubmitOrder={handleSubmitOrder}
      />

      {/* Direct Quick Checkout and customization Overlay */}
      <DirectOrderModal
        isOpen={isDirectOrderOpen}
        onClose={() => {
          setIsDirectOrderOpen(false);
          setDirectOrderFood(null);
        }}
        food={directOrderFood}
        addresses={addresses}
        onAddAddress={handleAddAddress}
        onSubmitDirectOrder={handleSubmitDirectOrder}
        user={user}
      />

      {/* AI Sommelier Search Matching Conversational Drawer */}
      <React.Suspense fallback={null}>
        <AIChatModal
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
          foods={foods}
          addToCart={addToCart}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
        />
      </React.Suspense>

      {/* Connect Account Login Overlay Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              onClick={() => setIsLoginModalOpen(false)}
              className="fixed inset-0 bg-[#0d0d0d]/90 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-neutral-800 bg-[#171717] p-6 shadow-2xl z-50 text-white space-y-6"
            >
              <div className="flex justify-between items-center text-left">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-[#FF5A1F] rounded-lg flex items-center justify-center text-white font-black text-sm">S</div>
                  <h2 className="text-md font-bold text-white font-sans">Connect Spex Membership</h2>
                </div>
                <button
                  onClick={() => setIsLoginModalOpen(false)}
                  className="rounded p-1 text-neutral-500 hover:text-white"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Tabs for Login Methods Selection */}
              <div className="grid grid-cols-2 gap-2 bg-[#090909] p-1 rounded-xl border border-neutral-850">
                <button
                  type="button"
                  onClick={() => setLoginMethod('email')}
                  className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    loginMethod === 'email'
                      ? 'bg-[#FF5A1F] text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  ✉️ Email ID Login
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('userid')}
                  className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    loginMethod === 'userid'
                      ? 'bg-[#FF5A1F] text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  👤 User ID Login
                </button>
              </div>

              <form onSubmit={handleMockLogin} className="space-y-4 text-xs font-sans">
                {loginMethod === 'email' ? (
                  <div className="space-y-1.5 text-left">
                    <label className="text-neutral-400 font-semibold uppercase font-mono text-[10px]">Your Authorized Email ID</label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. customer@example.com"
                      className="w-full rounded-xl border border-neutral-800 bg-[#0d0d0d] px-3.5 py-3 text-white focus:outline-none focus:border-[#FF5A1F]"
                    />
                  </div>
                ) : (
                  <div className="space-y-1.5 text-left">
                    <label className="text-neutral-400 font-semibold uppercase font-mono text-[10px]">Customer User ID</label>
                    <input
                      type="text"
                      required
                      value={loginUserId}
                      onChange={(e) => setLoginUserId(e.target.value)}
                      placeholder="e.g. VIP-CUST-888"
                      className="w-full rounded-xl border border-neutral-800 bg-[#0d0d0d] px-3.5 py-3 text-white focus:outline-none focus:border-[#FF5A1F]"
                    />
                  </div>
                )}

                <div className="space-y-1.5 text-left">
                  <label className="text-neutral-400 font-semibold uppercase font-mono text-[10px]">Password / Secure Code</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-neutral-800 bg-[#0d0d0d] px-3.5 py-3 text-white focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>

                {/* Secure toggle option for Admin check */}
                <div className="flex items-center gap-2.5 bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-850 text-left">
                  <input
                    type="checkbox"
                    id="loginAdminToggle"
                    checked={loginAsAdmin}
                    onChange={(e) => setLoginAsAdmin(e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-800 bg-neutral-950 text-[#FF5A1F] focus:ring-[#FF5A1F]"
                  />
                  <label htmlFor="loginAdminToggle" className="text-[10px] text-neutral-300 font-semibold cursor-pointer select-none">
                    Log in with authorized Admin rights 🛠️ <span className="text-neutral-500 font-normal">(Gmail or ID)</span>
                  </label>
                </div>

                <div className="text-[10px] text-yellow-400/80 leading-snug bg-yellow-500/5 rounded-lg p-2.5 border border-yellow-500/15 text-left space-y-1">
                  <div>
                    🌟 Use code <span className="font-extrabold text-white bg-yellow-500/20 px-1 rounded">FIRST90</span> to get up to 90% discount on your first checkout!
                  </div>
                  <div className="text-neutral-400 text-[9px] font-mono">
                    💡 Tip: Log in with any <strong className="text-neutral-300">@gmail.com</strong> address to run with Admin session.
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-[#FF5A1F] to-[#FF8C42] py-3.5 font-bold text-white shadow-lg cursor-pointer hover:brightness-110 tracking-wide uppercase text-xs"
                >
                  Authorize Connect
                </button>

                {/* Google Gmail Quick Authenticator segment */}
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-neutral-850"></div>
                  <span className="flex-shrink mx-4 text-neutral-500 text-[10px] font-mono tracking-wider uppercase">Or connected via</span>
                  <div className="flex-grow border-t border-neutral-850"></div>
                </div>

                <button
                  type="button"
                  disabled={isGoogleLoading}
                  onClick={handleGoogleGmailLogin}
                  className="w-full relative flex items-center justify-center gap-3 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 py-3.5 text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isGoogleLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
                      <span className="font-mono text-neutral-600 text-[10px]">Contacting Google OAuth API...</span>
                    </div>
                  ) : (
                    <>
                      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/00/003">
                        <path
                          className="gmail-red"
                          fill="#EA4335"
                          d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 6l8 5 8-5v2l-8 5-8-5V6zm0 12V8.5l8 5 8-5V18H4z"
                        />
                      </svg>
                      <span>Authorize with Gmail (Google) as Admin</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Gorgeous Toast Notification System Overlay */}
      <div className="fixed bottom-6 right-6 z-[1000] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              className="pointer-events-auto shadow-2xl rounded-2xl p-4 border border-neutral-800 bg-[#141414]/95 backdrop-blur-md flex items-start gap-3.5 relative overflow-hidden"
            >
              <div className={`absolute top-0 bottom-0 left-0 w-1 ${
                t.type === 'success' ? 'bg-emerald-500' :
                t.type === 'error' ? 'bg-rose-500' :
                t.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
              }`} />
              
              <div className="flex-1 space-y-0.5 text-left pl-1">
                <span className="text-[10px] font-black uppercase font-mono tracking-widest text-neutral-400">
                  {t.type === 'success' ? '✓ ACTION VERIFIED' :
                   t.type === 'error' ? '✕ TRANSACTION ERROR' :
                   t.type === 'warning' ? '⚠ ATTENTION REQUIRED' : 'ℹ SYSTEM DIRECTIVE'}
                </span>
                <p className="text-[11px] text-neutral-200 mt-1 font-sans leading-relaxed">
                  {t.message}
                </p>
              </div>

              <button
                onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))}
                className="text-neutral-500 hover:text-white shrink-0 p-0.5 cursor-pointer transition"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
