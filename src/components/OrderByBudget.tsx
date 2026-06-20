import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Heart, Flame, Sparkles, ShoppingBag, Zap } from 'lucide-react';
import { FoodItem } from '../types';

export const BUDGET_FOODS: FoodItem[] = [
  // --- UNDER ₹49 ---
  {
    id: "budget-panipuri-1",
    name: "Pani Puri",
    description: "Crisp puffed puris filled with spiced potato mash, sweet tamarind chutney, and chilled mint-infused water.",
    category: "Snacks",
    price: 45,
    rating: 4.8,
    reviewCount: 450,
    tags: ["Street Food", "Crunchy", "Tangy"],
    prepTime: 10,
    calories: 120,
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isTrending: true,
    isChefSpecial: false,
    isMostLoved: true,
    isAvailable: true
  },
  {
    id: "budget-golgappa-1",
    name: "Golgappa",
    description: "Authentic puffed hollow bread served with seasoned boiled yellow peas and fiery double-spiced herbal water.",
    category: "Snacks",
    price: 40,
    rating: 4.7,
    reviewCount: 320,
    tags: ["Street Food", "Spicy"],
    prepTime: 10,
    calories: 115,
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isTrending: true,
    isChefSpecial: false,
    isAvailable: true
  },
  {
    id: "budget-samosa-1",
    name: "Samosa",
    description: "Flaky pastry pockets packed with a rich mixture of crushed potatoes, green peas, ginger, and roasted spices.",
    category: "Snacks",
    price: 35,
    rating: 4.9,
    reviewCount: 890,
    tags: ["Savory", "Classic"],
    prepTime: 12,
    calories: 250,
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isTrending: false,
    isChefSpecial: false,
    isAvailable: true
  },
  {
    id: "budget-breadpakora-1",
    name: "Bread Pakora",
    description: "Thick hand-sliced bread stuffed with seasoned potato and paneer, dipped in carom-scented gram batter and golden fried.",
    category: "Snacks",
    price: 45,
    rating: 4.6,
    reviewCount: 210,
    tags: ["Fritter", "Spiced"],
    prepTime: 12,
    calories: 310,
    image: "https://images.unsplash.com/photo-1601356616077-695728ae17cb?w=600&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isTrending: false,
    isChefSpecial: false,
    isAvailable: true
  },
  {
    id: "budget-tea-1",
    name: "Tea",
    description: "Strongly brewed milk tea infused with freshly crushed green cardamom, grated ginger root, and refined sugar.",
    category: "Beverages",
    price: 25,
    rating: 4.9,
    reviewCount: 1240,
    tags: ["Hot Brew", "Aromatic"],
    prepTime: 8,
    calories: 85,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isTrending: true,
    isChefSpecial: false,
    isAvailable: true
  },
  {
    id: "budget-smallfries-1",
    name: "Small Fries",
    description: "Golden-brown potato fries tossed in a spicy, tangy dry Peri-Peri seasoning served hot with house mayonnaise.",
    category: "Snacks",
    price: 49,
    rating: 4.5,
    reviewCount: 180,
    tags: ["Sides", "Spicy"],
    prepTime: 10,
    calories: 195,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isTrending: false,
    isChefSpecial: false,
    isAvailable: true
  },

  // --- UNDER ₹99 ---
  {
    id: "budget-chowmein-1",
    name: "Chowmein",
    description: "Stir-fried yellow noodles tossed with crisp cabbage juliennes, capsicum, wild onion greens, and rich dark soy sauce.",
    category: "Chinese",
    price: 95,
    rating: 4.7,
    reviewCount: 630,
    tags: ["Stir-Fry", "Spiced"],
    prepTime: 15,
    calories: 340,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isTrending: true,
    isChefSpecial: false,
    isAvailable: true
  },
  {
    id: "budget-springroll-1",
    name: "Spring Roll",
    description: "Hand-rolled flaky wrappers loaded with wok-charred oriental vegetables, deep fried till amber and crisp.",
    category: "Chinese",
    price: 89,
    rating: 4.6,
    reviewCount: 410,
    tags: ["Finger Food", "Crunchy"],
    prepTime: 15,
    calories: 280,
    image: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=600&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isTrending: true,
    isChefSpecial: false,
    isAvailable: true
  },
  {
    id: "budget-momos-1",
    name: "Momos",
    description: "Pillowy thin-wrapped dumplings loaded with finely minced farm vegetables and wild garlic, served with premium Sichuan dip.",
    category: "Chinese",
    price: 99,
    rating: 4.8,
    reviewCount: 1050,
    tags: ["Dumplings", "Steamed"],
    prepTime: 15,
    calories: 230,
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isTrending: true,
    isChefSpecial: false,
    isAvailable: true
  },
  {
    id: "budget-vadapav-1",
    name: "Vada Pav",
    description: "Spiced potato dumpling fried in gram batter, nestled inside a fluffy buttered roll smeared with dry garlic-coconut chutney.",
    category: "Snacks",
    price: 75,
    rating: 4.9,
    reviewCount: 1120,
    tags: ["Street Food", "Spicy"],
    prepTime: 10,
    calories: 290,
    image: "https://images.unsplash.com/photo-1542571361-a50172294c94?w=600&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isTrending: true,
    isChefSpecial: false,
    isAvailable: true
  },
  {
    id: "budget-dabeli-1",
    name: "Dabeli",
    description: "Buttered pav filled with sweet and spicy mashed potato, doused in garlic chutney, topped with fresh pomegranates and salty sev.",
    category: "Snacks",
    price: 69,
    rating: 4.7,
    reviewCount: 340,
    tags: ["Tangy", "Crunchy"],
    prepTime: 12,
    calories: 275,
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isTrending: false,
    isChefSpecial: false,
    isAvailable: true
  },
  {
    id: "budget-chillipotato-1",
    name: "Chilli Potato",
    description: "Crisp potato fingers glazed with honey, dark soy sauce, crushed chili paste, garlic, and sprinkled sesame seeds.",
    category: "Chinese",
    price: 95,
    rating: 4.6,
    reviewCount: 520,
    tags: ["Sweet & Spicy", "Wok"],
    prepTime: 18,
    calories: 380,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isTrending: true,
    isChefSpecial: false,
    isAvailable: true
  },

  // --- UNDER ₹149 ---
  {
    id: "budget-paneertikka-1",
    name: "Paneer Tikka",
    description: "Soft tandoori paneer cubes skewered with crisp peppers, marinated in yogurt mustard oil, and grilled in hot clay oven.",
    category: "Snacks",
    price: 139,
    rating: 4.8,
    reviewCount: 780,
    tags: ["Tandoor", "Smoked"],
    prepTime: 20,
    calories: 290,
    image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isTrending: true,
    isChefSpecial: false,
    isAvailable: true
  },
  {
    id: "budget-pavbhaji-1",
    name: "Pav Bhaji",
    description: "A steaming aromatic curry of mashed seasonal vegetables cooked in home spices, served with two soft toasted white rolls dripping with Amul butter.",
    category: "Snacks",
    price: 129,
    rating: 4.9,
    reviewCount: 1450,
    tags: ["Classic", "Comfort"],
    prepTime: 15,
    calories: 420,
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isTrending: true,
    isChefSpecial: false,
    isAvailable: true
  },
  {
    id: "budget-hakkanoodles-1",
    name: "Hakka Noodles",
    description: "Wok-fried premium noodles cooked in light sesame oil with celery, green chili strings, and colorful bell pepper strips.",
    category: "Chinese",
    price: 139,
    rating: 4.7,
    reviewCount: 540,
    tags: ["Chinese", "Stir-Fry"],
    prepTime: 16,
    calories: 310,
    image: "https://images.unsplash.com/photo-1612966608967-30914e7401d6?w=600&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isTrending: false,
    isChefSpecial: false,
    isAvailable: true
  },
  {
    id: "budget-frankieroll-1",
    name: "Frankie Roll",
    description: "Crisp wheat flatbread layered with chili spread, a golden fried spicy potato roll, onions, sweet spices, and vinegar garnish.",
    category: "Snacks",
    price: 119,
    rating: 4.6,
    reviewCount: 390,
    tags: ["Roll", "Street Eat"],
    prepTime: 12,
    calories: 280,
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isTrending: true,
    isChefSpecial: false,
    isAvailable: true
  },
  {
    id: "budget-alootikkicombo-1",
    name: "Aloo Tikki Combo",
    description: "Two golden-fried crisp potato patties served over a rich spiced chickpea dhal curry, laced with cool yogurt and dynamic chutneys.",
    category: "Combo",
    price: 145,
    rating: 4.8,
    reviewCount: 670,
    tags: ["Chaat Combo", "Traditional"],
    prepTime: 15,
    calories: 390,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isTrending: false,
    isChefSpecial: false,
    isAvailable: true
  },

  // --- UNDER ₹199 ---
  {
    id: "budget-burger-1",
    name: "Burger",
    description: "Two crunchy grain-veg patties stacked inside grilled sesame buns with iceberg lettuce, tomatoes, and dynamic spex burger spread.",
    category: "Burger",
    price: 169,
    rating: 4.7,
    reviewCount: 920,
    tags: ["Burger", "Melted Cheese"],
    prepTime: 15,
    calories: 450,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isTrending: true,
    isChefSpecial: false,
    isAvailable: true
  },
  {
    id: "budget-pizzaslice-1",
    name: "Pizza Slice Combo",
    description: "A generous slice of hand-tossed sourdough pizza baked with creamy mozzarella and fresh sweet basil leaves, served with cold lemon lime soda.",
    category: "Combo",
    price: 189,
    rating: 4.6,
    reviewCount: 480,
    tags: ["Slice Combo", "Italian Style"],
    prepTime: 14,
    calories: 410,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isTrending: true,
    isChefSpecial: false,
    isAvailable: true
  },
  {
    id: "budget-manchuriancombo-1",
    name: "Manchurian Combo",
    description: "A highly filling portion of chef's wok-tossed garlic jasmine fried rice served with four succulent vegetable balls cooked in rich black ginger gravy.",
    category: "Combo",
    price: 179,
    rating: 4.8,
    reviewCount: 750,
    tags: ["Chinese Combo", "Wok Stirred"],
    prepTime: 18,
    calories: 510,
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isTrending: false,
    isChefSpecial: false,
    isAvailable: true
  },
  {
    id: "budget-cholebhature-1",
    name: "Chole Bhature",
    description: "Two fluffy, golden puffed fried sourdough breads served with thick, dark spiced chickpea curry cooked with pure ginger juliennes and whole herbs.",
    category: "North Indian",
    price: 189,
    rating: 4.9,
    reviewCount: 1560,
    tags: ["Classic Heritage", "Buttery"],
    prepTime: 15,
    calories: 640,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isTrending: true,
    isChefSpecial: true,
    isAvailable: true
  },

  // --- UNDER ₹249 ---
  {
    id: "budget-cheeseburgermeal-1",
    name: "Cheese Burger Meal",
    description: "A loaded crisp vegetable burger with thick hot cheddar glaze pouring inside, accompanied by warm golden fries and spex special herb mayonnaise.",
    category: "Burger",
    price: 229,
    rating: 4.8,
    reviewCount: 880,
    tags: ["Heavy Meal", "High Protein"],
    prepTime: 18,
    calories: 590,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isTrending: true,
    isChefSpecial: false,
    isAvailable: true
  },
  {
    id: "budget-noodcombo-1",
    name: "Premium Noodles Combo",
    description: "Chef's seasoned chili garlic soft noodles presented alongside succulent, moist paneer triangles stir-fried with dark soy, sesame and scallions.",
    category: "Combo",
    price: 239,
    rating: 4.7,
    reviewCount: 620,
    tags: ["Premium Wok", "Hearty"],
    prepTime: 20,
    calories: 540,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isTrending: true,
    isChefSpecial: false,
    isAvailable: true
  },
  {
    id: "budget-paneermealcombo-1",
    name: "Paneer Meal Combo",
    description: "A gourmet tray containing rich Paneer Butter Masala curry, aromatic ghee pulao rice, black dal makhani, and two hot buttered tandoor naans.",
    category: "Combo",
    price: 245,
    rating: 4.9,
    reviewCount: 1110,
    tags: ["Traditional Thali", "Royal Dinner"],
    prepTime: 22,
    calories: 720,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isTrending: true,
    isChefSpecial: true,
    isAvailable: true
  },

  // --- UNDER ₹299 ---
  {
    id: "budget-fullpizza-1",
    name: "Full Pizza",
    description: "An authentic flatbread crust smeared with premium green basil pesto sauce, layered with mozzarella cheese slices and sundried sweet cherry tomatoes.",
    category: "Pizza",
    price: 289,
    rating: 4.8,
    reviewCount: 730,
    tags: ["Pizza", "Sourdough Crusted"],
    prepTime: 20,
    calories: 690,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isTrending: true,
    isChefSpecial: false,
    isAvailable: true
  },
  {
    id: "budget-corndog-1",
    name: "Korean Corn Dog Combo",
    description: "Two golden panko-crusted skewers boasting stretchy mozzarella cheese blocks and sweet potato cubes, rolled in sugar and drizzled with hot sriracha.",
    category: "Combo",
    price: 279,
    rating: 4.6,
    reviewCount: 310,
    tags: ["Korean Style", "Savory"],
    prepTime: 12,
    calories: 480,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isTrending: true,
    isChefSpecial: false,
    isAvailable: true
  },
  {
    id: "budget-ramenbowl-1",
    name: "Ramen Bowl",
    description: "A hot, comforting bowl of premium mineral-water noodles submerged in creamy miso broth, styled with golden tandoori paneer skewers, spinach, and hot chili oil.",
    category: "Chinese",
    price: 299,
    rating: 4.8,
    reviewCount: 590,
    tags: ["Ramen Bowl", "Fusion Flavor"],
    prepTime: 18,
    calories: 510,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isTrending: true,
    isChefSpecial: true,
    isAvailable: true
  },
  {
    id: "budget-chefburger-1",
    name: "Chef Special Burger",
    description: "A thick grill-charred portobello mushroom stuffed with creamy gouda cheese, glazed with sweet dynamic black truffle oil-infused spread in brioche buns.",
    category: "Burger",
    price: 269,
    rating: 4.9,
    reviewCount: 420,
    tags: ["Artisanal Sensation", "Truffle Oil"],
    prepTime: 16,
    calories: 580,
    image: "https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?w=600&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isTrending: true,
    isChefSpecial: true,
    isAvailable: true
  },

  // --- UNDER ₹399 ---
  {
    id: "budget-sushiplatter-1",
    name: "Sushi Platter",
    description: "Eight meticulously structured maki rolls featuring buttery avocado flesh, sweetened organic mango strings, and hand-rolled premium sushi rice sheets.",
    category: "Chinese",
    price: 389,
    rating: 4.8,
    reviewCount: 490,
    tags: ["Sushi", "Imperial Serving"],
    prepTime: 22,
    calories: 340,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isTrending: true,
    isChefSpecial: true,
    isAvailable: true
  },
  {
    id: "budget-piizacombo-1",
    name: "Premium Pizza Combo",
    description: "A whole 9-inch hand-tossed fresh paneer and green capsicum cheesy pizza served with two cold craft ginger juices.",
    category: "Combo",
    price: 379,
    rating: 4.9,
    reviewCount: 830,
    tags: ["Pizza Feast", "Ideal Sharing"],
    prepTime: 24,
    calories: 810,
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isTrending: true,
    isChefSpecial: false,
    isAvailable: true
  },
  {
    id: "budget-kfmeal-1",
    name: "Korean Fried Chicken Meal",
    description: "Super crispy succulent premium glaze-fried chicken chunks coated with authentic fermented sweet and spicy gochujang sauce, served on premium sticky rice with sesame flakes.",
    category: "Combo",
    price: 369,
    rating: 4.7,
    reviewCount: 290,
    tags: ["High Crunch", "Szechuan Glow"],
    prepTime: 20,
    calories: 490,
    image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isTrending: true,
    isChefSpecial: false,
    isAvailable: true
  },

  // --- UNDER ₹499 ---
  {
    id: "budget-familycombo-1",
    name: "Family Combo",
    description: "An ultra-premium thali feast carrying generous black dal makhani, rich butter paneer, fresh malai kofta, cumin pulao, four buttered naans, garden salad, and sweet gulab jamuns.",
    category: "Combo",
    price: 479,
    rating: 4.9,
    reviewCount: 1420,
    tags: ["Mega Platter", "Traditional Feast"],
    prepTime: 30,
    calories: 1250,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isTrending: true,
    isChefSpecial: true,
    isAvailable: true
  },
  {
    id: "budget-partypack-1",
    name: "Party Pack",
    description: "A collection of 2 Crispy Paneer Burgers, a double-sized portion of wok-fried chowmein, 6 steamed vegetable momos, and 2 bottles of artisanal iced teas.",
    category: "Combo",
    price: 499,
    rating: 4.8,
    reviewCount: 810,
    tags: ["Mega Set", "Party Size"],
    prepTime: 28,
    calories: 1410,
    image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isTrending: true,
    isChefSpecial: false,
    isAvailable: true
  },
  {
    id: "budget-sharingbox-1",
    name: "Premium Sharing Box",
    description: "An assortative luxury box holding grilled paneer seekh skewers, clay-roasted vegetable tikkas, crispy corn dogs, and premium chili-dipping sauces.",
    category: "Combo",
    price: 489,
    rating: 4.9,
    reviewCount: 970,
    tags: ["Sharing Platter", "Smoked Sensation"],
    prepTime: 25,
    calories: 920,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isTrending: false,
    isChefSpecial: true,
    isAvailable: true
  },

  // --- PREMIUM SPECIALS ---
  {
    id: "budget-sushiroll-1",
    name: "Sushi Roll",
    description: "Delicate vinegared rice rolled with dynamic black truffle strips, sweet pickled squash, crisp cucumber, brushed with sweet soy and gold flakes.",
    category: "Chinese",
    price: 549,
    rating: 4.9,
    reviewCount: 310,
    tags: ["Imperial Premium", "Gold Leaf Trimmings"],
    prepTime: 18,
    calories: 310,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isTrending: true,
    isChefSpecial: true,
    isAvailable: true
  },
  {
    id: "budget-tiramisu-1",
    name: "Tiramisu",
    description: "Delicate Italian sponge cake layers drenched in strong espresso, filled with organic saffron-mascarpone cream and raw Dutch cocoa powder.",
    category: "Desserts",
    price: 529,
    rating: 4.9,
    reviewCount: 540,
    tags: ["Lounge Dessert", "Aromatic"],
    prepTime: 10,
    calories: 380,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isTrending: true,
    isChefSpecial: true,
    isAvailable: true
  },
  {
    id: "budget-cheesecake-1",
    name: "Cheesecake",
    description: "A silky smooth rich cheese batter baked on hand-pressed butter-graham cookie crust, topped with fresh crushed strawberries preserve.",
    category: "Desserts",
    price: 519,
    rating: 4.8,
    reviewCount: 720,
    tags: ["Lounge Dessert", "Sweet Glaze"],
    prepTime: 10,
    calories: 420,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isTrending: true,
    isChefSpecial: false,
    isAvailable: true
  },
  {
    id: "budget-waffle-1",
    name: "Belgian Waffle",
    description: "Warm freshly iron-baked thick waffle dripping with molten premium Belgian chocolate syrup and paired with light vanilla custard whipped swirl.",
    category: "Desserts",
    price: 509,
    rating: 4.7,
    reviewCount: 460,
    tags: ["Crisp Crust", "Sweet Sensations"],
    prepTime: 12,
    calories: 490,
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isTrending: false,
    isChefSpecial: false,
    isAvailable: true
  },
  {
    id: "budget-chefspec-1",
    name: "Chef Signature Specials",
    description: "The ultimate Spex masterwork: featuring woodfired cottage cheese steak, rich tandoori smoked cashew curry, pure saffron rice, wild flower organic honey tea, and warm spiced date cake.",
    category: "Combo",
    price: 699,
    rating: 4.95,
    reviewCount: 1180,
    tags: ["Secret Menu", "Private Reserve"],
    prepTime: 35,
    calories: 1290,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isTrending: true,
    isChefSpecial: true,
    isAvailable: true
  }
];

export interface OrderByBudgetProps {
  addToCart: (foodId: string, add?: boolean) => void;
  toggleWishlist: (foodId: string) => void;
  wishlist: string[];
  onOpenDirectOrder: (food: FoodItem) => void;
}

export default function OrderByBudget({
  addToCart,
  toggleWishlist,
  wishlist,
  onOpenDirectOrder
}: OrderByBudgetProps) {
  const [selectedBudget, setSelectedBudget] = useState<string>('Under ₹199');

  const budgetTiers = [
    { label: 'Under ₹49', maxPrice: 49 },
    { label: 'Under ₹99', maxPrice: 99 },
    { label: 'Under ₹149', maxPrice: 149 },
    { label: 'Under ₹199', maxPrice: 199 },
    { label: 'Under ₹249', maxPrice: 249 },
    { label: 'Under ₹299', maxPrice: 299 },
    { label: 'Under ₹399', maxPrice: 399 },
    { label: 'Under ₹499', maxPrice: 499 },
    { label: 'Premium Specials', maxPrice: Infinity }
  ];

  const filteredFoods = React.useMemo(() => {
    const tier = budgetTiers.find(t => t.label === selectedBudget);
    if (!tier) return [];
    
    if (tier.label === 'Premium Specials') {
      return BUDGET_FOODS.filter(f => f.price > 499 || f.id.includes('sushiroll') || f.id.includes('tiramisu') || f.id.includes('cheesecake') || f.id.includes('waffle') || f.id.includes('chefspec'));
    }
    
    const prevTier = budgetTiers[budgetTiers.indexOf(tier) - 1];
    const minPrice = prevTier ? prevTier.maxPrice : 0;
    
    return BUDGET_FOODS.filter(f => f.price <= tier.maxPrice && f.price > minPrice && !f.id.includes('sushiroll') && !f.id.includes('tiramisu') && !f.id.includes('cheesecake') && !f.id.includes('waffle') && !f.id.includes('chefspec'));
  }, [selectedBudget]);

  return (
    <section className="bg-[#0b0b0b] py-20 border-t border-neutral-900 relative overflow-hidden select-none">
      {/* Background Ambience Glow */}
      <div className="absolute top-0 right-1/4 h-96 w-96 bg-[#FF5A1F]/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 h-96 w-96 bg-[#FF8C42]/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Header Block */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full px-4.5 py-1.5 border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 text-[#FF5A1F] text-[10px] font-black tracking-widest uppercase font-mono">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            Culinary Math, Uncompromised
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Order By Your Budget
          </h2>
          <p className="text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed">
            Discover delicious meals at every price point. Swiggy & Zomato style smart budget filter, powered by luxury Spex design.
          </p>
        </div>

        {/* Dynamic Filter Chips Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14">
          {budgetTiers.map(tier => {
            const isActive = selectedBudget === tier.label;
            return (
              <motion.button
                key={tier.label}
                onClick={() => setSelectedBudget(tier.label)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-3 rounded-2xl text-xs font-black tracking-wide font-mono transition duration-300 cursor-pointer relative ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF5A1F] to-[#FF8C42] text-white shadow-xl shadow-[#FF5A1F]/15 border border-[#FF5A1F]/40'
                    : 'bg-[#151515] hover:bg-[#1a1a1a] text-neutral-400 hover:text-white border border-neutral-850 hover:border-neutral-700'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeBudgetGlow"
                    className="absolute inset-0 rounded-2xl border-2 border-[#FFD166]/55 opacity-70 blur-[1px] pointer-events-none"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {tier.label}
              </motion.button>
            );
          })}
        </div>

        {/* Dynamic Animated Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredFoods.map(food => {
              const matchesWishlist = wishlist.includes(food.id);
              
              return (
                <motion.div
                  key={food.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -15, transition: { duration: 0.25 } }}
                  transition={{ type: "spring", damping: 25, stiffness: 180 }}
                  className="group rounded-[28px] border border-neutral-850 bg-[#121212]/90 hover:bg-[#151515]/95 p-4.5 flex flex-col justify-between hover:border-neutral-800 hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                >
                  {/* Subtle Glow on Card Hover */}
                  <div className="absolute inset-x-0 -top-40 h-80 bg-gradient-to-b from-[#FF5A1F]/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Food Media Stack */}
                  <div className="relative aspect-[4/3] w-full rounded-[20px] overflow-hidden bg-neutral-900 border border-neutral-900 shadow-inner">
                    <img
                      src={food.image}
                      alt={food.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Dark gradient base on media */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                    {/* Quick Badges Placement */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
                      {food.isBestSeller && (
                        <div className="flex items-center gap-1 rounded-md px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-black bg-[#FFD166]/95 border border-[#FFD166] shadow-sm font-mono">
                          👑 Best Seller
                        </div>
                      )}
                      
                      {food.isTrending && (
                        <div className="flex items-center gap-1 rounded-md px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-white bg-gradient-to-r from-teal-500 to-emerald-600 shadow-sm font-mono">
                          <Flame className="h-2.5 w-2.5" /> Trending
                        </div>
                      )}

                      {food.isChefSpecial && (
                        <div className="flex items-center gap-1 rounded-md px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-white bg-gradient-to-r from-[#FF5A1F] to-[#FF8C42] shadow-sm font-mono">
                          <Sparkles className="h-2.5 w-2.5 animate-spin" /> Chef's Signature
                        </div>
                      )}
                    </div>

                    {/* Veg Indicator Badge in India Style */}
                    <div className="absolute top-2.5 right-2.5 z-10 bg-black/50 backdrop-blur-sm p-1.5 rounded-lg border border-neutral-800">
                      <div className="h-4.5 w-4.5 border-2 border-emerald-600 rounded flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-emerald-600" />
                      </div>
                    </div>

                    {/* Interactive Top-right Floating Favorite Toggle */}
                    <div className="absolute bottom-2.5 right-2.5 z-10">
                      <button
                        onClick={() => toggleWishlist(food.id)}
                        className={`h-9 w-9 rounded-xl flex items-center justify-center transition cursor-pointer border ${
                          matchesWishlist
                            ? 'bg-rose-500/15 border-rose-500/30 text-rose-500 hover:bg-rose-500/25'
                            : 'bg-black/55 border-neutral-800 text-neutral-400 hover:text-white hover:bg-black/75'
                        }`}
                      >
                        <Heart className={`h-4.5 w-4.5 ${matchesWishlist ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Preptime / Calorie Indicators bottom-left inside image */}
                    <div className="absolute bottom-2.5 left-2.5 z-10 flex gap-2">
                      <span className="text-[9px] font-black font-mono tracking-wide text-neutral-300 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-neutral-800">
                        ⏱ {food.prepTime} MINS
                      </span>
                      <span className="text-[9px] font-black font-mono tracking-wide text-neutral-300 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-neutral-800">
                        🔥 {food.calories} CAL
                      </span>
                    </div>

                  </div>

                  {/* Food Card Summary */}
                  <div className="mt-4.5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Rating details & counter */}
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5 text-[#FFD166]">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span className="text-xs font-black font-mono">{food.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-[10px] text-neutral-500 font-mono">({food.reviewCount}+ dynamic verifies)</span>
                      </div>

                      <h3 className="text-sm font-black text-white mt-1.5 group-hover:text-[#FF5A1F] transition duration-200">
                        {food.name}
                      </h3>
                      <p className="text-[11px] text-neutral-400 mt-2 line-clamp-2 leading-relaxed font-sans">
                        {food.description}
                      </p>
                    </div>

                    {/* Controls Tray */}
                    <div className="mt-6 pt-3.5 border-t border-neutral-850 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-mono tracking-widest text-neutral-500 font-black">STRIKING PRICE</span>
                        <span className="text-lg font-black text-white tracking-tight mt-0.5">₹{food.price}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Quick Order Button */}
                        <button
                          onClick={() => onOpenDirectOrder(food)}
                          className="rounded-xl bg-gradient-to-r from-[#FF5A1F] to-[#FF8C42] hover:brightness-110 text-[10px] font-black px-3.5 py-2 text-white transition cursor-pointer flex items-center gap-1 shadow-lg shadow-[#FF5A1F]/10 font-mono uppercase tracking-wide"
                        >
                          <Zap className="h-3.5 w-3.5" /> Order
                        </button>

                        {/* Traditional Add Shopping Bag Button */}
                        <button
                          onClick={() => addToCart(food.id, true)}
                          className="rounded-xl bg-neutral-900 hover:bg-[#FF5A1F]/10 border border-neutral-800 hover:border-[#FF5A1F]/40 hover:text-[#FF5A1F] p-2 text-neutral-400 transition cursor-pointer"
                        >
                          <ShoppingBag className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
