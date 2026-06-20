import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll } from 'motion/react';
import { FoodItem } from '../types';
import { Heart, Star, Sparkles, Flame, Clock, ShoppingCart, ArrowLeft, ArrowRight, Zap, Check } from 'lucide-react';

interface FoodDiscoverySliderProps {
  addToCart: (foodId: string, add?: boolean) => void;
  toggleWishlist?: (foodId: string) => void;
  wishlist?: string[];
  onOpenDirectOrder?: (food: FoodItem) => void;
}

// 44 hand-curated ultra-premium foods matching exactly what is requested with immaculate high-definition specific images
export const DISCOVERY_ITEMS: FoodItem[] = [
  // --- Indian Street Foods (24 dishes) ---
  {
    id: "disc-panipuri",
    name: "Pani Puri",
    description: "Crisp hollow pastry balls filled with potato spice smash and loaded with ready-to-pour vibrant mint-coriander spiced elixir water.",
    rating: 4.9,
    reviewCount: 284,
    price: 139,
    category: "Snacks",
    tags: ["Classic Street", "Pure Veg", "Chef Special"],
    prepTime: 5,
    calories: 140,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
    isChefSpecial: true,
    isAvailable: true
  },
  {
    id: "disc-golgappa",
    name: "Golgappa",
    description: "Crunchy puffed spheres filled with black chickpeas, roasted cumin potatoes, and accompanied with thick sweet tamarind date paste.",
    rating: 4.8,
    reviewCount: 219,
    price: 129,
    category: "Snacks",
    tags: ["Indian Standard", "Most Popular", "Pure Veg"],
    prepTime: 5,
    calories: 155,
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=800&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isAvailable: true
  },
  {
    id: "disc-dahipuri",
    name: "Dahi Puri",
    description: "Crispy puris puffed and loaded with seasoned potatoes, cooled whipped sweet yogurt, fine yellow sev, and mint-tamarind nectar.",
    rating: 4.9,
    reviewCount: 194,
    price: 169,
    category: "Snacks",
    tags: ["Sweet-Tangy Cream", "Pure Veg", "Trending"],
    prepTime: 6,
    calories: 280,
    image: "https://images.unsplash.com/photo-1566417713040-40db38e61e05?w=800&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    id: "disc-bhelpuri",
    name: "Bhel Puri",
    description: "Zesty street-side dry mixture of airy puffed rice, crispy flat papdis, salted peanuts, lime splash, sweet red onions and coriander.",
    rating: 4.7,
    reviewCount: 162,
    price: 119,
    category: "Snacks",
    tags: ["Light Crunch", "Vegan Friendly", "Most Popular"],
    prepTime: 4,
    calories: 180,
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    id: "disc-sevpuri",
    name: "Sev Puri",
    description: "Flat crispy flour wafers laden with sliced tawa potatoes, sweet green house mango shreds, spices, and a dense blanket of fine sev.",
    rating: 4.8,
    reviewCount: 150,
    price: 149,
    category: "Snacks",
    tags: ["High Crunch", "Mumbai Accent", "Pure Veg"],
    prepTime: 5,
    calories: 230,
    image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    id: "disc-samosa",
    name: "Samosa",
    description: "Traditional triangular crisp golden pastry shell filled with rich roasted cumin mashed potatoes, spices, ginger, and sweet green peas.",
    rating: 4.7,
    reviewCount: 308,
    price: 99,
    category: "Snacks",
    tags: ["Classic Standard", "Crispy", "Pure Veg"],
    prepTime: 8,
    calories: 260,
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=800&auto=format&fit=crop&q=80",
    isChefSpecial: true,
    isAvailable: true
  },
  {
    id: "disc-kachori",
    name: "Kachori",
    description: "Flaky circular deep-fried golden pastry filled with seasoned split moong lentils, asafoetida, and dry ginger powder.",
    rating: 4.6,
    reviewCount: 124,
    price: 119,
    category: "Snacks",
    tags: ["Savory Crust", "Pure Veg"],
    prepTime: 8,
    calories: 310,
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=800&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    id: "disc-alootikki",
    name: "Aloo Tikki",
    description: "Shallow pan-fried potato hash medallions layered with hot ginger chickpea curry, sweet curd whips and fresh cilantro sprigs.",
    rating: 4.8,
    reviewCount: 184,
    price: 149,
    category: "Snacks",
    tags: ["Street Grilled", "Gluten Free Friendly", "Pure Veg"],
    prepTime: 7,
    calories: 220,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    id: "disc-cholebhature",
    name: "Chole Bhature",
    description: "Puffy, golden fried fluffy sourdough flatbread pairs with a heavy iron-cooked dark chickpeas slow-infused with black tea and bay leaf.",
    rating: 4.9,
    reviewCount: 420,
    price: 249,
    category: "North Indian",
    tags: ["Gourmet Standard", "Chef Special", "Pure Veg"],
    prepTime: 12,
    calories: 680,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
    isChefSpecial: true,
    isBestSeller: true,
    isAvailable: true
  },
  {
    id: "disc-pavbhaji",
    name: "Pav Bhaji",
    description: "Zesty thick tomato-rich mashed vegetable stew topped with fresh churned white butter, served with soft griddle-toasted pav buns.",
    rating: 4.9,
    reviewCount: 388,
    price: 199,
    category: "Snacks",
    tags: ["Spiced Creamy", "Mumbai Pride", "Pure Veg"],
    prepTime: 10,
    calories: 450,
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isAvailable: true
  },
  {
    id: "disc-vadapav",
    name: "Vada Pav",
    description: "Fragrant spiced mashed potato dumpling dipped in chickpea batter and deep-fried, sandwiched in butter-grilled pav with hot garlic crumbs.",
    rating: 4.8,
    reviewCount: 341,
    price: 119,
    category: "Snacks",
    tags: ["Mumbai Burger", "Most Popular", "Pure Veg"],
    prepTime: 6,
    calories: 290,
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=80",
    isTrending: true,
    isAvailable: true
  },
  {
    id: "disc-dabeli",
    name: "Dabeli",
    description: "Sweet-spicy potato mash inside warm buns, combined with sweet tamarind, raw pomegranate seeds, and salted peanuts.",
    rating: 4.7,
    reviewCount: 112,
    price: 129,
    category: "Snacks",
    tags: ["Kutchi Style", "Spiced Ground", "Pure Veg"],
    prepTime: 6,
    calories: 320,
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    id: "disc-momos",
    name: "Momos",
    description: "Thin hand-wrapped flour skins stuffed with minced fresh cabbage, scallions and onions, served with premium red garlic chili salsa.",
    rating: 4.8,
    reviewCount: 299,
    price: 159,
    category: "Chinese",
    tags: ["Steamed Soft", "High Protein", "Pure Veg"],
    prepTime: 9,
    calories: 210,
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80",
    isTrending: true,
    isAvailable: true
  },
  {
    id: "disc-springroll",
    name: "Spring Roll",
    description: "Immaculate crisp rice sheets rolled around wok-fried cabbage shreds, carrot, celery shoots, and golden glass noodles, fried crisp.",
    rating: 4.7,
    reviewCount: 167,
    price: 149,
    category: "Chinese",
    tags: ["Deep Fried", "Extra Crispy", "Pure Veg"],
    prepTime: 8,
    calories: 240,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    id: "disc-chowmein",
    name: "Chowmein",
    description: "Old-school street food stir-fried long wheat noodles tossed with julienne cabbage, green bell peppers, dark soy, and hot vinegar.",
    rating: 4.8,
    reviewCount: 236,
    price: 179,
    category: "Chinese",
    tags: ["Street Wok style", "Highly Savory", "Pure Veg"],
    prepTime: 8,
    calories: 380,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    id: "disc-hakkanoodles",
    name: "Hakka Noodles",
    description: "Premium Indo-Chinese long wheat noodles wok-tossed gracefully with fragrant spring onions, green capsicums and a trace of sesame.",
    rating: 4.8,
    reviewCount: 254,
    price: 189,
    category: "Chinese",
    tags: ["Clean Glazed", "Savory Choice", "Pure Veg"],
    prepTime: 8,
    calories: 350,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80",
    isTrending: true,
    isAvailable: true
  },
  {
    id: "disc-manchurian",
    name: "Manchurian",
    description: "Crisp minced vegetable spheres slow-simmered in a dark, thick, shiny, and savory garlic-spring onion soy glaze.",
    rating: 4.8,
    reviewCount: 290,
    price: 199,
    category: "Chinese",
    tags: ["Chinese Classic", "Gravy Rich", "Pure Veg"],
    prepTime: 10,
    calories: 320,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isAvailable: true
  },
  {
    id: "disc-chillipotato",
    name: "Chilli Potato",
    description: "High-temperature wok-fried crispy finger potatoes glazed with dark chili garlic sauces and sprinkled with toasted sesame.",
    rating: 4.6,
    reviewCount: 142,
    price: 169,
    category: "Chinese",
    tags: ["Seared Spicy", "Glazed Crunch", "Pure Veg"],
    prepTime: 8,
    calories: 410,
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    id: "disc-frankie",
    name: "Frankie Roll",
    description: "Soft buttered layered flatbread wraps rolled with tandoori paneer brickets, chopped green onions, lime drops, and chat dust.",
    rating: 4.7,
    reviewCount: 201,
    price: 159,
    category: "Snacks",
    tags: ["Roll Special", "Fresh Spiced", "Pure Veg"],
    prepTime: 7,
    calories: 340,
    image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=800&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    id: "disc-breadpakora",
    name: "Bread Pakora",
    description: "Double thick bread slices sandwich stuffed with aromatic seasoned potatoes, dipped in spiced gram flour batter, and gold fried.",
    rating: 4.6,
    reviewCount: 110,
    price: 119,
    category: "Snacks",
    tags: ["Deep Batter", "Comfort Snack", "Pure Veg"],
    prepTime: 6,
    calories: 390,
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=800&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    id: "disc-paneertikka",
    name: "Paneer Tikka",
    description: "Succulent charcoal skewered cubes of fresh mountain paneer marinated with hot mustard oil and red-chili Greek yogurt sauce.",
    rating: 4.9,
    reviewCount: 312,
    price: 329,
    category: "Burger",
    tags: ["Tandoor Smoked", "Chef Special", "Pure Veg"],
    prepTime: 12,
    calories: 380,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&auto=format&fit=crop&q=80",
    isChefSpecial: true,
    isAvailable: true
  },
  {
    id: "disc-masaladosa",
    name: "Masala Dosa",
    description: "Stretchy stone-ground thin rice crepe gold-roasted with ghee, containing a core of fragrant turmeric potato mash.",
    rating: 4.9,
    reviewCount: 460,
    price: 199,
    category: "South Indian",
    tags: ["Deccan Classic", "Crust Choice", "Pure Veg"],
    prepTime: 8,
    calories: 360,
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isAvailable: true
  },
  {
    id: "disc-uttapam",
    name: "Uttapam",
    description: "Thick savory rice pancakes embedded with diced tomatoes, red raw onions, green coriander, and hot chilies.",
    rating: 4.8,
    reviewCount: 172,
    price: 179,
    category: "South Indian",
    tags: ["Soft Thick Pancake", "Pure Veg"],
    prepTime: 9,
    calories: 310,
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    id: "disc-idlisambar",
    name: "Idli Sambar",
    description: "Steamed pillowy white cloud idlis served ready dipped inside a bowl of hot local lentil broth packed with carrots and drumsticks.",
    rating: 4.8,
    reviewCount: 224,
    price: 149,
    category: "South Indian",
    tags: ["Steamed Safe", "Weight Watcher", "Pure Veg"],
    prepTime: 6,
    calories: 190,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
    isAvailable: true
  },

  // --- Premium International Snacks (20 dishes) ---
  {
    id: "disc-margheritapizza",
    name: "Margherita Pizza",
    description: "Wood-fired premium Italian crust topped with fresh pureed San Marzano tomatoes, buffalo mozzarella shreds, olive oil and fresh basil.",
    rating: 4.9,
    reviewCount: 391,
    price: 499,
    category: "Pizza",
    tags: ["Italian Traditional", "Pure Veg", "Chef Special"],
    prepTime: 12,
    calories: 590,
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=80",
    isChefSpecial: true,
    isAvailable: true
  },
  {
    id: "disc-pepperonipizza",
    name: "Pepperoni Pizza",
    description: "Handcrafted Italian sourdough base loaded with sizzled cured Spanish pepperoni disks curling over sweet stringy mozzarella.",
    rating: 4.9,
    reviewCount: 412,
    price: 549,
    category: "Pizza",
    tags: ["Meat Delicatessen", "Most Popular"],
    prepTime: 12,
    calories: 780,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isAvailable: true
  },
  {
    id: "disc-garlicbread",
    name: "Garlic Bread",
    description: "Crisp baked artisan sourdough slices brushed with soft roasted garlic confit butter, fresh rosemary herbs and sea salt crystals.",
    rating: 4.8,
    reviewCount: 247,
    price: 199,
    category: "Pizza",
    tags: ["Side Pride", "Pure Veg"],
    prepTime: 7,
    calories: 290,
    image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=800&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    id: "disc-cheeseburger",
    name: "Cheese Burger",
    description: "Flame-grilled plant-based juicy patty stacked with melting aged cheddar, sliced gherkin curls, and house brioche glaze.",
    rating: 4.8,
    reviewCount: 310,
    price: 299,
    category: "Burger",
    tags: ["American Standard", "Pure Veg", "Trending"],
    prepTime: 9,
    calories: 460,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
    isTrending: true,
    isAvailable: true
  },
  {
    id: "disc-doublecheeseburger",
    name: "Double Cheese Burger",
    description: "Two prime flame-seared juicy patties loaded with double melted red cheddar, sliced raw onions, and smoked pepper paste.",
    rating: 4.9,
    reviewCount: 428,
    price: 389,
    category: "Burger",
    tags: ["High Food Volume", "Most Popular", "Pure Veg"],
    prepTime: 10,
    calories: 720,
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isAvailable: true
  },
  {
    id: "disc-hotdog",
    name: "Hot Dog",
    description: "Griddled premium organic long sausage nestled in toasted long buns, drizzled with mustard dressing and crunchy gherkins.",
    rating: 4.7,
    reviewCount: 164,
    price: 219,
    category: "Burger",
    tags: ["Street Fast", "Meat Choice"],
    prepTime: 6,
    calories: 380,
    image: "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=800&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    id: "disc-nachos",
    name: "Nachos",
    description: "Salted yellow corn tortilla chips baked with warm refried beans, cheddar, and loaded with fresh lime guacamole pulp spoon.",
    rating: 4.8,
    reviewCount: 221,
    price: 269,
    category: "Snacks",
    tags: ["Table share", "Pure Veg"],
    prepTime: 6,
    calories: 420,
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    id: "disc-tacos",
    name: "Tacos",
    description: "Double hard yellow corn pocket shells packed with seasoned ranch pinto beans, fresh salsa, cheese strings, and shredded lettuce.",
    rating: 4.8,
    reviewCount: 198,
    price: 229,
    category: "Snacks",
    tags: ["Chipotle Spiced", "Pure Veg", "Most Popular"],
    prepTime: 7,
    calories: 310,
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    id: "disc-burrito",
    name: "Burrito",
    description: "Mexican style big soft flour tortilla rolled around lime rice, black beans, guacamole cream and pico de gallo salsa.",
    rating: 4.8,
    reviewCount: 243,
    price: 289,
    category: "Snacks",
    tags: ["Heavy Wrap", "Pure Veg", "Chef Special"],
    prepTime: 8,
    calories: 540,
    image: "https://images.unsplash.com/photo-1626379616459-b2ce1d9decbc?w=800&auto=format&fit=crop&q=80",
    isChefSpecial: true,
    isAvailable: true
  },
  {
    id: "disc-sushi",
    name: "Sushi Roll",
    description: "Exquisite Japanese maki rolls with sweet ripe avocado cubes and sliced cucumber, served with real wasabi paste.",
    rating: 4.9,
    reviewCount: 320,
    price: 449,
    category: "Combo",
    tags: ["Kyoto Legacy", "Pure Veg", "Chef Special"],
    prepTime: 12,
    calories: 230,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80",
    isChefSpecial: true,
    isBestSeller: true,
    isAvailable: true
  },
  {
    id: "disc-ramen",
    name: "Ramen Bowl",
    description: "Custom long ramen wheat noodles resting in simmering miso broth, accompanied by bamboo shoots, nori leaves and baby greens.",
    rating: 4.9,
    reviewCount: 350,
    price: 499,
    category: "Chinese",
    tags: ["Japanese Comfort", "Warm Broth", "Pure Veg"],
    prepTime: 15,
    calories: 460,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80",
    isTrending: true,
    isAvailable: true
  },
  {
    id: "disc-corndog",
    name: "Korean Corn Dog",
    description: "Panko sugar-dusted golden fried cheese dog with extreme stretching mozzarella, drizzled with dynamic spicy condiments.",
    rating: 4.8,
    reviewCount: 265,
    price: 199,
    category: "Combo",
    tags: ["Seoul Street", "Cheese Strings", "Pure Veg"],
    prepTime: 8,
    calories: 390,
    image: "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?w=800&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    id: "disc-friedchicken",
    name: "Korean Fried Chicken",
    description: "Crispy double-fried boneless chicken tenders coated in a heavy shiny sweet soy garlic and hot gochujang sauce glaze.",
    rating: 4.9,
    reviewCount: 418,
    price: 349,
    category: "Combo",
    tags: ["Glossy Crisp", "Seoul Spiced", "Most Popular"],
    prepTime: 10,
    calories: 610,
    image: "https://images.unsplash.com/photo-1562967914-608b82629710?w=800&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isAvailable: true
  },
  {
    id: "disc-dimsum",
    name: "Dim Sum",
    description: "Translucent handcrafted dough purses stuffed with minced fresh bok choy, celery and ginger shoots, steamed to absolute perfection.",
    rating: 4.8,
    reviewCount: 260,
    price: 189,
    category: "Chinese",
    tags: ["Soft Steamed", "Delicate Taste", "Pure Veg"],
    prepTime: 9,
    calories: 160,
    image: "https://images.unsplash.com/photo-1496116211227-7d3c983db3be?w=800&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    id: "disc-croissant",
    name: "Croissant Sandwich",
    description: "French laminated golden flaky pastry sliced open and lined with wild arugula leaves, tomato discs, and herb cottage cheese.",
    rating: 4.7,
    reviewCount: 142,
    price: 239,
    category: "Desserts",
    tags: ["Parisian Bake", "Mild Spiced", "Pure Veg"],
    prepTime: 6,
    calories: 410,
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    id: "disc-waffle",
    name: "Belgian Waffle",
    description: "Deep pocketed gold waffles topped with dark Belgian chocolate streams, raw sweet honey and wild spring raspberries.",
    rating: 4.9,
    reviewCount: 319,
    price: 249,
    category: "Desserts",
    tags: ["Belgian Sweet", "Pure Veg", "Chef Special"],
    prepTime: 8,
    calories: 480,
    image: "https://images.unsplash.com/photo-1562376502-6f769499c886?w=800&auto=format&fit=crop&q=80",
    isChefSpecial: true,
    isAvailable: true
  },
  {
    id: "disc-donuts",
    name: "Donuts",
    description: "A ring of light fried yeast dough covered in deep glossy melted chocolate and colorful crunchy sugar drops.",
    rating: 4.8,
    reviewCount: 220,
    price: 179,
    category: "Desserts",
    tags: ["Baker Classics", "Pure Veg"],
    prepTime: 5,
    calories: 360,
    image: "https://images.unsplash.com/photo-1533591380348-14193f1de18f?w=800&auto=format&fit=crop&q=80",
    isAvailable: true
  },
  {
    id: "disc-brownie",
    name: "Brownie",
    description: "Thick fudgy black cocoa squares baked with dense dark chocolate chips and roasted walnuts, creating a perfect crust.",
    rating: 4.9,
    reviewCount: 298,
    price: 189,
    category: "Desserts",
    tags: ["Gooey Velvet", "Warm", "Pure Veg"],
    prepTime: 5,
    calories: 410,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80",
    isTrending: true,
    isAvailable: true
  },
  {
    id: "disc-cheesecake",
    name: "Cheesecake",
    description: "Creamy vanilla cream cheese layer on graham cracker base, glazed with wild organic sweet strawberry compote layers.",
    rating: 4.9,
    reviewCount: 351,
    price: 289,
    category: "Desserts",
    tags: ["American Traditional", "Pure Veg", "Chef Special"],
    prepTime: 6,
    calories: 440,
    image: "https://images.unsplash.com/photo-1524351199679-46cddf530c04?w=800&auto=format&fit=crop&q=80",
    isChefSpecial: true,
    isAvailable: true
  },
  {
    id: "disc-tiramisu",
    name: "Tiramisu",
    description: "Classic Italian coffee cake containing layers of espresso soaked ladies fingers and lightweight whipped mascarpone cocoa.",
    rating: 4.9,
    reviewCount: 382,
    price: 299,
    category: "Desserts",
    tags: ["Fine Confectionary", "Pure Veg", "Most Popular"],
    prepTime: 7,
    calories: 390,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isAvailable: true
  }
];

export default function FoodDiscoverySlider({
  addToCart,
  toggleWishlist,
  wishlist = [],
  onOpenDirectOrder,
}: FoodDiscoverySliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filter keys for local categories
  const [activeSegment, setActiveSegment] = useState<'all' | 'indian' | 'international'>('all');

  const filteredItems = DISCOVERY_ITEMS.filter(it => {
    if (activeSegment === 'all') return true;
    if (activeSegment === 'indian') return !it.id.startsWith('disc-margherita') && !it.id.includes('disc-pepperoni') && !it.id.includes('disc-garlic') && !it.id.includes('disc-cheese') && !it.id.includes('disc-double') && !it.id.includes('disc-hot') && !it.id.includes('disc-nacho') && !it.id.includes('disc-taco') && !it.id.includes('disc-burrito') && !it.id.includes('disc-sushi') && !it.id.includes('disc-ramen') && !it.id.includes('disc-corn') && !it.id.includes('disc-friedch') && !it.id.includes('disc-dim') && !it.id.includes('disc-croissant') && !it.id.includes('disc-waffle') && !it.id.includes('disc-donut') && !it.id.includes('disc-brownie') && !it.id.includes('disc-cheesecake') && !it.id.includes('disc-tiramisu');
    return it.id.startsWith('disc-margherita') || it.id.includes('disc-pepperoni') || it.id.includes('disc-garlic') || it.id.includes('disc-cheese') || it.id.includes('disc-double') || it.id.includes('disc-hot') || it.id.includes('disc-nacho') || it.id.includes('disc-taco') || it.id.includes('disc-burrito') || it.id.includes('disc-sushi') || it.id.includes('disc-ramen') || it.id.includes('disc-corn') || it.id.includes('disc-friedch') || it.id.includes('disc-dim') || it.id.includes('disc-croissant') || it.id.includes('disc-waffle') || it.id.includes('disc-donut') || it.id.includes('disc-brownie') || it.id.includes('disc-cheesecake') || it.id.includes('disc-tiramisu');
  });

  // Handle slide controls
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1));
  };

  const selectSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay function
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (isPlaying && filteredItems.length > 0) {
      timeoutRef.current = setTimeout(() => {
        handleNext();
      }, 4000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, isPlaying, filteredItems.length, activeSegment]);

  // Reset index when segment changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeSegment]);

  // Add to basket feedback
  const handleAddWithFeedback = (foodId: string) => {
    addToCart(foodId, true);
    setAddedIds((prev) => [...prev, foodId]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter(id => id !== foodId));
    }, 1500);
  };

  // Determine indices of current list for 3-card desktop visualization
  const getVisibleItems = () => {
    if (filteredItems.length === 0) return [];
    const len = filteredItems.length;
    // We want to return indices: [prev, center, next]
    const center = currentIndex;
    const prev = (center - 1 + len) % len;
    const next = (center + 1) % len;
    
    return [
      { item: filteredItems[prev], pos: 'prev', indexCode: prev },
      { item: filteredItems[center], pos: 'center', indexCode: center },
      { item: filteredItems[next], pos: 'next', indexCode: next },
    ];
  };

  const visibleDeck = getVisibleItems();

  // Floating background aesthetic grease particles
  const floatingLeavesArray = [
    { id: 1, top: '15%', left: '8%', size: 4, duration: 12, delay: 0 },
    { id: 2, top: '75%', left: '12%', size: 3, duration: 15, delay: 2 },
    { id: 3, top: '25%', right: '10%', size: 5, duration: 14, delay: 1 },
    { id: 4, top: '80%', right: '8%', size: 4, duration: 18, delay: 3 },
    { id: 5, top: '48%', left: '50%', size: 3, duration: 20, delay: 4 },
  ];

  return (
    <section 
      id="food-discovery-section"
      className="bg-[#0b0b0b] py-20 border-t border-b border-neutral-900 relative overflow-hidden select-none"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Dynamic luxury shadows and background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 h-[450px] w-[450px] bg-[#ffffff]/[0.02] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 h-[320px] w-[320px] bg-[#FF5A1F]/[0.02] rounded-full blur-[100px] pointer-events-none" />

      {/* Floating Particles in background */}
      {floatingLeavesArray.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-neutral-800 rounded-full opacity-35"
          style={{
            top: p.top,
            left: p.left,
            right: p.right,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, p.id % 2 === 0 ? 30 : -30, 0],
            opacity: [0.15, 0.45, 0.15],
            rotate: [0, 360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Header Title with premium badge */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-full px-4 py-1.5 shadow-xl">
            <Sparkles className="h-3.5 w-3.5 text-white animate-pulse" />
            <span className="text-[9px] font-black tracking-[0.25em] text-neutral-300 uppercase font-mono">
              Spex Culinary Discovery
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Explore Our Delicious Menu
          </h2>
          
          <p className="text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Swipe to discover your next favorite snack. Inspired by premium experiences with tactile gestures.
          </p>

          {/* Segment Filter Menu bar (All, Indian, International) */}
          <div className="flex justify-center pt-2">
            <div className="inline-flex rounded-xl bg-neutral-950/80 border border-neutral-900 p-1.5">
              {[
                { id: 'all', label: 'All Curations' },
                { id: 'indian', label: 'Indian Street Chaats' },
                { id: 'international', label: 'Premium International' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSegment(tab.id as any)}
                  className={`rounded-lg px-4 py-2 text-[11px] font-bold uppercase transition-all tracking-wider font-sans cursor-pointer ${
                    activeSegment === tab.id
                      ? 'bg-white text-black shadow-lg shadow-black/80'
                      : 'text-neutral-500 hover:text-neutral-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3D Glassmorphic Interactive Carousel View */}
        <div className="relative h-[610px] flex items-center justify-center overflow-visible">
          
          <div className="flex items-center justify-center w-full max-w-5xl gap-4 relative overflow-visible">
            
            {visibleDeck.map(({ item, pos, indexCode }) => {
              const isCenter = pos === 'center';
              const isPrev = pos === 'prev';
              
              const isVegItem = item.tags.some(t => t.toLowerCase().includes('veg'));

              return (
                <motion.div
                  key={item.id}
                  layoutId={`slide-${item.id}-${pos}`}
                  initial={{ 
                    opacity: 0, 
                    scale: isCenter ? 1 : 0.85, 
                    x: isPrev ? -180 : 180 
                  }}
                  animate={{
                    opacity: isCenter ? 1 : 0.35,
                    scale: isCenter ? 1.05 : 0.88,
                    filter: isCenter ? 'blur(0px)' : 'blur(4px)',
                    zIndex: isCenter ? 30 : 10,
                    x: isCenter ? 0 : (isPrev ? -150 : 150),
                  }}
                  transition={{ 
                    type: "spring", 
                    damping: 24, 
                    stiffness: 140 
                  }}
                  className={`absolute md:relative shrink-0 w-full max-w-[340px] md:max-w-[380px] bg-neutral-950/90 border border-neutral-850 rounded-[32px] overflow-hidden shadow-2xl ${
                    isCenter ? 'ring-1 ring-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]' : 'pointer-events-none hidden md:block'
                  }`}
                >
                  {/* Food HD Image Presentation Section */}
                  <div className="relative h-64 overflow-hidden bg-neutral-900 group">
                    
                    {/* Floating decoration sparkles inside card if Center */}
                    {isCenter && (
                      <div className="absolute top-3 left-3 z-40 flex flex-wrap gap-1">
                        {item.isBestSeller && (
                          <span className="bg-white text-black text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-lg font-mono">
                            🔥 MOST POPULAR
                          </span>
                        )}
                        {item.isChefSpecial && (
                          <span className="bg-[#FF5A1F] text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-lg font-mono">
                            👨‍🍳 CHEF SPECIAL
                          </span>
                        )}
                        {!item.isBestSeller && !item.isChefSpecial && (
                          <span className="bg-neutral-800 text-neutral-100 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-lg font-mono">
                            💎 TRENDING Collection
                          </span>
                        )}
                      </div>
                    )}

                    {/* Veg vs Non-Veg badge */}
                    <div className="absolute top-3 right-3 z-40 bg-neutral-950/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-neutral-850 flex items-center gap-1.5">
                      <span className={`h-2.5 w-2.5 rounded-full flex items-center justify-center border ${
                        isVegItem 
                          ? 'bg-emerald-500 border-emerald-400' 
                          : 'bg-red-500 border-red-400'
                        }`} 
                      />
                      <span className="text-[9px] font-mono tracking-wider font-bold text-neutral-300 uppercase">
                        {isVegItem ? 'Veg' : 'Non-Veg'}
                      </span>
                    </div>

                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 pointer-events-none select-none"
                    />

                    {/* Image bottom dynamic dark gradient fade */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent pointer-events-none" />
                  </div>

                  {/* Food Info & Tactile Control Dashboard Pane */}
                  <div className="p-6 space-y-4">
                    
                    {/* Top statistics badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-[#FFD166] text-[#FFD166]" />
                        <span className="text-xs font-black text-white font-mono">{item.rating}</span>
                        <span className="text-[10px] text-neutral-500">({item.reviewCount} customer reviews)</span>
                      </div>
                      
                      <div className="flex items-center gap-2.5 text-[10px] font-mono text-neutral-400 uppercase">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-neutral-500" />
                          <span>{item.prepTime} Min</span>
                        </div>
                        <span className="text-neutral-700">•</span>
                        <div className="flex items-center gap-1">
                          <Flame className="h-3 w-3 text-neutral-500" />
                          <span>{item.calories} Cal</span>
                        </div>
                      </div>
                    </div>

                    {/* Item title area */}
                    <div className="space-y-1.5 min-h-[72px]">
                      <h3 className="text-xl font-extrabold text-white tracking-tight line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">{item.description}</p>
                    </div>

                    {/* Dynamic Price tag & Wishlist Button */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="block text-[8px] font-mono uppercase tracking-[0.15em] text-neutral-500">Premium Fare</span>
                        <span className="text-2xl font-black text-white tracking-tight">₹{item.price}</span>
                      </div>

                      {/* Favorite Button */}
                      {toggleWishlist && (
                        <button
                          onClick={() => toggleWishlist(item.id)}
                          className="p-3 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-red-500 hover:border-red-500/20 active:scale-90 transition-all cursor-pointer shadow-md"
                          title="Save to favorites"
                        >
                          <Heart className={`h-4.5 w-4.5 ${wishlist.includes(item.id) ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>
                      )}
                    </div>

                    {/* Dual Luxury Action Buttons */}
                    <div className="grid grid-cols-2 gap-3.5 pt-2">
                      <button
                        onClick={() => handleAddWithFeedback(item.id)}
                        className={`rounded-2xl border text-xs font-black uppercase tracking-wider py-4 cursor-pointer transition-all flex items-center justify-center gap-1.5 font-sans ${
                          addedIds.includes(item.id)
                            ? 'bg-emerald-600/20 border-emerald-500/30 text-emerald-400 shadow-inner'
                            : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-white hover:border-white/20 active:scale-[0.98]'
                        }`}
                      >
                        {addedIds.includes(item.id) ? (
                          <>
                            <Check className="h-4 w-4 text-emerald-400" />
                            Added!
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4" />
                            Add To Cart
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => onOpenDirectOrder && onOpenDirectOrder(item)}
                        className="rounded-2xl bg-white text-black hover:bg-neutral-100 font-sans text-xs font-black uppercase tracking-wider py-4 cursor-pointer transition active:scale-[0.98] flex items-center justify-center gap-1 shadow-lg shadow-white/5"
                      >
                        <Zap className="h-4 w-4 fill-black" />
                        Order Now
                      </button>
                    </div>

                  </div>
                </motion.div>
              );
            })}

          </div>

          {/* Previous Slide arrow button left */}
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-20 z-40 flex items-center justify-center h-14 w-14 rounded-full border border-neutral-800 bg-neutral-950 text-white hover:bg-neutral-900 active:scale-90 transition shadow-2xl cursor-pointer group"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
          </button>

          {/* Next Slide arrow button right */}
          <button
            onClick={handleNext}
            className="absolute right-4 md:right-20 z-40 flex items-center justify-center h-14 w-14 rounded-full border border-neutral-800 bg-neutral-950 text-white hover:bg-neutral-900 active:scale-90 transition shadow-2xl cursor-pointer group"
          >
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </button>

        </div>

        {/* Tactile indicator dots bar along the bottom of the section */}
        <div className="flex flex-col items-center justify-center gap-4 mt-2">
          
          <div className="flex gap-1.5 flex-wrap justify-center max-w-sm px-4">
            {filteredItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => selectSlide(idx)}
                className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                  currentIndex === idx 
                    ? 'w-6 bg-white' 
                    : 'w-1.5 bg-neutral-800 hover:bg-neutral-700'
                }`}
                title={`Navigate to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="bg-neutral-950/80 border border-neutral-905 px-4 py-1.5 rounded-full text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
            {currentIndex + 1} of {filteredItems.length} curated master pieces
          </div>
        </div>

      </div>
    </section>
  );
}
