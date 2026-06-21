import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Plus, LayoutDashboard, PlusCircle, Trash, Edit, RefreshCw, BarChart2, DollarSign, ShoppingBag, Terminal } from 'lucide-react';
import { Order, FoodItem, OrderStatus } from '../types';

interface AdminDashboardProps {
  orders: Order[];
  foods: FoodItem[];
  reviews: any[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onAddFoodItem: (food: Omit<FoodItem, 'id' | 'isAvailable'> & { isAvailable: boolean }) => void;
  onDeleteFoodItem: (id: string) => void;
  onUpdateFoodItem: (id: string, updates: Partial<FoodItem>) => void;
}

const ALL_STATUSES: OrderStatus[] = [
  'Order Placed',
  'Confirmed',
  'Preparing',
  'Cooking',
  'Packed',
  'Out For Delivery',
  'Delivered'
];

export default function AdminDashboard({
  orders,
  foods,
  reviews,
  onUpdateOrderStatus,
  onAddFoodItem,
  onDeleteFoodItem,
  onUpdateFoodItem
}: AdminDashboardProps) {
  const [panel, setPanel] = useState<'orders' | 'menu' | 'stats'>('orders');

  // New food formulation state
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('250');
  const [category, setCategory] = useState<FoodItem['category']>('Pizza');
  const [desc, setDesc] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [calories, setCalories] = useState('350');
  const [prepTime, setPrepTime] = useState('20');

  const handleCreateFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !desc) return;
    onAddFoodItem({
      name,
      price: parseFloat(price),
      category,
      description: desc,
      image: imgUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      calories: parseInt(calories),
      prepTime: parseInt(prepTime),
      tags: ['chef-spec', 'fresh'],
      rating: 4.8,
      reviewCount: 1,
      isAvailable: true
    });
    // reset
    setName('');
    setPrice('250');
    setDesc('');
    setImgUrl('');
    setShowForm(false);
  };

  const salesTotal = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="bg-[#070707] py-16 sm:py-24 border-t border-neutral-900 select-none">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Visual Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0b0b0b] border border-neutral-855 rounded-2xl p-5 space-y-2">
            <span className="text-[10px] font-mono font-black uppercase text-neutral-500">outstanding trade sales</span>
            <div className="text-2xl font-black text-[#FFD166] font-mono">₹{salesTotal.toLocaleString()}</div>
          </div>
          <div className="bg-[#0b0b0b] border border-neutral-855 rounded-2xl p-5 space-y-2">
            <span className="text-[10px] font-mono font-black uppercase text-neutral-500">thermal courier deliveries</span>
            <div className="text-2xl font-black text-white font-mono">{orders.length} dispatches</div>
          </div>
          <div className="bg-[#0b0b0b] border border-neutral-855 rounded-2xl p-5 space-y-2">
            <span className="text-[10px] font-mono font-black uppercase text-neutral-500">curated catalog scale</span>
            <div className="text-2xl font-black text-[#FF5A1F] font-mono">{foods.length} items</div>
          </div>
        </div>

        {/* Toolbar tabs */}
        <div className="flex border-b border-neutral-900 text-xs font-black uppercase tracking-wider font-mono gap-4">
          <button
            onClick={() => setPanel('orders')}
            className={`pb-3 border-b-2 px-2 transition cursor-pointer flex items-center gap-2 ${
              panel === 'orders' ? 'border-[#FF5A1F] text-white' : 'border-transparent text-neutral-500'
            }`}
          >
            <Terminal className="h-4 w-4" /> Active Control Room
          </button>
          <button
            onClick={() => setPanel('menu')}
            className={`pb-3 border-b-2 px-2 transition cursor-pointer flex items-center gap-2 ${
              panel === 'menu' ? 'border-[#FF5A1F] text-white' : 'border-transparent text-neutral-500'
            }`}
          >
            <Settings className="h-4 w-4" /> Menu Card Manager
          </button>
        </div>

        <div>
          {panel === 'orders' && (
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((ord) => (
                  <div key={ord.id} className="bg-[#0b0b0b] border border-neutral-855 rounded-2xl p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-neutral-900 pb-3 gap-3">
                      <div>
                        <strong>Order {ord.id}</strong>
                        <p className="text-[11px] text-neutral-400 mt-1">Placed on {new Date(ord.createdAt).toLocaleTimeString()} • total ₹{ord.total}</p>
                      </div>

                      {/* Status selectors */}
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-neutral-500">Status:</span>
                        <select
                          value={ord.status}
                          onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="bg-black border border-neutral-800 text-neutral-300 rounded-xl px-3 py-2 focus:outline-none"
                        >
                          {ALL_STATUSES.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="text-xs text-neutral-300">
                      <strong>Deliverables:</strong> {ord.items.map(i => `${i.nameAtOrder} (x${i.quantity})`).join(', ')}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center text-neutral-500 text-xs">
                  No dispatches logged in this terminal session.
                </div>
              )}
            </div>
          )}

          {panel === 'menu' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase font-bold">ADDITIONAL ENTRÉES</span>
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-[#FF5A1F] text-white text-[10px] font-black uppercase px-3.5 py-2 rounded-xl flex items-center gap-1 cursor-pointer active:scale-95 transition"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Entrée Card
                  </button>
                )}
              </div>

              {/* Form panel */}
              <AnimatePresence>
                {showForm && (
                  <motion.form
                    onSubmit={handleCreateFood}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-[#0c0c0c] border border-neutral-855 rounded-3xl p-6 space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                      <div className="space-y-1.5Col">
                        <label className="text-neutral-400 font-bold">Title Name</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-neutral-850 bg-black text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-neutral-400 font-bold">Price Card (₹)</label>
                        <input
                          type="number"
                          required
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-neutral-850 bg-black text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                      <div>
                        <label className="text-neutral-400 font-bold">Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value as any)}
                          className="w-full p-2.5 rounded-xl border border-neutral-850 bg-black text-white"
                        >
                          {['Pizza', 'Burger', 'Biryani', 'Chinese', 'North Indian', 'South Indian', 'Desserts', 'Beverages', 'Snacks', 'Combo'].map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-neutral-400 font-bold">Calories</label>
                        <input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} className="w-full p-2.5 rounded-xl border border-neutral-850 bg-black text-white" />
                      </div>
                      <div>
                        <label className="text-neutral-400 font-bold">Prep Minutes</label>
                        <input type="number" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} className="w-full p-2.5 rounded-xl border border-neutral-850 bg-black text-white" />
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="text-neutral-400 font-bold">Chef description specs</label>
                      <textarea required value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full p-2.5 rounded-xl border border-neutral-850 bg-black text-white h-16 resize-none" />
                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="text-neutral-400 font-bold">Image Endpoint URL</label>
                      <input type="url" value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} className="w-full p-2.5 rounded-xl border border-neutral-850 bg-black text-white" />
                    </div>

                    <button type="submit" className="w-full bg-[#FF5A1F] text-white text-xs font-heavy py-3 rounded-xl uppercase">Publish Menu Platter</button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Items grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {foods.map((food) => (
                  <div key={food.id} className="bg-[#0b0b0b] border border-neutral-855 rounded-2xl p-4 flex gap-4 items-center justify-between text-xs">
                    <div className="flex gap-4 items-center min-w-0">
                      <img src={food.image} alt={food.name} className="h-11 w-11 rounded-lg object-cover shrink-0 pointer-events-none select-none bg-neutral-900" />
                      <div className="truncate min-w-0">
                        <strong className="text-white truncate block">{food.name}</strong>
                        <span className="text-neutral-500 font-mono block mt-0.5">₹{food.price} • {food.category}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteFoodItem(food.id)}
                      className="text-neutral-60 cursor-pointer text-neutral-500 hover:text-rose-500 px-2 py-2"
                      title="De-register entrée"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
