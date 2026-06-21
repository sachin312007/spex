import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles, Star, ShoppingBag, Heart, Loader2 } from 'lucide-react';
import { FoodItem } from '../types';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  foods: FoodItem[];
  addToCart: (foodId: string, add?: boolean) => void;
  wishlist: string[];
  toggleWishlist: (foodId: string) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChatModal({
  isOpen,
  onClose,
  foods,
  addToCart,
  wishlist,
  toggleWishlist
}: AIChatModalProps) {
  const [flavorTab, setFlavorTab] = useState<'chat' | 'suggest'>('chat');
  
  // Conversational Chat state
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Salutations! I am Chef Spex, your personal AI sommelier. Seeking a mood-altering dish or curious about secret pairings? Converse with me below!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Suggest state
  const [mood, setMood] = useState('celebratory');
  const [diet, setDiet] = useState<'any' | 'veg'>('any');
  const [calories, setCalories] = useState('');
  const [budget, setBudget] = useState('');
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [suggestResponse, setSuggestResponse] = useState<string>('');
  const [recommendedFoods, setRecommendedFoods] = useState<{ food: FoodItem; reasoning: string }[]>([]);

  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatLoading]);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userText = chatInput.trim();
    setChatInput('');
    const updatedMessages = [...messages, { role: 'user' as const, content: userText }];
    setMessages(updatedMessages);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.text || "I apologize, my creative kitchen burners are heating up. Let's try again in a few seconds."
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Under extreme thermal conditions, I temporarily lost contact with the servers. Please try again!"
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleFetchSuggestions = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuggestLoading(true);
    setRecommendedFoods([]);
    setSuggestResponse('');

    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood,
          dietPreference: diet,
          maxCalories: calories ? parseInt(calories) : undefined,
          maxBudget: budget ? parseInt(budget) : undefined,
        }),
      });
      const data = await res.json();
      
      setSuggestResponse(data.chatResponse || data.chatReponse || '');
      
      if (data.recommendations && Array.isArray(data.recommendations)) {
        const matches = data.recommendations.map((rec: any) => {
          const f = foods.find(food => food.id === rec.id);
          if (f) return { food: f, reasoning: rec.reasoning };
          return null;
        }).filter(Boolean) as { food: FoodItem; reasoning: string }[];
        
        setRecommendedFoods(matches);
      }
    } catch (err) {
      console.error(err);
      setSuggestResponse("Chef Suggestion Failed. Double check network stability or credentials.");
    } finally {
      setIsSuggestLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 select-none">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#070707]/90 backdrop-blur-md cursor-pointer"
          />

          {/* Chat modal container box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative bg-[#0d0d0d] border border-neutral-855 rounded-[30px] p-6 w-full max-w-2xl h-[550px] flex flex-col justify-between overflow-hidden shadow-2xl shadow-black"
          >
            {/* Header bar panel */}
            <div className="flex items-center justify-between border-b border-neutral-900 pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-5 w-5 text-[#FF5A1F] animate-pulse" />
                <div>
                  <h2 className="text-sm font-black text-white uppercase tracking-wider font-sans">Spex Sommelier Ward</h2>
                  <p className="text-[9.5px] font-mono text-neutral-500 uppercase tracking-wider mt-0.5">Dual-mode generative pairing studio</p>
                </div>
              </div>

              {/* Tab togglers */}
              <div className="flex bg-black/60 border border-neutral-900 rounded-xl p-1 gap-1 text-[9px] font-black uppercase font-mono tracking-wider ml-auto mr-4">
                <button
                  onClick={() => setFlavorTab('chat')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    flavorTab === 'chat' ? 'bg-[#FF5A1F] text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Converse
                </button>
                <button
                  onClick={() => setFlavorTab('suggest')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    flavorTab === 'suggest' ? 'bg-[#FF5A1F] text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Wizard
                </button>
              </div>

              <button
                onClick={onClose}
                className="h-8 w-8 rounded-lg border border-neutral-850 flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-950 transition cursor-pointer active:scale-95"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Main Area */}
            <div className="flex-1 overflow-y-auto scrollbar-none py-4 min-h-0">
              
              {flavorTab === 'chat' ? (
                /* CHAT CONVERSATION MODE */
                <div className="space-y-4">
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`p-4 rounded-[22px] max-w-[80vw] sm:max-w-md text-xs leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-[#FF5A1F] text-white rounded-tr-none'
                          : 'bg-black border border-neutral-900 text-neutral-200 rounded-tl-none'
                      }`}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="p-4 bg-black border border-neutral-900 rounded-[22px] rounded-tl-none flex items-center gap-1.5 text-xs text-[#FF5A1F] font-mono">
                        <Loader2 className="h-4.5 w-4.5 animate-spin" />
                        <span>Platter analyst is formulating...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </div>
              ) : (
                /* SUGGEST REC WIZARD MODE */
                <div className="space-y-5">
                  <form onSubmit={handleFetchSuggestions} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[#070707] p-4 rounded-2xl border border-neutral-900 shrink-0">
                    <div className="text-[10px] uppercase font-mono font-bold space-y-1">
                      <span className="text-neutral-500">Current Mood</span>
                      <select
                        value={mood}
                        onChange={(e) => setMood(e.target.value)}
                        className="w-full bg-black border border-neutral-850 text-neutral-300 rounded-lg p-2 focus:outline-none"
                      >
                        <option value="celebratory">Celebratory</option>
                        <option value="spicy craving">Spicy Craving</option>
                        <option value="dieting organic">Dieting Organic</option>
                        <option value="comfort meal">Comfort Meal</option>
                      </select>
                    </div>

                    <div className="text-[10px] uppercase font-mono font-bold space-y-1">
                      <span className="text-neutral-500">Dietary Profile</span>
                      <select
                        value={diet}
                        onChange={(e) => setDiet(e.target.value as any)}
                        className="w-full bg-black border border-neutral-850 text-neutral-300 rounded-lg p-2 focus:outline-none"
                      >
                        <option value="any">Universal (No Limit)</option>
                        <option value="veg">Pure Herb / Veg</option>
                      </select>
                    </div>

                    <div className="text-[10px] uppercase font-mono font-bold space-y-1">
                      <span className="text-neutral-500">Max Calories</span>
                      <input
                        type="number"
                        placeholder="e.g. 500"
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                        className="w-full bg-black border border-neutral-850 text-neutral-300 rounded-lg p-1.5 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSuggestLoading}
                      className="w-full h-9 self-end bg-[#FF5A1F] hover:bg-[#FF8C42] text-white text-[10px] font-black uppercase tracking-wider rounded-lg flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                    >
                      {isSuggestLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Suggest'}
                    </button>
                  </form>

                  <AnimatePresence>
                    {suggestResponse && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 bg-black border border-neutral-900 rounded-2xl text-xs text-neutral-300 leading-relaxed font-sans"
                      >
                        🔮 <strong>Feedback:</strong> {suggestResponse}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Recommendation list results */}
                  <div className="space-y-3">
                    {recommendedFoods.map(({ food, reasoning }) => {
                      const isInWishlist = wishlist.includes(food.id);
                      return (
                        <div
                          key={food.id}
                          className="bg-[#0b0b0b] border border-neutral-855 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between"
                        >
                          <div className="flex gap-4 items-center shrink min-w-0">
                            <img src={food.image} alt={food.name} className="h-11 w-11 rounded-lg object-cover shrink-0 pointer-events-none select-none bg-neutral-900" />
                            <div className="truncate min-w-0 font-sans text-xs">
                              <h4 className="font-extrabold text-white text-xs truncate">{food.name}</h4>
                              <p className="text-[10px] text-[#FF5A1F] font-mono font-black mt-0.5">₹{food.price}</p>
                              <p className="text-[10px] text-neutral-400 mt-1 line-clamp-1 leading-normal italic">"{reasoning}"</p>
                            </div>
                          </div>

                          <div className="flex gap-2 shrink-0 self-end sm:self-center font-mono">
                            <button
                              onClick={() => toggleWishlist(food.id)}
                              className={`h-8 w-8 rounded-xl border border-neutral-850 hover:bg-neutral-950 flex items-center justify-center cursor-pointer ${
                                isInWishlist ? 'text-rose-500' : 'text-neutral-500'
                              }`}
                            >
                              <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
                            </button>
                            <button
                              onClick={() => addToCart(food.id, true)}
                              className="bg-white hover:bg-[#FF5A1F] text-black hover:text-white px-3.5 py-1.5 rounded-xl text-[9.5px] font-black uppercase tracking-wider transition active:scale-95 cursor-pointer"
                            >
                              Add Cart
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* Chat bottom raw input panel if conver state */}
            {flavorTab === 'chat' && (
              <form onSubmit={handleSendChat} className="flex gap-2 border-t border-neutral-900 pt-3 shrink-0">
                <input
                  type="text"
                  placeholder="Converse with Chef Spex, ask for specific food suggestions..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-850 bg-black text-white focus:outline-none focus:border-[#FF5A1F]"
                />
                <button
                  type="submit"
                  className="bg-[#FF5A1F] hover:bg-[#FF8C42] text-white h-10 w-10 flex items-center justify-center rounded-xl cursor-pointer active:scale-95 transition shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
