import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Order, FoodItem, Review, OrderStatus } from '../types';
import { ChefHat, LineChart, Package, Users, DollarSign, Edit3, ClipboardList, PlusCircle, CheckCircle, Trash2, ArrowRight } from 'lucide-react';

interface AdminDashboardProps {
  orders: Order[];
  foods: FoodItem[];
  reviews: Review[];
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void;
  onAddFoodItem: (food: Omit<FoodItem, 'id' | 'rating' | 'reviewCount'>) => void;
  onDeleteFoodItem: (id: string) => void;
  onUpdateFoodItem: (id: string, updates: Partial<FoodItem>) => void;
}

export default function AdminDashboard({
  orders,
  foods,
  reviews,
  onUpdateOrderStatus,
  onAddFoodItem,
  onDeleteFoodItem,
  onUpdateFoodItem,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'menu' | 'reviews'>('overview');

  // New Food Item Form States
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState<number>(350);
  const [newCategory, setNewCategory] = useState<FoodItem['category']>('Pizza');
  const [newPrepTime, setNewPrepTime] = useState<number>(20);
  const [newCalories, setNewCalories] = useState<number>(450);
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80');
  const [newTagsStr, setNewTagsStr] = useState('Premium, Sourdough');

  // Compute metrics
  const totalRevenue = orders.reduce((acc, current) => acc + current.total, 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'Delivered').length;
  const bestSellerCount = foods.filter((f) => f.isBestSeller).length;
  const averageRating = foods.length > 0
    ? parseFloat((foods.reduce((acc, item) => acc + item.rating, 0) / foods.length).toFixed(1))
    : 4.8;

  const handleCreateFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() === '') return;

    onAddFoodItem({
      name: newName,
      description: newDesc,
      price: newPrice,
      category: newCategory,
      prepTime: newPrepTime,
      calories: newCalories,
      image: newImage,
      tags: newTagsStr.split(',').map((s) => s.trim()),
      isAvailable: true,
    });

    // Reset fields
    setNewName('');
    setNewDesc('');
    setNewPrice(350);
    setNewCategory('Pizza');
    setNewPrepTime(20);
    setNewCalories(450);
    setNewImage('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80');
    setNewTagsStr('Premium, Sourdough');
    alert('Success: Gourmet creation registered into central Spex database.');
  };

  return (
    <div className="bg-[#0d0d0d] py-16 border-t border-neutral-900 text-white" id="enterprise-admin-hub">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-[#FFD166] uppercase tracking-[0.2em] font-mono">Operations Lounge</span>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1">Enterprise Admin Control Panel</h1>
            <p className="text-xs text-neutral-400 mt-1">Settle dispatch workflows, register recipes, and oversee revenue logs.</p>
          </div>

          {/* Tab belt */}
          <div className="flex rounded-xl bg-neutral-900 border border-neutral-800 p-1 self-start md:self-auto overflow-x-auto max-w-full">
            {[
              { id: 'overview', label: 'Monitor' },
              { id: 'orders', label: `Dispatch (Active ${activeOrdersCount})` },
              { id: 'menu', label: 'Recipe Vault' },
              { id: 'reviews', label: 'Audit Reviews' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold cursor-pointer transition ${
                  activeTab === tab.id ? 'bg-[#FF5A1F] text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab content stats dashboard */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats matrix card grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              
              <div className="rounded-2xl border border-neutral-800 bg-[#171717] p-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase font-mono tracking-wider">Gross Revenue</p>
                  <p className="text-2xl font-black mt-1">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-green-500">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-[#171717] p-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase font-mono tracking-wider">Total Orders</p>
                  <p className="text-2xl font-black mt-1">{orders.length}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF5A1F]/10 text-[#FF5A1F]">
                  <ClipboardList className="h-5 w-5" />
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-[#171717] p-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase font-mono tracking-wider">Vault Registry</p>
                  <p className="text-2xl font-black mt-1">{foods.length} Recipes</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                  <Package className="h-5 w-5" />
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-[#171717] p-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase font-mono tracking-wider">Gourmet Rating Avg</p>
                  <p className="text-2xl font-black mt-1">{averageRating} ★</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFD166]/10 text-[#FFD166]">
                  <ChefHat className="h-5 w-5" />
                </div>
              </div>

            </div>

            {/* Split row charts analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-8 bg-[#171717] border border-neutral-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-bold text-[#FFD166] uppercase font-mono tracking-wider pb-2 border-b border-neutral-800">
                  Daily Sales Trend Analysis
                </h3>
                <div className="h-52 flex items-end justify-between pt-6 px-4">
                  {[23, 45, 67, 34, 78, 90, 110, 85, 120, 140, 160, totalRevenue > 0 ? 110 : 34].map((height, i) => (
                    <div key={i} className="flex flex-col items-center w-[6%] group">
                      <div className="text-[9px] text-[#FF5A1F] opacity-0 group-hover:opacity-100 mb-1 font-mono transition duration-200">
                        {height * 10}
                      </div>
                      <div
                        className="w-full bg-gradient-to-t from-[#FF5A1F] to-[#FF8C42] rounded-t-md hover:brightness-110 transition-all duration-300 shadow-[0_4px_10px_rgba(255,90,31,0.15)]"
                        style={{ height: `${height}px` }}
                      />
                      <span className="text-[8px] text-neutral-500 mt-2 font-mono">D{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 bg-[#171717] border border-neutral-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-bold text-neutral-400 uppercase font-mono tracking-wider">Category Revenue Weights</h3>
                <div className="space-y-3 pt-2 text-xs">
                  {[
                    { label: 'Wood-fired Pizza', percentage: 40, color: 'bg-[#FF5A1F]' },
                    { label: 'Burgers & Fries', percentage: 25, color: 'bg-[#FF8C42]' },
                    { label: 'Indian Imperial', percentage: 20, color: 'bg-[#FFD166]' },
                    { label: 'Beverage & Chillers', percentage: 15, color: 'bg-green-500' },
                  ].map((cat) => (
                    <div key={cat.label} className="space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span>{cat.label}</span>
                        <span className="text-neutral-400">{cat.percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                        <div className={`h-full ${cat.color}`} style={{ width: `${cat.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Dispatch Orders Monitor tab content */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#FFD166] uppercase font-mono tracking-wider mb-2">
              Dispatch Flow Tracker — Active Operations Mode
            </h3>

            {orders.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">No active orders found.</div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-neutral-800">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-[#171717] text-neutral-400 font-mono uppercase tracking-wider border-b border-neutral-800">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Items Summary</th>
                      <th className="p-4">Order Value</th>
                      <th className="p-4">Active Stage</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900 bg-[#0d0d0d]">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-neutral-900/40">
                        <td className="p-4 font-bold text-white font-mono">{o.id}</td>
                        <td className="p-4 font-sans max-w-[140px] truncate">
                          <p className="font-semibold text-white">Sachin Pal</p>
                          <p className="text-[10px] text-neutral-500">sachinpal777999@gmail.com</p>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {o.items.map((it) => (
                              <span key={it.foodId} className="rounded bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 text-[9px] text-[#FF8C42] font-mono font-bold">
                                x{it.quantity} {it.nameAtOrder}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-white font-mono">₹{o.total}</td>
                        <td className="p-4">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            o.status === 'Delivered'
                              ? 'bg-green-600/10 text-green-500'
                              : 'bg-orange-600/10 text-orange-500'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {/* Drops modifying selector */}
                          <select
                            value={o.status}
                            onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                            className="rounded bg-neutral-900 border border-neutral-800 px-2 py-1 text-xs text-white focus:outline-none"
                          >
                            <option value="Order Placed">Placed</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Cooking">Cooking</option>
                            <option value="Packed">Packed</option>
                            <option value="Out For Delivery">Out For Delivery</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Recipe Vault tab content */}
        {activeTab === 'menu' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left side form to register new recipes */}
            <div className="lg:col-span-5 bg-[#171717] border border-neutral-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold text-[#FFD166] uppercase font-mono tracking-wider pb-2 border-b border-neutral-800">
                Authorize New Recipe
              </h3>

              <form onSubmit={handleCreateFood} className="space-y-3 text-xs" id="register-recipe-form">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 font-mono">1. Recipe Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Wagyu Truffle Steak Burger"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 font-mono">2. Culinary Narrative</label>
                  <textarea
                    required
                    placeholder="Slow seared Wagyu ribeye layered with gold flakes and melted taleggio cheese..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-white h-16"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 font-mono">3. Category</label>
                    <select
                      value={newCategory}
                      onChange={(e: any) => setNewCategory(e.target.value)}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-white"
                    >
                      <option value="Pizza">Pizza</option>
                      <option value="Burger">Burger</option>
                      <option value="Biryani">Biryani</option>
                      <option value="Chinese">Chinese</option>
                      <option value="North Indian">North Indian</option>
                      <option value="South Indian">South Indian</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Snacks">Snacks</option>
                      <option value="Combo">Combo</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 font-mono">4. Price (₹ INR)</label>
                    <input
                      type="number"
                      required
                      min="10"
                      value={newPrice}
                      onChange={(e) => setNewPrice(parseInt(e.target.value))}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 font-mono">5. Prep Time (mins)</label>
                    <input
                      type="number"
                      required
                      value={newPrepTime}
                      onChange={(e) => setNewPrepTime(parseInt(e.target.value))}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 font-mono">6. Energy Count (Kcal)</label>
                    <input
                      type="number"
                      required
                      value={newCalories}
                      onChange={(e) => setNewCalories(parseInt(e.target.value))}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 font-mono">7. HD Unsplash Image URL</label>
                  <input
                    type="text"
                    required
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 font-mono">8. Tags (Comma-separated)</label>
                  <input
                    type="text"
                    required
                    value={newTagsStr}
                    onChange={(e) => setNewTagsStr(e.target.value)}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#FF5A1F] py-3 text-sm font-bold text-white hover:bg-[#FF8C42] cursor-pointer"
                >
                  Register Sourced Recipe
                </button>
              </form>
            </div>

            {/* Right side list of Recipe database & deletion modifers */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-xs font-bold text-neutral-400 uppercase font-mono tracking-wider">
                Active Recipe Portfolio ({foods.length} items registered)
              </h3>

              <div className="space-y-2 max-h-[550px] overflow-y-auto pr-2">
                {foods.map((food) => (
                  <div
                    key={food.id}
                    className="rounded-xl border border-neutral-800 bg-[#0d0d0d] p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img src={food.image} alt={food.name} className="h-11 w-11 object-cover rounded" />
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">{food.name}</h4>
                        <div className="flex gap-1.5 text-[10px] text-neutral-500 mt-0.5 font-mono">
                          <span>₹{food.price}</span> | <span>{food.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 items-center">
                      {/* Availability toggle */}
                      <button
                        onClick={() => onUpdateFoodItem(food.id, { isAvailable: !food.isAvailable })}
                        className={`rounded px-2.5 py-1 text-[10px] font-bold cursor-pointer ${
                          food.isAvailable ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {food.isAvailable ? 'Available' : 'Sold Out'}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          if (confirm(`Confirm Recipe deletion for: ${food.name}?`)) {
                            onDeleteFoodItem(food.id);
                          }
                        }}
                        className="rounded p-1.5 hover:bg-neutral-900 text-neutral-500 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Audit Reviews tab content */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase font-mono tracking-wider mb-2">
              Customer Feedback Analytics Center ({reviews.length} audits catalogued)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => {
                const targetRecipe = foods.find((f) => f.id === rev.foodId);

                return (
                  <div key={rev.id} className="rounded-2xl border border-neutral-800 bg-[#0d0d0d] p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <img src={rev.userAvatar} alt={rev.userName} className="h-9 w-9 object-cover rounded-full border border-neutral-800" />
                        <div>
                          <h4 className="text-xs font-bold text-white font-sans">{rev.userName}</h4>
                          <span className="text-[10px] text-neutral-500 font-mono mt-0.5 block">{rev.date}</span>
                        </div>
                      </div>

                      <span className="text-[#FFD166] text-xs font-bold font-mono">{'★'.repeat(rev.rating)}</span>
                    </div>

                    {/* Appended reference */}
                    {targetRecipe && (
                      <div className="rounded-lg bg-[#171717] px-2.5 py-1.5 border border-neutral-800 text-[10px] text-neutral-400 flex items-center justify-between">
                        <span>Feedback on: <strong className="text-white font-sans">{targetRecipe.name}</strong></span>
                        <span className="text-[#FF5A1F] font-semibold">{targetRecipe.category}</span>
                      </div>
                    )}

                    <p className="text-xs text-neutral-300 font-sans leading-relaxed leading-relaxed italic">
                      "{rev.comment}"
                    </p>

                    <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500 font-mono uppercase">
                      <span className="text-[#22C55E]">✓ Verified purchaser feedback</span>
                      <span className="flex items-center gap-1">👍 {rev.likes} Likes received</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
