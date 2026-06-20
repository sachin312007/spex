import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, Flame, MapPin, Sparkles, Navigation, Clock, ShieldCheck, ShoppingBag } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface TrackingSectionProps {
  orders: Order[];
  onProgressOrderState?: (orderId: string, nextStatus: OrderStatus) => void;
}

const STAGES: OrderStatus[] = [
  'Order Placed',
  'Confirmed',
  'Preparing',
  'Cooking',
  'Packed',
  'Out For Delivery',
  'Delivered',
];

const STAGE_METRIC = {
  'Order Placed': { title: 'Dossier Logged', desc: 'Secure order database confirmation complete.', icon: ShieldCheck },
  Confirmed: { title: 'Chef Acknowledged', desc: 'Sourcing ingredients and preparing station tables.', icon: Check },
  Preparing: { title: 'Ingredient Selection', desc: 'Sieving, washing, and seasoning premium ingredients.', icon: Sparkles },
  Cooking: { title: 'Active Kitchen Cooking', desc: 'Baking under precise brick-oven temperatures.', icon: Flame },
  Packed: { title: 'Thermal Seal Lockdown', desc: 'Enclosing food in custom medical-grade foil cases.', icon: ShieldCheck },
  'Out For Delivery': { title: 'On Transit Dispatch', desc: 'Courier navigating the municipal highways.', icon: Navigation },
  Delivered: { title: 'Gourmet Delivered', desc: 'Contactless handoff completed successfully.', icon: MapPin },
};

export default function TrackingSection({ orders, onProgressOrderState }: TrackingSectionProps) {
  const [activeOrderId, setActiveOrderId] = useState<string>('');

  // Auto-bind to the most recent order if active limit is reached
  useEffect(() => {
    if (orders.length > 0) {
      // Find the first order that is NOT delivered, or default to the absolute newest
      const active = orders.find((o) => o.status !== 'Delivered') || orders[0];
      setActiveOrderId(active.id);
    }
  }, [orders]);

  const targetOrder = orders.find((o) => o.id === activeOrderId);

  if (orders.length === 0 || !targetOrder) {
    return (
      <div className="bg-[#0d0d0d] py-20 text-center border-t border-neutral-900 text-white">
        <div className="mx-auto max-w-lg p-6 border border-dashed border-neutral-800 rounded-3xl bg-[#171717] space-y-4">
          <Navigation className="h-10 w-10 text-neutral-600 mx-auto animate-bounce" />
          <h2 className="text-base font-bold">No active orders found</h2>
          <p className="text-xs text-neutral-400">Head over to the Interactive Menu and experience Spex speed culinary deliveries.</p>
        </div>
      </div>
    );
  }

  const currentStageIndex = STAGES.indexOf(targetOrder.status);

  const simulateStepForward = () => {
    if (currentStageIndex < STAGES.length - 1 && onProgressOrderState) {
      const nextStage = STAGES[currentStageIndex + 1];
      onProgressOrderState(targetOrder.id, nextStage);
    }
  };

  const simulateStepBackward = () => {
    if (currentStageIndex > 0 && onProgressOrderState) {
      const nextStage = STAGES[currentStageIndex - 1];
      onProgressOrderState(targetOrder.id, nextStage);
    }
  };

  return (
    <div className="bg-[#0d0d0d] py-16 border-t border-neutral-900 text-white" id="live-order-tracking-stage">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title details */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-[0.2em] font-mono">Real-time Deployment Analytics</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">Live Order Delivery</h1>
            <p className="text-xs text-neutral-400 mt-1">Monitor thermals, route channels, and kitchen progress.</p>
          </div>

          {/* Active Order Selector Dropdown if multiple orders exist */}
          {orders.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-400 font-sans">Switch Tracking Order:</span>
              <select
                value={activeOrderId}
                onChange={(e) => setActiveOrderId(e.target.value)}
                className="rounded-xl border border-neutral-800 bg-[#171717] px-3 py-2 text-xs text-white focus:outline-none"
              >
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.id} ({o.status})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Outer Split Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel: Detailed Progress Gauges */}
          <div className="lg:col-span-8 bg-[#171717] border border-neutral-800 rounded-3xl p-6 space-y-8">
            
            {/* Upper Tracker Overview info banner */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center rounded-2xl bg-[#0d0d0d] p-4 border border-neutral-800/80 gap-3">
              <div>
                <p className="text-[10px] font-bold text-[#FFD166] uppercase font-mono">Tracker Unique Identifier</p>
                <p className="text-lg font-black tracking-wider text-white mt-0.5">{targetOrder.id}</p>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#FF5A1F]" />
                <div>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase font-mono">Estimated Handover</p>
                  <p className="text-xs font-bold text-white">
                    {new Date(targetOrder.estimatedDeliveryTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-neutral-500 uppercase font-mono">Method Status</p>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#22C55E]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#22C55E] mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" /> Verified {targetOrder.paymentStatus}
                </div>
              </div>
            </div>

            {/* Stages progression line */}
            <div className="relative pl-6 sm:pl-0 space-y-6 sm:space-y-0 sm:grid sm:grid-cols-7 sm:gap-2">
              
              {/* Vertical connector line on mobile, details on desktop */}
              <div className="absolute top-2 bottom-2 left-[15px] w-1 bg-neutral-800 sm:hidden" />
              
              {/* Horizontal line on desktop */}
              <div className="absolute top-[18px] left-[5%] right-[5%] h-1 bg-neutral-800 hidden sm:block -z-0" />
              
              {/* Progress-fill on desktop horizontal bar */}
              <div 
                className="absolute top-[18px] left-[5%] h-1 bg-[#FF5A1F] hidden sm:block -z-0 transition-all duration-500" 
                style={{ width: `${(currentStageIndex / (STAGES.length - 1)) * 90}%` }}
              />

              {STAGES.map((stage, sIdx) => {
                const isPassed = currentStageIndex >= sIdx;
                const isCurrent = currentStageIndex === sIdx;
                const config = STAGE_METRIC[stage];
                const Icon = config.icon;

                return (
                  <div key={stage} className="relative flex sm:flex-col items-start sm:items-center text-left sm:text-center gap-4 sm:gap-0">
                    
                    {/* Circle bulb */}
                    <div 
                      className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 sm:mb-3 ${
                        isCurrent 
                          ? 'bg-[#FF5A1F] border-[#FF5A1F] text-white shadow-lg shadow-[#FF5A1F]/30 scale-110' 
                          : isPassed 
                          ? 'bg-[#FF8C42]/25 border-[#FF8C42] text-[#FF8C42]' 
                          : 'bg-[#171717] border-neutral-800 text-neutral-600'
                      }`}
                    >
                      {isPassed && !isCurrent ? (
                        <Check className="h-4 w-4 stroke-[3]" />
                      ) : (
                        <span className="text-xs font-black">{sIdx + 1}</span>
                      )}
                    </div>

                    {/* Meta Labels */}
                    <div className="flex-1 sm:px-1">
                      <p className={`text-xs font-bold leading-none ${isCurrent ? 'text-[#FF8C42]' : isPassed ? 'text-white' : 'text-neutral-500'}`}>
                        {stage}
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-1 block sm:hidden md:block">
                        {config.title}
                      </p>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Current Active Progress Status Commentary Card */}
            <div className="flex gap-4 rounded-xl bg-neutral-900 border border-neutral-800 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FF5A1F]/10 text-[#FF5A1F]">
                {(() => {
                  const CurrentIcon = STAGE_METRIC[targetOrder.status]?.icon || MapPin;
                  return <CurrentIcon className="h-6 w-6 animate-pulse" />;
                })()}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-sans">
                  {targetOrder.status} — {STAGE_METRIC[targetOrder.status]?.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 font-sans leading-relaxed">
                  {STAGE_METRIC[targetOrder.status]?.desc} Sourcing dispatch code verified under standards.
                </p>
              </div>
            </div>

            {/* Admin Simulated Progress Controllers (Provided for 100% interactivity!) */}
            {onProgressOrderState && (
              <div className="pt-4 border-t border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-extrabold text-[#FFD166] uppercase font-mono flex items-center gap-1">
                    <span>⚡</span> Status Progression Sandbox Panel
                  </h4>
                  <p className="text-[10px] text-neutral-500 font-sans mt-0.5">Use these controls to simulate the active courier/kitchen transitions.</p>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={simulateStepBackward}
                    className="flex-1 sm:flex-none text-xs rounded-lg border border-neutral-800 hover:border-neutral-500 bg-neutral-950 px-4 py-2 font-bold hover:text-white text-neutral-400 cursor-pointer"
                  >
                    « Backward
                  </button>
                  <button
                    onClick={simulateStepForward}
                    className="flex-1 sm:flex-none text-xs rounded-lg border border-[#FF5A1F]/40 hover:border-[#FF5A1F] bg-[#FF5A1F]/10 px-4 py-2 font-bold text-[#FF8C42] hover:text-white cursor-pointer"
                  >
                    Step Forward »
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Detailed summary of dispatch addresses & items list */}
          <div className="lg:col-span-4 bg-[#171717] border border-neutral-800 rounded-3xl p-6 space-y-6">
            <h3 className="text-xs font-bold text-[#FFD166] uppercase font-mono tracking-wider pb-2 border-b border-neutral-800">
              Delivery Destination Checklist
            </h3>

            {/* Deliver location */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-neutral-500 font-mono">1. Delivery Address</span>
              <div className="flex gap-1.5 items-start">
                <MapPin className="h-4.5 w-4.5 text-[#FF5A1F] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white">{targetOrder.deliveryAddress.type} Location</p>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed font-sans">
                    {targetOrder.deliveryAddress.addressLine1}, {targetOrder.deliveryAddress.addressLine2 && `${targetOrder.deliveryAddress.addressLine2}, `}
                    {targetOrder.deliveryAddress.city} - {targetOrder.deliveryAddress.zipCode}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery instructions */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-neutral-500 font-mono">2. Courier Instruction Notes</span>
              <p className="text-xs text-neutral-400 bg-neutral-900 border border-neutral-800 p-3 rounded-xl italic leading-relaxed font-sans">
                "{targetOrder.deliveryNotes || 'No special dispatch instructions appended.'}"
              </p>
            </div>

            {/* Item counts breakdown list */}
            <div className="space-y-2 pt-2 border-t border-neutral-800/80">
              <span className="text-[10px] uppercase font-bold text-neutral-500 font-mono">3. Sourced Food Items ({targetOrder.items.length})</span>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {targetOrder.items.map((it) => (
                  <div key={it.foodId} className="flex items-center justify-between text-xs bg-[#0d0d0d] rounded-xl p-2.5 border border-neutral-800/40">
                    <div className="flex items-center gap-1.5 leading-none">
                      <span className="font-bold text-[#FF5A1F] font-mono">x{it.quantity}</span>
                      <span className="font-semibold text-white truncate max-w-[140px]">{it.nameAtOrder}</span>
                    </div>
                    <span className="font-bold text-neutral-300">₹{it.priceAtOrder * it.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Loyalty points generated summary card */}
            <div className="rounded-2xl bg-neutral-900 p-4 border border-neutral-800 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFD166]/10 text-[#FFD166] text-sm font-black">
                +{(targetOrder.total / 10).toFixed(0)}
              </div>
              <div className="leading-tight">
                <p className="text-xs font-bold text-white">Spex Loyalty Points Earned</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">Credited to Sachin Pal's account.</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
