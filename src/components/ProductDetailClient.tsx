'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { products, testimonials } from '@/data/products';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, updateDoc, increment, setDoc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductDetailClient({ product }: { product: (typeof products)[0] }) {
  const { addToCart } = useCart();
  const [selectedWeight, setSelectedWeight] = useState(product.weightOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // Real-time Views State
  const [liveViews, setLiveViews] = useState<number | null>(null);
  const scrollRef = useRef<boolean>(false);

  // Brewing Timer State
  const [timerLeft, setTimerLeft] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get 2 random testimonials for this product
  const productReviews = testimonials.slice(0, 2);

  // Real-time Views Sync
  useEffect(() => {
    if (!db || !product.slug) return;

    const statsDocRef = doc(db, 'product_stats', product.slug);

    // 1. Ensure doc exists and increment
    const syncView = async () => {
      try {
        const docSnap = await getDoc(statsDocRef);
        if (!docSnap.exists()) {
          await setDoc(statsDocRef, { current_views: 1 });
        } else {
          await updateDoc(statsDocRef, { current_views: increment(1) });
        }
      } catch (e) {
        console.error('Error incrementing view:', e);
      }
    };

    syncView();

    // 2. Listen for real-time updates
    const unsubscribe = onSnapshot(statsDocRef, (doc) => {
      if (doc.exists()) {
        setLiveViews(doc.data().current_views);
      }
    });

    // 3. Decrement on leave
    return () => {
      unsubscribe();
      updateDoc(statsDocRef, { current_views: increment(-1) }).catch(e => console.error('Error decrementing:', e));
    };
  }, [product.slug]);

  // Brewing Timer Logic
  const startTimer = () => {
    const preset = product.category.toLowerCase().includes('green') ? 120 
                 : product.category.toLowerCase().includes('assam') ? 240
                 : product.category.toLowerCase().includes('rose') ? 180 : 180;
    
    setTimerLeft(preset);
    setIsTimerRunning(true);
  };

  useEffect(() => {
    if (isTimerRunning && timerLeft && timerLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerLeft(prev => (prev && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timerLeft === 0) {
      setIsTimerRunning(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, timerLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedWeight.weight, selectedWeight.price);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 3);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: `https://elite-tea.vercel.app${product.image}`,
    description: product.shortDescription,
    brand: {
      '@type': 'Brand',
      name: 'Elite Tea',
    },
    offers: {
      '@type': 'Offer',
      url: `https://elite-tea.vercel.app/products/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
  };

  return (
    <div className="min-h-screen bg-cream pt-28 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-brand-800/40 mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gold-500 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-gold-500 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-brand-800/70">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Details */}
          <div className="flex flex-col justify-center order-1 lg:order-2">
            <span className="text-gold-500 font-semibold text-sm tracking-widest uppercase">{product.category}</span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-900 mt-2 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-6 h-6 ${i < Math.floor(product.rating) ? 'text-gold-500' : 'text-gray-200'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-brand-800/50 text-base">{product.rating} ({product.reviews} reviews)</span>
            </div>

            {/* Scarcity & Social Proof (LIVE DATA) */}
            <div className="flex flex-col gap-3 mb-8">
              <div className="flex items-center gap-2 text-red-600 font-bold text-sm bg-red-50/50 px-4 py-2 rounded-xl border border-red-100/50 w-fit">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                Flash Sale: Batch #804 is 92% Sold Out!
              </div>
              {liveViews !== null && (
                <div className="flex items-center gap-3 text-brand-800/70 text-sm font-medium bg-white/50 px-4 py-2 rounded-xl border border-brand-100/30 w-fit shadow-sm">
                  <span className="flex items-center gap-1">
                    <span className="flex -space-x-2">
                       {[1,2,3].map(i => (
                         <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                           {String.fromCharCode(64 + i)}
                         </div>
                       ))}
                    </span>
                  </span>
                  <span className="text-brand-900 font-bold">{liveViews} people</span> are viewing this now
                </div>
              )}
            </div>

            {/* Brewing Timer */}
            <div className="mb-8 p-6 bg-white rounded-3xl shadow-lg border border-gold-400/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg font-bold text-brand-900 flex items-center gap-2">
                    ⏱️ Perfect Brew Timer
                  </h3>
                  {isTimerRunning && (
                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  )}
                </div>
                
                {timerLeft !== null ? (
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-4xl font-display font-bold text-brand-900 tabular-nums">
                        {formatTime(timerLeft)}
                      </span>
                      <span className="text-xs font-bold text-brand-800/40 uppercase tracking-widest mt-1">
                        {timerLeft > 0 ? 'Steeping...' : 'Tea is Ready! 🍵'}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setIsTimerRunning(false);
                        setTimerLeft(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-bold hover:bg-red-100 transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={startTimer}
                    className="w-full py-4 rounded-2xl bg-gold-50 text-gold-700 font-bold text-sm hover:bg-gold-100 transition-all border border-gold-400/20 flex items-center justify-center gap-2"
                  >
                    Start {product.category.includes('Green') ? '2m' : product.category.includes('Assam') ? '4m' : '3m'} Brew Timer
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Image */}
            <div className="lg:hidden relative w-full h-[400px] sm:h-[500px] rounded-[2rem] overflow-hidden shadow-xl bg-white mb-6">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              {product.originalPrice && (
                <div className="absolute top-4 right-4 bg-red-500 text-white font-bold px-4 py-2 rounded-full text-sm shadow-md">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-5xl font-bold text-brand-900">₹{selectedWeight.price}</span>
              {product.originalPrice && (
                <span className="text-2xl text-brand-800/40 line-through">₹{product.originalPrice}</span>
              )}
              <span className="text-brand-800/50 text-base">/ {selectedWeight.weight}</span>
            </div>

            {/* Benefits & Trust Badges */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-brand-50 border border-brand-100/50 hover:bg-brand-100/30 transition-colors">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 shrink-0 text-xl shadow-inner">
                  🌿
                </div>
                <div>
                  <h4 className="font-bold text-brand-900 text-xs sm:text-sm">Direct from Garden</h4>
                  <p className="text-[10px] sm:text-xs text-brand-800/60 leading-tight">No Middlemen</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-gold-50 border border-gold-100/50 hover:bg-gold-100/30 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center text-gold-700 shrink-0 text-xl shadow-inner">
                  🏅
                </div>
                <div>
                  <h4 className="font-bold text-brand-900 text-xs sm:text-sm">FSSAI Certified</h4>
                  <p className="text-[10px] sm:text-xs text-brand-800/60 leading-tight">100% Pure & Safe</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50 border border-blue-100/50 col-span-2 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 text-xl shadow-inner">
                  🛡️
                </div>
                <div>
                  <h4 className="font-bold text-brand-900 text-sm">Risk-Free Guarantee</h4>
                  <p className="text-xs text-brand-800/60 leading-tight">Love the taste or we refund your first order. No questions asked.</p>
                </div>
              </div>
            </div>

            <p className="text-brand-800/80 text-lg leading-relaxed mb-8">{product.description}</p>

            {/* Weight Options */}
            <div className="mb-6">
              <label className="text-base font-semibold text-brand-900 mb-3 block">Select Weight</label>
              <div className="flex flex-wrap gap-3">
                {product.weightOptions.map((opt) => (
                  <button
                    key={opt.weight}
                    onClick={() => setSelectedWeight(opt)}
                    className={`px-6 py-3 rounded-xl text-base font-medium transition-all ${
                      selectedWeight.weight === opt.weight
                        ? 'bg-brand-800 text-white shadow-lg scale-105'
                        : 'bg-white text-brand-800/70 border border-brand-200/50 hover:border-gold-400'
                    }`}
                  >
                    {opt.weight} — ₹{opt.price}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <label className="text-base font-semibold text-brand-900 mb-3 block">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white rounded-xl border border-brand-200/50 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-5 py-3 text-brand-800/60 hover:bg-brand-50 transition-colors text-xl font-medium"
                  >
                    −
                  </button>
                  <span className="px-6 py-3 text-brand-900 font-semibold min-w-[3.5rem] text-center text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-5 py-3 text-brand-800/60 hover:bg-brand-50 transition-colors text-xl font-medium"
                  >
                    +
                  </button>
                </div>
                <span className="text-brand-800/50 font-medium">Total: <span className="text-brand-900 text-lg font-bold">₹{selectedWeight.price * quantity}</span></span>
              </div>
            </div>

            {/* Add to Cart Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold text-xl transition-all shadow-xl ${
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : 'bg-gradient-to-r from-gold-500 to-gold-600 text-white'
                }`}
              >
                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </button>
              <a
                href={`https://wa.me/917811081552?text=${encodeURIComponent(
                  `Hi! I'd like to order ${quantity} × ${product.name} (${selectedWeight.weight}) — ₹${selectedWeight.price * quantity}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:bg-green-700 transition-all shadow-xl"
              >
                Quick Order
              </a>
            </div>

            {/* Sticky Mobile CTA */}
            <div className="lg:hidden fixed bottom-1 left-0 right-0 z-[150] px-4 pointer-events-none">
              <motion.div 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="pointer-events-auto bg-brand-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4"
              >
                <div className="flex flex-col">
                  <span className="text-white font-bold text-lg">₹{selectedWeight.price * quantity}</span>
                  <span className="text-white/40 text-[10px] tracking-widest uppercase">{selectedWeight.weight}</span>
                </div>
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                    addedToCart ? 'bg-green-600 text-white' : 'bg-gold-500 text-brand-900'
                  }`}
                >
                  {addedToCart ? 'Added!' : 'Add to Cart'}
                </button>
              </motion.div>
            </div>
          </div>

          {/* Desktop Image */}
          <div className="hidden lg:block relative h-[700px] rounded-[2rem] overflow-hidden shadow-2xl bg-white order-1 sticky top-32">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="50vw"
            />
            {product.originalPrice && (
              <div className="absolute top-6 right-6 bg-red-500 text-white font-bold px-5 py-2.5 rounded-full text-base shadow-lg">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32">
            <h2 className="font-display text-4xl font-bold text-brand-900 mb-10 text-center">
              You May Also <span className="text-gold-gradient">Like</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
