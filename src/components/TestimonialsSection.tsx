import React, { useState } from 'react';
import { Star, Quote, MessageSquare, Award, ThumbsUp, Sparkles, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReviewItem {
  id: string;
  name: string;
  location: string;
  role: string;
  rating: number;
  comment: string;
  image: string;
  date: string;
  verified: boolean;
  likes: number;
}

const INITIAL_TESTIMONIALS: ReviewItem[] = [
  {
    id: 't-1',
    name: 'Aarav Mehta',
    location: 'Indiranagar, Bengaluru',
    role: 'Tech Lead at SpexSystems',
    rating: 5,
    comment: 'The Biryani is pure royalty. The saffron rice, tender meat, and the extra premium Raita add-on came beautifully sealed. Real thermal delivery is not a gimmick - it arrived steaming hot!',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    date: '2026-06-18',
    verified: true,
    likes: 42,
  },
  {
    id: 't-2',
    name: 'Priya Sharma',
    location: 'Koramangala, Bengaluru',
    role: 'Gourmet Food Enthusiast',
    rating: 5,
    comment: 'I am highly impressed by the customization options before checkout! Adding Szechuan Glaze to my dimsums and Gunpowder Podi to my Dosa with a simple tap is a feature no other app has designed so cleanly.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    date: '2026-06-19',
    verified: true,
    likes: 29,
  },
  {
    id: 't-3',
    name: 'Vikram Malhotra',
    location: 'Whitefield, Bengaluru',
    role: 'Product Designer',
    rating: 5,
    comment: 'Absolute aesthetic masterclass. The dark UI is super smooth, the order now button lets me skip the cart hassle, and the tracking map dashboard updates inside of seconds. Stellar craftsmanship!',
    image: 'https://images.unsplash.com/photo-1624561172888-ac93c696e10c?w=150&auto=format&fit=crop&q=80',
    date: '2026-06-15',
    verified: true,
    likes: 56,
  },
  {
    id: 't-4',
    name: 'Ananya Iyer',
    location: 'Jayanagar, Bengaluru',
    role: 'Digital Creator',
    rating: 5,
    comment: 'Being able to buy delicious premium combos and custom sweeten my desserts with Condensed Rabri scoop on the fly is incredible. Spex has truly revolutionized modern foodtech experience.',
    image: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=150&auto=format&fit=crop&q=80',
    date: '2026-06-17',
    verified: true,
    likes: 38,
  },
];

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_TESTIMONIALS);
  
  // Custom Reviews submit form
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newLocation, setNewLocation] = useState('Bengaluru');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newGender, setNewGender] = useState<'male' | 'female'>('female');
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Likes handle
  const handleLike = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, likes: r.likes + 1 } : r))
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    // Pick a realistic premium Indian portrait based on gender selection
    const femaleImages = [
      'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=150&auto=format&fit=crop&q=80',
    ];
    const maleImages = [
      'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    ];

    const chosenImage = newGender === 'female' 
      ? femaleImages[Math.floor(Math.random() * femaleImages.length)]
      : maleImages[Math.floor(Math.random() * maleImages.length)];

    const created: ReviewItem = {
      id: `custom-${Date.now()}`,
      name: newName,
      location: newLocation || 'Bengaluru',
      role: newRole || 'Gourmet Connoisseur',
      rating: newRating,
      comment: newComment,
      image: chosenImage,
      date: new Date().toISOString().split('T')[0],
      verified: true,
      likes: 0,
    };

    setReviews([created, ...reviews]);
    setNewName('');
    setNewRole('');
    setNewComment('');
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsSubmitOpen(false);
    }, 2000);
  };

  return (
    <section className="bg-gradient-to-b from-[#0d0d0d] to-[#080808]/40 py-20 border-t border-neutral-900 overflow-hidden relative" id="testimonials-reviews-terminal">
      {/* Downward Orange Glow Vignette and Ambient Light System */}
      <div className="absolute bottom-0 inset-x-0 h-96 bg-gradient-to-t from-[#FF5A1F]/15 via-[#FF5A1F]/4 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -translate-x-1/2 w-[450px] h-[180px] bg-[#FF5A1F]/10 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-[450px] h-[180px] bg-[#FF8C42]/8 rounded-full blur-[115px] pointer-events-none" />
      {/* Subtle bottom edge orange-amber borders shine */}
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF5A1F]/30 to-transparent pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header decoration */}
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 px-3 py-1 text-xs font-mono font-bold text-[#FF8C42]">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>CUSTOMER APPRECIATION PLATFORM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none font-sans">
            Banquet Chronicles & Honest Reviews
          </h2>
          <p className="text-sm text-neutral-400 max-w-2xl font-sans">
            Discover what our loyal Indian patrons from tech corridors and cultural hubs are saying about Spex’s thermal dispatch channels & ingredients.
          </p>
        </div>

        {/* Testimonials Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((item) => (
            <motion.div
              layout
              key={item.id}
              className="relative flex flex-col justify-between rounded-3xl border border-neutral-800 bg-neutral-950/60 p-6 hover:border-neutral-700 transition duration-300"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="space-y-4">
                {/* Visual quote icon ornament */}
                <div className="absolute right-6 top-6 text-neutral-800/60">
                  <Quote className="h-8 w-8" />
                </div>

                {/* Star rating stars stack */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < item.rating ? 'fill-[#FFD166] text-[#FFD166]' : 'text-neutral-800'
                      }`}
                    />
                  ))}
                </div>

                {/* Review comment content text */}
                <p className="text-xs text-neutral-300 font-sans leading-relaxed italic">
                  "{item.comment}"
                </p>
              </div>

              {/* User Portrait footprint details */}
              <div className="mt-6 pt-5 border-t border-neutral-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-10 w-10 rounded-full object-cover border border-[#FF5A1F]/20"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="text-xs font-bold text-white font-sans">{item.name}</h4>
                      {item.verified && (
                        <div className="h-3.5 w-3.5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20" title="Verified Order Owner">
                          <UserCheck className="h-2 w-2" />
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-500 font-sans font-medium">{item.role}</p>
                    <p className="text-[9px] text-[#FF8C42] font-mono mt-0.5">{item.location}</p>
                  </div>
                </div>

                {/* Helpful Like vote */}
                <button
                  type="button"
                  onClick={() => handleLike(item.id)}
                  className="flex items-center gap-1 rounded-lg border border-neutral-900 bg-neutral-900/40 px-2 py-1 text-[10px] text-neutral-400 hover:text-white hover:border-neutral-850 cursor-pointer transition select-none"
                >
                  <ThumbsUp className="h-2.5 w-2.5" />
                  <span>{item.likes}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action point - Allow patrons to write dynamic reviews */}
        <div className="mt-14 flex flex-col items-center">
          {!isSubmitOpen ? (
            <button
              onClick={() => setIsSubmitOpen(true)}
              className="rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-[#FF5A1F]/40 px-6 py-3.5 text-xs font-bold text-white tracking-wide transition cursor-pointer flex items-center gap-2"
              id="write-chronicle-review-btn"
            >
              <MessageSquare className="h-4 w-4 text-[#FF5A1F]" />
              <span>Share Your Feast Chronicle</span>
            </button>
          ) : (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="w-full max-w-lg rounded-3xl border border-neutral-800 bg-neutral-950 p-6 space-y-4 shadow-xl text-left"
              id="testimonial-creator-box"
            >
              <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="h-4 w-4 text-[#FFD166]" /> Submit Banquet Chronicle
                </h3>
                <button
                  onClick={() => setIsSubmitOpen(false)}
                  className="text-neutral-500 hover:text-white text-xs cursor-pointer font-semibold"
                >
                  Cancel
                </button>
              </div>

              {submittedSuccess ? (
                <div className="text-center py-6 text-emerald-400 font-sans text-xs">
                  <p className="font-bold">✨ Authenticated & Broadcasted Successfully!</p>
                  <p className="text-neutral-500 mt-1">Your review will now populate the public terminal list.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-3.5 text-xs font-sans">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-500 font-mono block">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Verma"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full rounded-lg border border-neutral-850 bg-neutral-900 px-3 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF5A1F]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-500 font-mono block">Designation / Profession</label>
                      <input
                        type="text"
                        placeholder="e.g. Software Architect"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="w-full rounded-lg border border-neutral-850 bg-neutral-900 px-3 py-2 text-white placeholder-neutral-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-500 font-mono block">Portrait Avatar Style</label>
                      <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                        <button
                          type="button"
                          onClick={() => setNewGender('female')}
                          className={`rounded-lg py-1 border font-medium text-center text-[10px] cursor-pointer ${
                            newGender === 'female'
                              ? 'border-[#FF5A1F] bg-[#FF5A1F]/10 text-[#FF8C42]'
                              : 'border-neutral-800 text-neutral-400'
                          }`}
                        >
                          Indian Woman
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewGender('male')}
                          className={`rounded-lg py-1 border font-medium text-center text-[10px] cursor-pointer ${
                            newGender === 'male'
                              ? 'border-[#FF5A1F] bg-[#FF5A1F]/10 text-[#FF8C42]'
                              : 'border-neutral-800 text-neutral-400'
                          }`}
                        >
                          Indian Man
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-500 font-mono block">Rating Scale</label>
                      <select
                        value={newRating}
                        onChange={(e) => setNewRating(Number(e.target.value))}
                        className="w-full rounded-lg border border-neutral-850 bg-neutral-900 px-3 py-1.5 text-white focus:outline-none cursor-pointer"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5/5 Excellence)</option>
                        <option value={4}>⭐⭐⭐⭐ (4/5 Delish)</option>
                        <option value={3}>⭐⭐⭐ (3/5 Satisfactory)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-500 font-mono block">Location / Sector *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Indiranagar, Bengaluru"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full rounded-lg border border-neutral-850 bg-neutral-900 px-3 py-2 text-white placeholder-neutral-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-500 font-mono block">Gourmet Chronicle Comment *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe your dining or delivery experience with Spex..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full rounded-lg border border-neutral-850 bg-neutral-900 px-3 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF5A1F] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#FF5A1F] hover:bg-[#FF8C42] py-2.5 font-bold text-white transition tracking-wide cursor-pointer uppercase text-[10px]"
                  >
                    Authenticate & Publish Review
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </div>

      </div>
    </section>
  );
}
