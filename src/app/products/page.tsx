'use client';

import { useState } from 'react';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';

const categories = ['All', ...new Set(products.map((p) => p.category))];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  const filtered = products
    .filter((p) => selectedCategory === 'All' || p.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return Number(b.featured) - Number(a.featured);
    });

  return (
    <div className="min-h-screen bg-cream pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-gold-500 font-semibold text-sm tracking-widest uppercase">Shop</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-brand-900 mt-2 mb-4">
            Our <span className="text-gold-gradient">Collection</span>
          </h1>
          <p className="text-brand-800/60 max-w-xl mx-auto">
            From bold Assam CTC to delicate Elite Tea — discover your perfect brew.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`filter-${cat.toLowerCase().replace(/\s/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-800 text-white shadow-lg'
                    : 'bg-white text-brand-800/60 hover:bg-brand-100 border border-brand-200/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            id="sort-products"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-full bg-white border border-brand-200/50 text-brand-800/70 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-brand-800/40">
            <p className="text-xl font-display">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
