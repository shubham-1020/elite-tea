'use client';

import Link from 'next/link';
import Image from 'next/image';
import { products, testimonials } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import HeroCarousel from '@/components/HeroCarousel';
import FadeIn from '@/components/FadeIn';

export default function HomePage() {
  return (
    <div>
      {/* ─── HERO CAROUSEL ─── */}
      <HeroCarousel />

      {/* ─── MARQUEE BAND ─── */}
      <section className="bg-brand-900 py-4 overflow-hidden border-y border-white/5">
        <div className="marquee-track">
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} className="flex items-center shrink-0">
              {['Premium Quality', 'Zero Middlemen', 'Direct From Darjeeling', 'Hand-Picked', 'Fresh Delivery', '100% Organic', 'Elite Experience'].map((text, i) => (
                <div key={`${setIdx}-${i}`} className="flex items-center shrink-0 mx-6">
                  <span className="text-gold-400/60 text-sm font-medium tracking-widest uppercase whitespace-nowrap">{text}</span>
                  <span className="text-gold-500/30 mx-6">✦</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ─── THE DIRECT PROMISE (REDESIGNED) ─── */}
      <section id="direct-promise" className="py-28 bg-gradient-to-b from-white via-cream/30 to-white relative overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute top-[-200px] right-[-200px] w-[700px] h-[700px] bg-brand-100/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-200px] left-[-200px] w-[600px] h-[600px] bg-gold-100/25 rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <FadeIn direction="up" className="text-center mb-20">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-900/5 backdrop-blur-sm border border-brand-900/10 text-brand-800 font-semibold text-xs tracking-widest uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Farm to Cup — Live
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-900 leading-tight">
              We Eliminated the<br />
              <span className="text-gold-gradient">Middlemen</span> — Forever.
            </h2>
            <p className="text-brand-800/55 max-w-2xl mx-auto mt-6 text-lg leading-relaxed">
              Traditional tea passes through 5+ intermediaries before reaching you. We reduced that to zero. Garden → You. That&apos;s it.
            </p>
          </FadeIn>

          {/* Journey Flow — Horizontal on desktop, vertical on mobile */}
          <FadeIn direction="up" delay={0.15} className="mb-20">
            <div className="relative">
              {/* Connection line */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent -translate-y-1/2 z-0" />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 relative z-10">
                {[
                  { step: '01', title: 'Hand-Picked', subtitle: 'Darjeeling Gardens', icon: '🌿', color: 'from-green-500/10 to-emerald-500/5', border: 'border-green-200/60', accent: 'text-green-600' },
                  { step: '02', title: 'Fresh Sealed', subtitle: 'Within 24 Hours', icon: '📦', color: 'from-amber-500/10 to-orange-500/5', border: 'border-amber-200/60', accent: 'text-amber-600' },
                  { step: '03', title: 'Direct Shipped', subtitle: 'Zero Warehouses', icon: '🚀', color: 'from-blue-500/10 to-indigo-500/5', border: 'border-blue-200/60', accent: 'text-blue-600' },
                  { step: '04', title: 'Your Cup', subtitle: 'Peak Freshness', icon: '☕', color: 'from-gold-500/10 to-amber-500/5', border: 'border-gold-200/60', accent: 'text-gold-600' },
                ].map((item, i) => (
                  <div key={item.step} className={`relative group`}>
                    {/* Arrow connector on mobile */}
                    {i < 3 && (
                      <div className="md:hidden flex justify-center py-2">
                        <svg className="w-5 h-5 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                    )}
                    <div className={`bg-gradient-to-br ${item.color} backdrop-blur-sm border ${item.border} rounded-3xl p-6 sm:p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-500 h-full`}>
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                      <span className={`text-xs font-bold tracking-widest ${item.accent} uppercase`}>Step {item.step}</span>
                      <h3 className="font-display text-xl font-bold text-brand-900 mt-2 mb-1">{item.title}</h3>
                      <p className="text-brand-800/50 text-sm">{item.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Split: Image + Content */}
          <div className="grid lg:grid-cols-2 gap-8 items-stretch mb-16">
            {/* Image Side */}
            <FadeIn direction="left" delay={0.2} className="relative min-h-[400px] lg:min-h-[500px] rounded-[2rem] overflow-hidden shadow-2xl group">
              <Image
                src="/images/hero-bg.png"
                alt="Darjeeling tea gardens at sunrise"
                fill
                loading="lazy"
                quality={80}
                className="object-cover group-hover:scale-105 transition-transform duration-[1500ms]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-brand-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
                <span className="inline-block px-3 py-1 rounded-full bg-gold-500/20 backdrop-blur-sm text-gold-300 text-xs font-semibold tracking-wider uppercase mb-3 border border-gold-400/20">
                  6,000 ft altitude
                </span>
                <h3 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
                  The Darjeeling<br />Standard
                </h3>
                <p className="text-white/70 mt-2 max-w-md text-base">
                  Sourced from the &quot;champagne of teas&quot; region — where the finest leaves on earth are grown.
                </p>
              </div>
            </FadeIn>

            {/* Content Side — Stacked cards */}
            <div className="flex flex-col gap-5">
              <FadeIn direction="right" delay={0.25} className="flex-1 bg-brand-900 rounded-[2rem] p-8 sm:p-10 text-white relative overflow-hidden group shadow-xl">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-display text-2xl font-bold">Fair Pay for Farmers</h3>
                  </div>
                  <p className="text-white/65 leading-relaxed text-base">
                    By cutting out middlemen, we pay our farmers <span className="text-gold-400 font-semibold">30% above</span> traditional auction rates — ensuring sustainable livelihoods for generations.
                  </p>
                </div>
              </FadeIn>

              <FadeIn direction="right" delay={0.35} className="flex-1 bg-white rounded-[2rem] p-8 sm:p-10 relative overflow-hidden group shadow-xl border border-brand-100/50">
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-100/40 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-brand-900">Unmatched Freshness</h3>
                  </div>
                  <p className="text-brand-800/55 leading-relaxed text-base">
                    Our tea reaches you within <span className="text-brand-900 font-semibold">72 hours</span> of plucking. No warehouse. No shelf life countdown. Just peak flavour, every time.
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Trust strip */}
          <FadeIn direction="up" delay={0.4}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: '🛡️', label: 'Easy Returns', sub: '7-Day Policy' },
                { icon: '🚚', label: 'Free Shipping', sub: 'Pan-India' },
                { icon: '🌱', label: '100% Organic', sub: 'Lab Certified' },
                { icon: '💰', label: '10% Prepaid OFF', sub: 'Extra Savings' },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-3 p-4 sm:p-5 rounded-2xl bg-brand-900/[0.03] border border-brand-100/60 hover:border-gold-300/50 hover:bg-gold-50/30 transition-all duration-300 group">
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{badge.icon}</span>
                  <div>
                    <p className="font-semibold text-brand-900 text-sm">{badge.label}</p>
                    <p className="text-brand-800/40 text-xs">{badge.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.5} className="text-center mt-14">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand-900 text-white font-semibold hover:bg-brand-800 transition-all transform hover:scale-105 shadow-lg shadow-brand-900/15 text-sm tracking-wide group"
            >
              Read Our Full Story
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section id="featured-products" className="py-24 bg-cream relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up" className="text-center mb-16">
            <span className="text-gold-500 font-semibold text-sm tracking-widest uppercase">Our Collection</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-brand-900 mt-3 mb-4">
              Handpicked <span className="text-gold-gradient">Elite</span> Teas
            </h2>
            <p className="text-brand-800/55 max-w-2xl mx-auto">
              Each product is carefully selected directly from the gardens and crafted to bring you the finest flavours.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.filter((p) => p.featured).map((product, index) => (
              <FadeIn key={product.id} direction="up" delay={index * 0.1}>
                <ProductCard product={product} />
              </FadeIn>
            ))}
          </div>

          <FadeIn direction="up" delay={0.4} className="text-center mt-14">
            <Link
              href="/products"
              id="view-all-products"
              className="inline-flex items-center gap-2 bg-brand-800 text-white px-8 py-4 rounded-full font-semibold hover:bg-brand-900 transition-all transform hover:scale-105 shadow-lg shadow-brand-900/15"
            >
              View All Products
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ─── WHY ELITE TEA ─── */}
      <section id="why-elite" className="py-24 bg-brand-900 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn direction="up" className="text-center mb-16">
            <span className="text-gold-400 font-semibold text-sm tracking-widest uppercase">Why Choose Us</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mt-3 mb-4">
              The Elite <span className="text-gold-gradient">Difference</span>
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                ),
                title: '100% Natural',
                desc: 'No artificial flavours, colours, or preservatives. Just pure, natural goodness from nature.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6.75h1.5m-1.5 3h1.5m-1.5 3h1.5M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                  </svg>
                ),
                title: 'Zero Middlemen',
                desc: 'Delivered directly from the tea estates to your door, bypassing all auction houses.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
                title: 'Source Verified',
                desc: 'Authentic Darjeeling sourcing, fully transparent origin for every single leaf.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                ),
                title: 'Fresh Delivery',
                desc: 'Packed freshly at the source to lock in the volatile aromatic oils and brisk flavour.',
              },
            ].map((item, index) => (
               <FadeIn
                key={item.title}
                direction="up"
                delay={index * 0.1}
                className="text-center p-8 rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] hover:border-gold-400/20 transition-all duration-500 hover:bg-white/[0.08] group"
              >
                <div className="text-gold-400 mb-5 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-gold-400 mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-gold-100/30 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn direction="up" className="text-center mb-16">
            <span className="text-gold-500 font-semibold text-sm tracking-widest uppercase">Testimonials</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-brand-900 mt-3 mb-4">
              Loved by Tea <span className="text-gold-gradient">Connoisseurs</span>
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, index) => (
              <FadeIn
                key={t.id}
                direction="up"
                delay={index * 0.1}
                className="bg-cream rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-brand-100/40 card-lift"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < t.rating ? 'text-gold-500' : 'text-gray-200'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-brand-800/65 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-brand-200/50">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-inner">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-brand-900 text-sm">{t.name}</p>
                    <p className="text-brand-800/40 text-xs">{t.location}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST BADGES ─── */}
      <section className="py-16 bg-cream-dark border-y border-brand-100/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 items-center">
            {[
              { number: 'Zero', label: 'Middlemen' },
              { number: '4.8', label: 'Average Rating' },
              { number: '100%', label: 'Organic Certified' },
              { number: 'Free', label: 'Pan-India Shipping' },
            ].map((stat, i) => (
              <FadeIn key={stat.label} direction="up" delay={i * 0.1} className="text-center">
                <p className="font-display text-3xl sm:text-4xl font-bold text-gold-gradient">{stat.number}</p>
                <p className="text-brand-800/50 text-sm mt-1">{stat.label}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section id="cta-banner" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg.png"
            alt="Darjeeling tea garden background"
            fill
            loading="lazy"
            quality={60}
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-brand-900/88" />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <FadeIn direction="up">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6">
              Experience the True Taste of <span className="text-gold-gradient">Darjeeling</span>
            </h2>
            <p className="text-white/65 text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
              Skip the middlemen and get farm-fresh teas delivered directly to your doorstep. Order via WhatsApp and use code <span className="text-gold-400 font-semibold">DIRECT15</span> for 15% off your first true garden-to-cup order!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/products"
                id="cta-order-btn"
                className="bg-gradient-to-r from-gold-500 to-gold-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-gold-600 hover:to-gold-700 transition-all transform hover:scale-105 shadow-2xl shadow-gold-500/25"
                aria-label="Shop our direct collection"
              >
                Shop Direct
              </Link>
              <a
                href="https://wa.me/917811081552"
                target="_blank"
                rel="noopener noreferrer"
                id="cta-whatsapp-btn"
                className="flex items-center gap-4 bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-xl"
                aria-label="Chat with us on WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
