import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { sampleFoods } from './src/data/foods.js';
import { Order, Review, UserProfile, Coupon, Address } from './src/types.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// --- ENTERPRISE SECURITY & TRAFFIC PROTECTION MIDDLEWARE ---

// Anti-XSS and Input Sanitization utility for storing trusted payload string properties
function cleanInputString(val: any): any {
  if (typeof val !== 'string') return val;
  // Deep sanitization to strip dangerous elements and escape raw inputs to block HTML/XSS injection
  return val
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

function sanitizePayload(payload: any): any {
  if (!payload) return payload;
  if (typeof payload === 'string') {
    return cleanInputString(payload);
  }
  if (Array.isArray(payload)) {
    return payload.map(item => sanitizePayload(item));
  }
  if (typeof payload === 'object') {
    const cleaned: any = {};
    for (const key of Object.keys(payload)) {
      cleaned[key] = sanitizePayload(payload[key]);
    }
    return cleaned;
  }
  return payload;
}

// In-Memory client-based rate limiting table to handle high peaks and prevent brute force
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up stale IP records from the rate limiter map every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}, 300000);

function apiRateLimiter(req: Request, res: Response, next: () => void) {
  const clientIp = req.ip || (req.headers['x-forwarded-for'] as string) || 'unknown';
  const now = Date.now();
  const record = rateLimitMap.get(clientIp);

  if (!record) {
    rateLimitMap.set(clientIp, { count: 1, resetAt: now + 60000 }); // 1-minute window
    return next();
  }

  if (now > record.resetAt) {
    record.count = 1;
    record.resetAt = now + 60000;
    return next();
  }

  record.count++;
  if (record.count > 150) { // Limit to 150 requests per minute per client IP
    return res.status(429).json({
      error: 'Too many culinary inquiries. The chef is preparing your dishes with care. Please pace your requests.',
      retryAfterSeconds: Math.ceil((record.resetAt - now) / 1000)
    });
  }

  next();
}

// Attach rate-limiting and sanitizer pipelines to all API endpoints
app.use('/api', apiRateLimiter);
app.use('/api', (req: Request, res: Response, next) => {
  if (req.body) {
    req.body = sanitizePayload(req.body);
  }
  // Content Security Headers to safeguard our client-side app
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Initialize Gemini SDK with telemetry header requested by standard instructions
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Initialize in-memory persistent database structures for multi-user simulation
let userProfile: UserProfile = {
  name: 'Sachin Pal',
  email: 'sachinpal777999@gmail.com',
  phone: '+91 98765 43210',
  joinedDate: '2026-01-15',
  loyaltyPoints: 340,
  loyaltyTier: 'Gold',
  avatar: 'https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?w=150&auto=format&fit=crop&q=80',
};

let userAddresses: Address[] = [
  {
    id: 'addr-1',
    type: 'Home',
    addressLine1: 'Luxury Crest Apartment, 44B, Outer Ring Road',
    addressLine2: 'Near Prestige High School',
    city: 'Bengaluru',
    zipCode: '560103',
    isDefault: true,
  },
  {
    id: 'addr-2',
    type: 'Work',
    addressLine1: 'Spex Tech Hub, Level 15, Tower 2',
    addressLine2: 'Tech Park Layout',
    city: 'Bengaluru',
    zipCode: '560001',
    isDefault: false,
  },
];

let itemsDatabase = [...sampleFoods];

let ordersDatabase: Order[] = [
  {
    id: 'SPX-78593',
    items: [
      { foodId: 'spx-1', quantity: 1, priceAtOrder: 449, nameAtOrder: 'Margherita Royale' },
      { foodId: 'spx-6', quantity: 2, priceAtOrder: 399, nameAtOrder: 'Crispy Avocato Burger' },
      { foodId: 'spx-22', quantity: 1, priceAtOrder: 199, nameAtOrder: 'Hibiscus Rose Cold Brew' },
    ],
    subtotal: 1247,
    discount: 150,
    deliveryFee: 40,
    tax: 62.35,
    total: 1199.35,
    couponApplied: 'SPEXFIRST',
    status: 'Delivered',
    paymentMethod: 'UPI (GPay)',
    paymentStatus: 'Paid',
    deliveryAddress: userAddresses[0],
    deliveryNotes: 'Please ring the doorbell and leave it on the contactless delivery mount.',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(), // 2 days ago
    estimatedDeliveryTime: new Date(Date.now() - 3600000 * 24 * 2 + 1800000).toISOString(),
  },
  {
    id: 'SPX-92041',
    items: [
      { foodId: 'spx-2', quantity: 1, priceAtOrder: 599, nameAtOrder: 'Truffle Mushroom Pizza' },
      { foodId: 'spx-25', quantity: 1, priceAtOrder: 249, nameAtOrder: 'Truffle Parmesan Hand-Cut Fries' },
    ],
    subtotal: 848,
    discount: 0,
    deliveryFee: 40,
    tax: 42.4,
    total: 930.4,
    status: 'Preparing',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    deliveryAddress: userAddresses[0],
    deliveryNotes: 'Watch out for the sleeping pup in front.',
    createdAt: new Date().toISOString(), // Just placed
    estimatedDeliveryTime: new Date(Date.now() + 1800000).toISOString(), // + 30 mins
  },
];

let reviewsDatabase: Review[] = [
  {
    id: 'rev-1',
    foodId: 'spx-1',
    userName: 'Akash Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'The burrata is incredibly fresh and is comparable to gourmet woodfired pizzeria in Naples! Splendid tracking experience.',
    date: '2026-06-12',
    isVerified: true,
    likes: 24,
  },
  {
    id: 'rev-2',
    foodId: 'spx-5',
    userName: 'Karthik Rao',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Best Wagyu burger in town. Worth every dime. Delivered hot with dynamic crispy chips!',
    date: '2026-06-15',
    isVerified: true,
    likes: 18,
  },
  {
    id: 'rev-3',
    foodId: 'spx-2',
    userName: 'Deepa Patel',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    rating: 4,
    comment: 'Fragrant and distinct truffle scent. The mushroom slices were tender and juicy. Loved the minimal card packaging style!',
    date: '2026-06-18',
    isVerified: true,
    likes: 12,
  },
];

// ---------------- SERVER API ROUTES ----------------

// Get profile details
app.get('/api/profile', (req: Request, res: Response) => {
  res.json({ profile: userProfile, addresses: userAddresses });
});

// Update profile details
app.put('/api/profile', (req: Request, res: Response) => {
  userProfile = { ...userProfile, ...req.body };
  res.json({ message: 'Profile updated successfully', profile: userProfile });
});

// Add address
app.post('/api/profile/address', (req: Request, res: Response) => {
  const newAddr: Address = {
    id: `addr-${Date.now()}`,
    isDefault: userAddresses.length === 0,
    ...req.body,
  };
  if (newAddr.isDefault) {
    userAddresses = userAddresses.map((a) => ({ ...a, isDefault: false }));
  }
  userAddresses.push(newAddr);
  res.json({ message: 'Address created successfully', addresses: userAddresses });
});

// Delete address
app.delete('/api/profile/address/:id', (req: Request, res: Response) => {
  userAddresses = userAddresses.filter((a) => a.id !== req.params.id);
  res.json({ message: 'Address deleted successfully', addresses: userAddresses });
});

// Get foods catalogue
app.get('/api/foods', (req: Request, res: Response) => {
  // Instruct client and CDNs to cache food records for 60 seconds (safe and extremely performant under peak traffic spikes)
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=30');
  res.json(itemsDatabase);
});

// Update single food (Admin function)
app.put('/api/admin/foods/:id', (req: Request, res: Response) => {
  const code = req.params.id;
  const idx = itemsDatabase.findIndex((f) => f.id === code);
  if (idx !== -1) {
    itemsDatabase[idx] = { ...itemsDatabase[idx], ...req.body };
    res.json({ success: true, item: itemsDatabase[idx] });
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// Create new food item (Admin function)
app.post('/api/admin/foods', (req: Request, res: Response) => {
  const food: any = {
    id: `spx-${itemsDatabase.length + 1}`,
    rating: 5.0,
    reviewCount: 1,
    ...req.body,
  };
  itemsDatabase.push(food);
  res.json({ success: true, item: food, listCount: itemsDatabase.length });
});

// Delete food item (Admin function)
app.delete('/api/admin/foods/:id', (req: Request, res: Response) => {
  itemsDatabase = itemsDatabase.filter((f) => f.id !== req.params.id);
  res.json({ success: true, listCount: itemsDatabase.length });
});

// Save client-placed order
app.post('/api/orders', (req: Request, res: Response) => {
  const { items, subtotal, discount, deliveryFee, tax, total, couponApplied, paymentMethod, deliveryAddress, deliveryNotes } = req.body;
  
  const formattedItems = items.map((it: any) => {
    const f = itemsDatabase.find((food) => food.id === it.foodId);
    return {
      foodId: it.foodId,
      quantity: it.quantity,
      priceAtOrder: f ? f.price : 400,
      nameAtOrder: f ? f.name : 'Gourmet Selection',
      selectedAddOns: it.selectedAddOns || [],
    };
  });

  const newOrder: Order = {
    id: `SPX-${Math.floor(10000 + Math.random() * 90000)}`,
    items: formattedItems,
    subtotal,
    discount,
    deliveryFee,
    tax,
    total,
    couponApplied,
    status: 'Order Placed',
    paymentMethod,
    paymentStatus: 'Paid',
    deliveryAddress: deliveryAddress || userAddresses[0],
    deliveryNotes,
    createdAt: new Date().toISOString(),
    estimatedDeliveryTime: new Date(Date.now() + 1800000).toISOString(),
  };

  ordersDatabase.unshift(newOrder);

  // Credit loyalty reward points
  const pointsEarned = Math.floor(total / 10);
  userProfile.loyaltyPoints += pointsEarned;
  if (userProfile.loyaltyPoints > 700) userProfile.loyaltyTier = 'Platinum';
  else if (userProfile.loyaltyPoints > 300) userProfile.loyaltyTier = 'Gold';

  res.json({ message: 'Order created successfully', order: newOrder });
});

// Get orders list
app.get('/api/orders', (req: Request, res: Response) => {
  res.json(ordersDatabase);
});

// Update order status (Admin / Real-time sim)
app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  const ord = ordersDatabase.find((o) => o.id === req.params.id);
  if (ord) {
    ord.status = req.body.status;
    res.json({ success: true, order: ord });
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// Get reviews
app.get('/api/reviews', (req: Request, res: Response) => {
  // Leverage micro-caching for reviews to ensure stability during peak traffic periods
  res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=15');
  res.json(reviewsDatabase);
});

// Submit review
app.post('/api/reviews', (req: Request, res: Response) => {
  const newRev: Review = {
    id: `rev-${Date.now()}`,
    foodId: req.body.foodId,
    userName: userProfile.name,
    userAvatar: userProfile.avatar,
    rating: req.body.rating || 5,
    comment: req.body.comment,
    date: new Date().toISOString().split('T')[0],
    isVerified: true,
    likes: 0,
    images: req.body.images || [],
  };
  reviewsDatabase.unshift(newRev);

  // Recalculate average rating of the target item
  const food = itemsDatabase.find((f) => f.id === req.body.foodId);
  if (food) {
    const totalRating = food.rating * food.reviewCount + newRev.rating;
    food.reviewCount += 1;
    food.rating = parseFloat((totalRating / food.reviewCount).toFixed(1));
  }

  res.json({ success: true, review: newRev, food });
});

// ---------------- GEMINI AI MEAL SUGGESTION ENGINE ----------------

app.post('/api/ai/suggest', async (req: Request, res: Response) => {
  const { mood, dietPreference, maxCalories, maxBudget } = req.body;

  if (!ai) {
    // Elegant fallback context showing exquisite recommended suggestions locally if API key is not yet set up
    const fallbackResults = itemsDatabase
      .filter((food) => {
        if (dietPreference === 'veg' && !food.tags.some(t => t.toLowerCase().includes('vegetarian') || t.toLowerCase() === 'veg')) return false;
        if (maxBudget && food.price > maxBudget) return false;
        if (maxCalories && food.calories > maxCalories) return false;
        return true;
      })
      .slice(0, 3)
      .map((f) => ({
        id: f.id,
        reasoning: `Selected because it perfectly fits your target profile and is rated highly (${f.rating}★).`,
      }));

    return res.json({
      recommendations: fallbackResults,
      chatReponse: `I've prepared three gourmet dishes suited for your preference! Meet ${fallbackResults[0] ? itemsDatabase.find(i => i.id === fallbackResults[0].id)?.name : 'our signature specials'}. (Note: Setup your GEMINI_API_KEY in Secrets for personalized AI Sommelier analytics).`,
    });
  }

  try {
    const listSnippet = itemsDatabase.map((f) => ({
      id: f.id,
      name: f.name,
      price: f.price,
      calories: f.calories,
      category: f.category,
      rating: f.rating,
      tags: f.tags,
    }));

    const systemPrompt = `You are the Chef Sommelier & AI Culinary Selector for "Spex" - a luxury enterprise-grade food ordering platform.
Your task is to analyze the user's current mood, calorie budget, cash threshold, and preferences to handpick the top 3-4 perfect dish recommendations from the Spex 100-food repository database.

You must respond exclusively in valid JSON format matching this schema:
{
  "recommendations": [
    {
      "id": "item-id (string e.g. spx-1)",
      "reasoning": "A highly descriptive, mouth-watering gourmet explanation of why this dish fits their specified mood and metrics (one beautiful sentence)"
    }
  ],
  "chatResponse": "A charming, elegant introductory review in elite food critic voice summarizing the pairing suggestion."
}

Available Foods Catalogue:
${JSON.stringify(listSnippet.slice(0, 60))}
`;

    const userInstructions = `The customer is feeling: "${mood || 'adventurous'}". 
Diet profile requested: "${dietPreference || 'any'}". 
Max calorie cap: ${maxCalories ? `${maxCalories} kcal` : 'unlimited'}. 
Max financial pocket budget: ${maxBudget ? `₹${maxBudget}` : 'unlimited'}.

Examine the catalog carefully, recommend only valid IDs, and return the perfect, luxury selection in the requested JSON structure. Keep description text sophisticated and brief.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: userInstructions,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  reasoning: { type: Type.STRING },
                },
                required: ['id', 'reasoning'],
              },
            },
            chatResponse: { type: Type.STRING },
          },
          required: ['recommendations', 'chatResponse'],
        },
      },
    });

    const parsedJson = JSON.parse(response.text || '{}');
    res.json(parsedJson);
  } catch (error: any) {
    console.error('Gemini Suggestion Error:', error);
    res.status(500).json({ error: 'Failed to query the Spex AI Chef', details: error.message });
  }
});

// Custom AI chat endpoint for customer inquiries
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { messages } = req.body; // Array of { role, content }

  if (!ai) {
    return res.json({
      text: "Spex Chef AI: Sizzle! I'm here. Add a GEMINI_API_KEY to start a live interactive dialogue with our culinary team.",
    });
  }

  try {
    const lastMsg = messages[messages.length - 1]?.content || 'Hello';
    const systemPrompt = `You are Chef Spex, the automated conversational steward of SPEX, the high-end international digital delivery lounge.
You are charming, knowledgeable, extremely polite, and treat customers with deep gourmet professionalism.
You can cross-reference the Spex catalog. 
Give brief, helpful, stylish responses. Recommend specific food items (e.g. "Margherita Royale (spx-1)", "Truffle Mushroom Pizza (spx-2)") if they ask for suggestions!`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: lastMsg,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    res.json({ text: response.text });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// ---------------- EXPRESS ASSET AND BUNDLE DELIVERY ----------------

async function initializeViteLayer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Spex Full-Stack Hub running securely on http://localhost:${PORT}`);
  });
}

initializeViteLayer();
