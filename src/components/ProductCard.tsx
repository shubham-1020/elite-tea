'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const ref = useRef<HTMLAnchorElement>(null);
  
  // Create a subtle parallax effect based on scroll position
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  const handleAddToCart = () => {
    addToCart(product, product.weightOptions[0].weight, product.weightOptions[0].price);
  };

  return (
    <div
      id={`product-card-${product.slug}`}
      className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-brand-100/20 hover:border-gold-400/20 card-lift"
    >
      {/* Image with Parallax */}
      <Link href={`/products/${product.slug}`} className="block relative h-72 sm:h-64 overflow-hidden bg-cream" ref={ref}>
        <motion.div style={{ y, height: '130%', top: '-15%' }} className="absolute inset-x-0 w-full transform origin-center will-change-transform">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </motion.div>
        
        {/* Elite Tea Image Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.1] mix-blend-overlay">
            <span className="font-display text-4xl font-black uppercase text-brand-900 transform -rotate-45 whitespace-nowrap">
              Elite Tea
            </span>
        </div>

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Tags */}
        {product.tags.includes('bestseller') && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-gold-500/20">
            Bestseller
          </div>
        )}
        {product.originalPrice && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </div>
        )}

        {/* Quick View on hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <span className="block w-full text-center text-white text-sm font-semibold tracking-wide bg-brand-900/70 backdrop-blur-md rounded-xl py-3 shadow-xl">
            View Details →
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-6">
        <span className="text-gold-500 text-xs font-semibold tracking-[0.15em] uppercase">
          {product.category}
        </span>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-brand-900 mt-2 mb-2 group-hover:text-gold-600 transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>
        <p className="text-brand-800/60 text-base sm:text-sm mb-4 line-clamp-2 leading-relaxed">{product.shortDescription}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-gold-500' : 'text-gray-200'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-brand-800/40 text-sm ml-1">({product.reviews})</span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-end justify-between">
          <div>
            <span className="text-brand-900 font-bold text-2xl sm:text-xl relative top-0.5">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-brand-800/40 line-through text-base sm:text-sm ml-2">₹{product.originalPrice}</span>
            )}
            <span className="text-brand-800/50 text-sm block mt-1">{product.weight}</span>
          </div>
          <button
            onClick={handleAddToCart}
            id={`add-to-cart-${product.slug}`}
            className="bg-gradient-to-r from-brand-700 to-brand-800 text-white p-4 rounded-xl hover:from-brand-800 hover:to-brand-900 transition-all transform hover:scale-110 shadow-lg shadow-brand-900/15 active:scale-95 flex items-center justify-center gap-2"
            aria-label={`Add ${product.name} to cart`}
          >
            <span className="font-semibold text-sm hidden sm:block">Add</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
