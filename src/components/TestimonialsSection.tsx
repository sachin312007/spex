import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote, ShieldCheck } from 'lucide-react';

export default function TestimonialsSection() {
  const reviews = [
    {
      name: 'Aditya Roy',
      title: 'Michelin Culinary Reviewer',
      comment: 'Spex elevates street and traditional Indian cuisine into an elite visual and culinary masterclass. The crispy pani puri was served with perfect temperature regulation inside custom thermal seals.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      rating: 5,
    },
    {
      name: 'Pooja Hegde',
      title: 'Fitness Nutritionist',
      comment: 'Their exclusive Pure Green list offers exactly what health-conscious eaters need without ignoring taste buds. Pure sesame Hakka noodles are extremely delicious and macro-balanced.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      rating: 5,
    },
    {
      name: 'Kabir Sharma',
      title: 'Tech Architect',
      comment: 'By far the fastest ordering system I have encountered! The direct order pathway bypasses complex cart logins in single click. Recommended for busy developers working late.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      rating: 5,
    },
  ];

  return (
    <div className="bg-[#070707] py-16 sm:py-24 border-t border-neutral-900 select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[#FFD166] uppercase font-mono tracking-[0.2em]">VERIFIED PATRON REVIEWS</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
            Acclaim from Culinary Connoisseurs
          </h2>
          <p className="text-xs text-neutral-400 font-sans leading-relaxed">
            Read critical acclaim and endorsements from our elite diners, corporate patrons, and food critics around the nation.
          </p>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map((rev, i) => (
            <motion.div
              key={rev.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-[#0b0b0b] border border-neutral-855 rounded-3xl p-6 flex flex-col justify-between group hover:border-[#FF5A1F]/25 transition duration-300 relative"
            >
              <div className="absolute top-6 right-6 text-neutral-800">
                <Quote className="h-8 w-8" />
              </div>

              <div className="space-y-4">
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: rev.rating }).map((_, idx) => (
                    <Star key={idx} className="h-3.5 w-3.5 fill-current text-[#FF5A1F]" />
                  ))}
                </div>

                <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              {/* Patron Bio info */}
              <div className="flex gap-3 items-center pt-5 border-t border-neutral-900 mt-6 shrink-0">
                <img src={rev.avatar} alt={rev.name} className="h-10 w-10 rounded-full object-cover select-none pointer-events-none bg-neutral-900" />
                <div className="truncate-1">
                  <div className="text-xs font-extrabold text-white flex items-center gap-1">
                    {rev.name}
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  </div>
                  <span className="text-[10px] text-neutral-500 font-medium font-mono">{rev.title}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
