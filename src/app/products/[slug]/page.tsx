'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products, testimonials } from '@/data/products';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}

function ProductDetail({ product }: { product: (typeof products)[0] }) {
  const { addToCart } = useCart();
  const [selectedWeight, setSelectedWeight] = useState(product.weightOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // Get 2 random testimonials for this product
  const productReviews = testimonials.slice(0, 2);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedWeight.weight, selectedWeight.price);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-cream pt-28 pb-20">
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
          {/* Details (Shows FIRST on mobile) */}
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

            {/* Mobile Image (Visible only on small screens, AFTER Title/Rating, BEFORE Price) */}
            <div className="lg:hidden relative w-full h-[400px] sm:h-[500px] rounded-[2rem] overflow-hidden shadow-xl bg-white mb-6">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.08] mix-blend-overlay">
                  <span className="font-display text-5xl sm:text-7xl font-black uppercase text-brand-900 transform -rotate-45 whitespace-nowrap">
                    Elite Tea
                  </span>
              </div>

              {product.originalPrice && (
                <div className="absolute top-4 right-4 bg-red-500 text-white font-bold px-4 py-2 rounded-full text-sm shadow-md">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </div>
              )}
            </div>

            {/* Price (Moved below Image on Mobile) */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-5xl font-bold text-brand-900">₹{selectedWeight.price}</span>
              {product.originalPrice && (
                <span className="text-2xl text-brand-800/40 line-through">₹{product.originalPrice}</span>
              )}
              <span className="text-brand-800/50 text-base">/ {selectedWeight.weight}</span>
            </div>

            {/* Benefits & Trust Badges (Easy Return) */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-brand-50 border border-brand-100/50">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-brand-900 text-sm">Health Benefits</h4>
                  <p className="text-xs text-brand-800/60 leading-tight">Rich in antioxidants</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-gold-50 border border-gold-100/50">
                <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center text-gold-700 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-brand-900 text-sm">Easy Returns</h4>
                  <p className="text-xs text-brand-800/60 leading-tight">7-day hassle free</p>
                </div>
              </div>
            </div>

            <p className="text-brand-800/80 text-lg leading-relaxed mb-8">{product.description}</p>

            {/* Reviews Section inline */}
            <div className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-brand-100/50">
              <h3 className="font-display text-xl font-bold text-brand-900 mb-4">Customer Reviews</h3>
              <div className="space-y-4">
                {productReviews.map((review) => (
                  <div key={review.id} className="border-b border-brand-100/50 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-gold-500' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="font-semibold text-sm text-brand-900">{review.name}</span>
                    </div>
                    <p className="text-sm text-brand-800/70 italic">&quot;{review.text}&quot;</p>
                  </div>
                ))}
              </div>
            </div>

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

            {/* Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                id="add-to-cart-detail"
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold text-xl transition-all transform hover:scale-[1.02] shadow-xl ${
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : 'bg-gradient-to-r from-gold-500 to-gold-600 text-white hover:from-gold-600 hover:to-gold-700'
                }`}
              >
                {addedToCart ? (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
              <a
                href={`https://wa.me/917811081552?text=${encodeURIComponent(
                  `Hi! I'd like to order ${quantity} × ${product.name} (${selectedWeight.weight}) — ₹${selectedWeight.price * quantity}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                id="quick-whatsapp-order"
                className="flex items-center justify-center gap-2 bg-green-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:bg-green-700 transition-all shadow-xl hover:scale-[1.02] transform"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Quick Order
              </a>
            </div>

            {/* Brewing Instructions */}
            {product.brewingInstructions && (
              <div className="mt-8 p-6 bg-brand-50/50 rounded-2xl border border-brand-100/50">
                <h3 className="font-display text-lg font-semibold text-brand-900 mb-2 flex items-center gap-2">
                  ☕ Brewing Guide
                </h3>
                <p className="text-brand-800/60 text-base leading-relaxed">{product.brewingInstructions}</p>
              </div>
            )}
          </div>

          {/* Desktop Image (Hidden on mobile, stays sticky on left side) */}
          <div className="hidden lg:block relative h-[700px] rounded-[2rem] overflow-hidden shadow-2xl bg-white order-1 sticky top-32">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="50vw"
            />
            
            {/* Elite Tea Image Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.08] mix-blend-overlay">
                <span className="font-display text-6xl md:text-8xl font-black uppercase text-brand-900 transform -rotate-45 whitespace-nowrap">
                  Elite Tea
                </span>
            </div>

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
