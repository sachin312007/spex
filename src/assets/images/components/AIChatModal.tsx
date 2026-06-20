import React, { useState, useEffect } from 'react';
import { X, Sparkles, Send, Mic, MicOff, Star, Flame, Clock, Heart, ShoppingBag, SendHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FoodItem } from '../types';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  foods: FoodItem[];
  addToCart: (foodId: string, announce?: boolean) => void;
  wishlist: string[];
  toggleWishlist: (foodId: string) => void;
}

export default function AIChatModal({
  isOpen,
  onClose,
  foods,
  addToCart,
  wishlist,
  toggleWishlist,
}: AIChatModalProps) {
  // Tabs
  const [activeTab, setActiveTab] = useState<'match' | 'chat'>('match');

  // Multi-variable dials for recommendation form
  const [mood, setMood] = useState('celebrating a major win');
  const [diet, setDiet] = useState<'any' | 'veg'>('any');
  const [maxBudget, setMaxBudget] = useState<number>(600);
  const [maxCals, setMaxCals] = useState<number>(750);
  
  // Suggestion Result States
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [matchedResults, setMatchedResults] = useState<{ id: string; reasoning: string }[]>([]);
  const [aiCritique, setAiCritique] = useState('');

  // Interactive Live Chatbot states
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: "Salutations, Connoisseur! I am Chef Spex. Share your mood, diet restrictions, or appetite desires, and I will summon the perfect creation for your banquet." },
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Web Speech API Voice search variables
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recObj = new SpeechRecognition();
        recObj.continuous = false;
        recObj.interimResults = false;
        recObj.lang = 'en-US';

        recObj.onstart = () => {
          setIsListening(true);
        };

        recObj.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (activeTab === 'chat') {
            setChatInput(transcript);
          } else {
            setMood(transcript);
          }
          setIsListening(false);
        };

        recObj.onerror = () => {
          setIsListening(false);
        };

        recObj.onend = () => {
          setIsListening(false);
        };

        setRecognition(recObj);
      }
    }
  }, [activeTab]);

  const toggleVoiceListen = () => {
    if (!recognition) {
      alert('Native Web Speech Recognition is not fully supported in this iframe/browser.');
      return;
    }
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  // Recommendations builder calling API
  const handleGetRecommendations = async () => {
    setLoadingSuggestions(true);
    setMatchedResults([]);
    setAiCritique('');

    try {
      const response = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood,
          dietPreference: diet,
          maxBudget,
          maxCalories: maxCals,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch from Spex Sommelier API');
      const data = await response.json();

      setMatchedResults(data.recommendations || []);
      setAiCritique(data.chatResponse || '');
    } catch (error) {
      console.error(error);
      setAiCritique("I had a small hiccup cooking up recommendations, but check out these chef's specials from our legacy menu panel!");
      // Settle fallback structures
      setMatchedResults([
        { id: 'spx-1', reasoning: 'Italian margherita sourdough matches refined requirements.' },
        { id: 'spx-2', reasoning: 'Earthy porcini and truffle pizza fits luxurious comfort zones.' },
      ]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Conversational Chat calling backend API
  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (chatInput.trim() === '' || chatLoading) return;

    const userText = chatInput;
    setChatInput('');
    const updatedMsgs = [...chatMessages, { role: 'user' as const, text: userText }];
    setChatMessages(updatedMsgs);
    setChatLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMsgs.map((m) => ({
            role: m.role,
            content: m.text,
          })),
        }),
      });

      if (!response.ok) throw new Error('Chatbot connection error');
      const data = await response.json();

      setChatMessages((prev) => [...prev, { role: 'assistant', text: data.text }]);
    } catch (err) {
      console.error(err);
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', text: "Apologies, Connoisseur. Our cellular link to the cloud is busy. Let's try once more." },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-[#0d0d0d]/90 backdrop-blur-sm cursor-pointer" />

      {/* Sheet component */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-3xl border border-neutral-800 bg-[#171717] flex flex-col z-50 text-white shadow-2xl"
        id="ai-sommelier-pairing-modal"
      >
        {/* Header toolbar banner */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FF5A1F] to-[#FF8C42] shadow-md shadow-[#FF5A1F]/15">
              <Sparkles className="h-4.5 w-4.5 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold font-sans flex items-center gap-1.5">
                Spex Chef AI Selection Suite
              </h2>
              <p className="text-[10px] text-neutral-400 font-sans mt-0.5">Powered by server-side Gemini 3.5 models to find matching meals.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tab switch knobs */}
            <div className="flex rounded-lg bg-neutral-900 border border-neutral-800 p-0.5 text-xs text-neutral-400 font-bold">
              <button
                onClick={() => setActiveTab('match')}
                className={`rounded px-3 py-1.5 transition ${activeTab === 'match' ? 'bg-[#FF5A1F] text-white' : 'hover:text-white'}`}
              >
                Gourmet AI Matchmaker
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`rounded px-3 py-1.5 transition ${activeTab === 'chat' ? 'bg-[#FF5A1F] text-white' : 'hover:text-white'}`}
              >
                Converse with Chef
              </button>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-800 hover:text-white transition cursor-pointer"
              id="close-ai-modal-btn"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal scrolling context area */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          
          {/* Matchmaker tab content */}
          {activeTab === 'match' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-full">
              
              {/* Left Column: Preset Dial Selection Form */}
              <div className="md:col-span-5 space-y-5 border-r border-neutral-800/60 pr-0 md:pr-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase font-mono tracking-wider">
                    How do you feel today?
                  </span>
                  <div className="relative">
                    <input
                      type="text"
                      value={mood}
                      onChange={(e) => setMood(e.target.value)}
                      placeholder="e.g. adventurus and celebrating a milestone"
                      className="w-full text-xs rounded-xl border border-neutral-800 bg-[#0d0d0d] px-4 py-3 text-white focus:outline-none focus:border-[#FF5A1F] pr-10"
                    />
                    <button
                      type="button"
                      onClick={toggleVoiceListen}
                      className={`absolute right-3 top-3 transition cursor-pointer ${
                        isListening ? 'text-red-500 animate-bounce' : 'text-neutral-500 hover:text-white'
                      }`}
                      title="Activate microphone speech search"
                    >
                      {isListening ? <MicOff className="h-4.5 w-4.5" /> : <Mic className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase font-mono tracking-wider block">
                    Diet Choice Sourcing
                  </span>
                  <div className="flex bg-[#0d0d0d] rounded-xl p-1 border border-neutral-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setDiet('any')}
                      className={`flex-1 rounded-lg py-1.5 font-bold transition ${
                        diet === 'any' ? 'bg-[#FF5A1F] text-white' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Inclusive (All Dishes)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDiet('veg')}
                      className={`flex-1 rounded-lg py-1.5 font-bold transition ${
                        diet === 'veg' ? 'bg-green-600 text-white' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      100% Pure Veg
                    </button>
                  </div>
                </div>

                {/* Calorie Dial Range value */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-neutral-500 font-mono">
                    <span className="uppercase">Calorie threshold</span>
                    <span className="text-[#FFD166]">{maxCals} Kcal Limit</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="1200"
                    step="50"
                    value={maxCals}
                    onChange={(e) => setMaxCals(parseInt(e.target.value))}
                    className="w-full accent-[#FFD166] bg-neutral-800 h-1 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Budget Limit slider */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-neutral-500 font-mono">
                    <span className="uppercase">Limit Cost</span>
                    <span className="text-white">Under ₹{maxBudget}</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="1000"
                    step="50"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(parseInt(e.target.value))}
                    className="w-full accent-[#FF5A1F] bg-neutral-800 h-1 rounded-lg cursor-pointer"
                  />
                </div>

                <button
                  onClick={handleGetRecommendations}
                  disabled={loadingSuggestions}
                  className="w-full rounded-xl bg-gradient-to-r from-[#FF5A1F] to-[#FF8C42] py-4 text-xs font-bold text-white hover:brightness-110 shadow-lg shadow-[#FF5A1F]/10 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span>{loadingSuggestions ? 'Summoning AI Chef recommendations...' : 'Generate Sommelier Match'}</span>
                </button>
              </div>

              {/* Right Column: AI Suggestion Display Results */}
              <div className="md:col-span-7 flex flex-col justify-between h-full space-y-4">
                {loadingSuggestions ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="h-8 w-8 rounded-full border-2 border-dashed border-[#FF8C42] animate-spin" />
                    <p className="text-xs text-neutral-400 font-mono uppercase tracking-widest animate-pulse">Querying culinary models...</p>
                  </div>
                ) : matchedResults.length > 0 ? (
                  <div className="space-y-5 flex-1 flex flex-col justify-between">
                    {/* Introductory critique narrative */}
                    {aiCritique && (
                      <div className="rounded-2xl bg-neutral-900 border border-neutral-850 p-4 text-xs italic text-neutral-300 leading-relaxed font-sans">
                        "{aiCritique}"
                      </div>
                    )}

                    {/* Matched card list */}
                    <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                      {matchedResults.map((rec) => {
                        const f = foods.find((food) => food.id === rec.id);
                        if (!f) return null;

                        const isInWish = wishlist.includes(f.id);

                        return (
                          <div
                            key={rec.id}
                            className="rounded-xl border border-neutral-800 bg-[#0d0d0d] p-3 flex gap-3 items-center justify-between hover:border-[#FF5A1F]/40 transition"
                          >
                            <div className="flex items-center gap-3">
                              <img src={f.image} alt={f.name} className="h-12 w-12 object-cover rounded-lg shrink-0" />
                              <div>
                                <h4 className="text-xs font-bold text-white font-sans">{f.name}</h4>
                                <p className="text-[10px] text-neutral-400 font-sans mt-0.5 line-clamp-1">{rec.reasoning}</p>
                                <div className="flex gap-2 items-center text-[9px] text-[#FFD166] font-mono mt-1">
                                  <span>₹{f.price}</span> | <span>★ {f.rating}</span> | <span>{f.calories} Kcal</span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                addToCart(f.id, true);
                                alert(`Added: ${f.name} added to your active shopping bag.`);
                              }}
                              className="rounded-xl bg-[#FF5A1F] hover:bg-[#FF8C42] text-[10px] font-semibold text-white px-3 py-2 cursor-pointer flex items-center gap-1 shrink-0"
                            >
                              <ShoppingBag className="h-3 w-3" />
                              <span>Bag</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-neutral-400 space-y-3">
                    <Sparkles className="h-10 w-10 text-neutral-600 stroke-1" />
                    <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">Lobby vacant</h3>
                    <p className="text-xs max-w-[280px] leading-relaxed">Adjust the dials on the left and click "Generate Sommelier Match" to fetch AI recommendations.</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Chat conversational view */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-[52vh] justify-between">
              
              {/* Messages list context overflow */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar display */}
                    <div className={`h-8 w-8 rounded-full border flex items-center justify-center shrink-0 ${
                      msg.role === 'user'
                        ? 'bg-[#FF5A1F]/10 border-[#FF5A1F] text-[#FF8C42]'
                        : 'bg-neutral-800 border-neutral-700 text-[#FFD166]'
                    }`}>
                      <span className="text-[10px] font-bold font-mono">{msg.role === 'user' ? 'ME' : 'CH'}</span>
                    </div>

                    {/* Chat Text bubbles */}
                    <div className={`rounded-2xl max-w-lg p-3.5 text-xs font-sans leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#FF5A1F] text-white rounded-tr-none'
                        : 'bg-[#171717] border border-neutral-800 text-neutral-200 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-neutral-800 border-neutral-700 text-[#FFD166] flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold animate-pulse">CH</span>
                    </div>
                    <div className="rounded-2xl bg-neutral-900 border border-neutral-850 p-3 h-8 flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Conversational input controls */}
              <form onSubmit={handleSendChat} className="flex gap-2 items-center" id="chef-ai-chat-input-row">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Inquire recipes, ingredients, spice preferences, or pairing directions..."
                    className="w-full text-xs bg-[#0d0d0d] border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF5A1F] pr-10"
                  />
                  
                  {/* Speech input in chat */}
                  <button
                    type="button"
                    onClick={toggleVoiceListen}
                    className={`absolute right-3.5 top-3.5 transition cursor-pointer ${
                      isListening ? 'text-red-500 animate-bounce' : 'text-neutral-500 hover:text-white'
                    }`}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={chatInput.trim() === '' || chatLoading}
                  className="rounded-xl bg-[#FF5A1F] hover:bg-[#FF8C42] p-3.5 text-white disabled:opacity-40 cursor-pointer"
                  id="chat-send-btn"
                >
                  <SendHorizontal className="h-4.5 w-4.5" />
                </button>
              </form>

            </div>
          )}

        </div>

      </motion.div>
    </div>
  );
}
