import React from 'react';
import { motion } from 'motion/react';
import { Truck, CheckCircle, Clock, MapPin, ShoppingBag, Receipt, ArrowRight, Compass, ShieldAlert } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface TrackingSectionProps {
  orders: Order[];
  onProgressOrderState: (orderId: string, status: OrderStatus) => void;
}

const STATUS_FLOW: OrderStatus[] = [
  'Order Placed',
  'Confirmed',
  'Preparing',
  'Cooking',
  'Packed',
  'Out For Delivery',
  'Delivered'
];

export default function TrackingSection({
  orders,
  onProgressOrderState
}: TrackingSectionProps) {
  
  const handleNextStatus = (order: Order) => {
    const currentIdx = STATUS_FLOW.indexOf(order.status);
    if (currentIdx !== -1 && currentIdx < STATUS_FLOW.length - 1) {
      onProgressOrderState(order.id, STATUS_FLOW[currentIdx + 1]);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="bg-[#070707] py-24 text-center select-none">
        <div className="max-w-md mx-auto space-y-4">
          <Truck className="h-10 w-10 text-neutral-800 mx-auto animate-pulse" />
          <div className="space-y-1">
            <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">TRACKING PORTFOLIO CLEAR</h3>
            <p className="text-xs text-neutral-500 font-sans leading-normal">
              No active or historical dispatch cycles are saved in this session terminal. Add delicious culinary items and place an order.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#070707] py-16 sm:py-24 border-t border-neutral-900 select-none">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Intro */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-bold text-[#FF5A1F] uppercase font-mono tracking-[0.2em]">Real-Time Mission Room</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none font-sans">
            Thermal Dispatch Tracking
          </h2>
          <p className="text-xs text-neutral-400 mt-1 leading-normal font-sans">
            Monitor culinary kitchen preparatives, food heating metrics, and courier route coordinate streams in real time.
          </p>
        </div>

        {/* Orders list */}
        <div className="space-y-10">
          {orders.map((order, idx) => {
            const currentIdx = STATUS_FLOW.indexOf(order.status);
            const dateObj = new Date(order.createdAt);
            const formattedDate = isNaN(dateObj.getTime()) ? order.createdAt : dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#0c0c0c] border border-neutral-855 rounded-[26px] p-5 sm:p-8 space-y-6"
              >
                {/* Order Meta bar */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-neutral-900 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-neutral-500 font-black uppercase text-[10px]">ORDER ID:</span>
                      <span className="font-mono text-amber-500 font-black uppercase tracking-wider">{order.id}</span>
                    </div>
                    <div className="text-neutral-400 font-sans text-[11px] flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-[#FF5A1F]" />
                      <span>Placed at <strong>{formattedDate}</strong></span>
                      <span>•</span>
                      <span>Est. Dispatch: <strong>32 mins</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono font-black uppercase px-3 py-1.5 rounded-xl">
                      {order.paymentMethod} • {order.paymentStatus}
                    </span>
                    
                    {order.status !== 'Delivered' && (
                      <button
                        onClick={() => handleNextStatus(order)}
                        className="bg-gradient-to-r from-[#FF5A1F] to-[#FF8C42] hover:brightness-110 text-white text-[10px] font-black uppercase px-3 py-2 rounded-xl cursor-pointer"
                      >
                        Simulate Next Phase &rarr;
                      </button>
                    )}
                  </div>
                </div>

                {/* Tracking Milestones progress flow */}
                <div className="space-y-4">
                  <span className="text-[9px] font-mono font-black uppercase tracking-widest text-neutral-500">DISPATCH TIMELINE STEPS</span>
                  <div className="relative">
                    {/* Connecting progress line */}
                    <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 -translate-x-1/2 w-0.5 bg-neutral-900" />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 relative z-10 font-sans text-[11px] font-bold">
                      {STATUS_FLOW.map((status, stepIdx) => {
                        const isDone = currentIdx >= stepIdx;
                        const isCurrent = currentIdx === stepIdx;

                        return (
                          <div
                            key={status}
                            className={`flex sm:flex-col items-center justify-start sm:justify-center text-center gap-3.5 sm:gap-2.5 transition duration-300 ${
                              isDone ? 'text-white' : 'text-neutral-600'
                            }`}
                          >
                            <div className={`h-8 w-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                              isCurrent
                                ? 'bg-[#FF5A1F] border-[#FF5A1F] text-white shadow-[0_0_15px_rgba(255,90,31,0.5)] animate-pulse'
                                : (isDone ? 'bg-emerald-600/15 border-emerald-500/50 text-emerald-400' : 'bg-black border-neutral-850 text-neutral-700')
                            }`}>
                              {isDone && !isCurrent ? (
                                <CheckCircle className="h-4.5 w-4.5" />
                              ) : (
                                <span className="font-mono text-xs">{stepIdx + 1}</span>
                              )}
                            </div>
                            <span className={`leading-tight max-w-[100px] text-left sm:text-center uppercase text-[8.5px] font-black tracking-wider ${isCurrent ? 'text-[#FFD166]' : ''}`}>
                              {status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Order deliverables breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 border-t border-neutral-900">
                  <div className="md:col-span-6 space-y-4">
                    <span className="text-[9px] font-mono font-black uppercase tracking-widest text-neutral-500">ITEM QUANTITIES IN DUPLICATE</span>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.foodId} className="flex justify-between text-xs font-sans text-neutral-300">
                          <span className="truncate">{item.nameAtOrder} <strong className="text-[#FF5A1F] font-mono">x{item.quantity}</strong></span>
                          <span className="font-mono text-neutral-400">₹{item.priceAtOrder * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-6 bg-black border border-neutral-900 rounded-2xl p-4 space-y-3 font-sans text-xs text-neutral-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#FF5A1F] shrink-0" />
                      <div className="truncate">
                        <strong>Dispatch Coordinates:</strong>
                        <p className="text-[10px] text-neutral-500 mt-0.5 truncate">{order.deliveryAddress.addressLine1}, {order.deliveryAddress.city}</p>
                      </div>
                    </div>
                    {order.deliveryNotes && (
                      <div className="p-2.5 bg-neutral-950 rounded-lg border border-neutral-900 leading-normal text-[10px] text-neutral-500">
                        🔔 Guest Directions: "{order.deliveryNotes}"
                      </div>
                    )}
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
