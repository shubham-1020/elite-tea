'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FallingLeaves from './FallingLeaves';

const slides = [
  {
    image: '/images/assam-ctc.png',
    tag: 'Bestseller',
    title: 'Elite Assam CTC',
    subtitle: 'Bold, malty & full-bodied — directly sourced premium CTC.',
    accent: '#d4a843',
  },
  {
    image: '/images/green-tea.png',
    tag: 'Wellness',
    title: 'Elite Green Tea',
    subtitle: 'Light, refreshing & antioxidant-rich — your daily wellness ritual.',
    accent: '#4ade80',
  },
  {
    image: '/images/rose-tea.png',
    tag: 'Premium',
    title: 'Elite Rose Tea',
    subtitle: 'Floral, aromatic & luxurious — romance in every sip.',
    accent: '#f472b6',
  },
  {
    image: '/images/brand-story.png',
    tag: 'Heritage',
    title: 'From Darjeeling\'s Highest Peaks',
    subtitle: 'Handpicked from the finest tea estates, bypassing all middlemen.',
    accent: '#d4a843',
  },
];

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number>(0);

  // Scroll-driven Apple-style transform values
  const [scrollValues, setScrollValues] = useState({
    scale: 1,
    borderRadius: 0,
    opacity: 1,
    imageScale: 1,
    translateY: 0,
  });

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % slides.length);
  }, []);

  // Auto-play
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  // Apple-style scroll handler with RAF for 120Hz smoothness
  useEffect(() => {
    let lastScrollY = 0;

    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (scrollY === lastScrollY) return;
        lastScrollY = scrollY;

        const vh = window.innerHeight;
        // Progress from 0 (top) to 1 (scrolled one full viewport)
        const progress = Math.min(scrollY / (vh * 0.8), 1);

        // Smooth easing (cubic ease-out)
        const eased = 1 - Math.pow(1 - progress, 3);

        setScrollValues({
          // Scale from 1.0 → 0.88 as you scroll
          scale: 1 - eased * 0.12,
          // Border radius from 0 → 40px
          borderRadius: eased * 40,
          // Content fades from 1 → 0
          opacity: 1 - eased * 1.2,
          // Background image zooms in slightly for parallax
          imageScale: 1 + eased * 0.15,
          // Slight upward drift for parallax depth
          translateY: eased * -30,
        });
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-visible"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ perspective: '1200px' }}
    >
      {/* Scroll-driven wrapper — the Apple magic happens here */}
      <div
        className="absolute inset-0 overflow-hidden will-change-transform"
        style={{
          transform: `scale(${scrollValues.scale}) translateY(${scrollValues.translateY}px)`,
          borderRadius: `${scrollValues.borderRadius}px`,
          transition: 'border-radius 0.05s linear',
        }}
      >
        {/* Background Images with parallax zoom */}
        {slides.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700 ease-out"
            style={{ opacity: i === active ? 1 : 0 }}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover will-change-transform"
              style={{
                transform: `scale(${i === active ? scrollValues.imageScale : 1.05})`,
                filter: i === active ? 'none' : 'blur(4px)',
                transition: 'filter 0.7s ease-out, transform 0.7s ease-out'
              }}
              sizes="100vw"
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
              quality={80}
            />
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-brand-900/75 via-brand-900/50 to-brand-900/85" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-900/40 to-transparent" />
          </div>
        ))}

        {/* Decorative floating leaves */}
        <FallingLeaves />
      </div>

      {/* Content — fades out on scroll */}
      <div
        className="relative z-10 text-center px-4 max-w-4xl mx-auto will-change-transform"
        style={{
          opacity: Math.max(scrollValues.opacity, 0),
          transform: `translateY(${scrollValues.translateY * 0.5}px)`,
        }}
      >
        {/* Animated Tag */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/8 backdrop-blur-md border border-white/15 mb-8 animate-fade-in">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: slides[active].accent }}
          />
          <span className="text-white/80 text-sm font-medium tracking-widest uppercase">
            {slides[active].tag}
          </span>
        </div>

        {/* Title (Stagger 1) */}
        <h1
          key={`title-${active}`}
          className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.1] mb-6 animate-fade-in"
          style={{ animationDelay: '30ms' }}
        >
          {slides[active].title.includes('Elite') ? (
            <>
              <span className="text-gold-gradient">{slides[active].title.split(' ').slice(0, 1).join(' ')}</span>
              {' '}
              {slides[active].title.split(' ').slice(1).join(' ')}
            </>
          ) : (
            slides[active].title
          )}
        </h1>

        {/* Subtitle (Stagger 2) */}
        <p
          key={`sub-${active}`}
          className="text-white/65 text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-fade-in leading-relaxed"
          style={{ animationDelay: '80ms' }}
        >
          {slides[active].subtitle}
        </p>

        {/* CTAs (Stagger 3) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '130ms' }}>
          <Link
            href="/products"
            id="hero-order-btn"
            className="group flex items-center gap-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-gold-600 hover:to-gold-700 transition-all transform hover:scale-105 active:scale-[0.97] shadow-2xl shadow-gold-500/25"
          >
            Explore Our Teas
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/about"
            id="hero-story-btn"
            className="text-white/80 hover:text-white border border-white/25 hover:border-white/50 px-8 py-4 rounded-full text-lg font-medium transition-all backdrop-blur-sm hover:bg-white/5"
          >
            Our Story
          </Link>
        </div>
      </div>

      {/* Slide Indicators */}
      <div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-20"
        style={{ opacity: Math.max(scrollValues.opacity, 0) }}
      >
        {slides.map((slide, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="group relative flex flex-col items-center gap-2"
            aria-label={`Go to slide: ${slide.title}`}
          >
            <div className={`h-1 rounded-full transition-all duration-500 ${
              i === active ? 'w-10 bg-gold-400' : 'w-4 bg-white/30 group-hover:bg-white/50'
            }`}>
              {i === active && (
                <div
                  className="h-full bg-gold-300 rounded-full"
                  style={{
                    animation: 'dot-progress 5s linear',
                    width: '100%',
                  }}
                />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-24 left-1/2 transform -translate-x-1/2 animate-bounce z-20"
        style={{ opacity: Math.max(scrollValues.opacity * 0.4, 0) }}
      >
        <svg className="w-5 h-8" fill="none" stroke="white" viewBox="0 0 20 32" strokeWidth="1.5">
          <rect x="1" y="1" width="18" height="30" rx="9" />
          <circle cx="10" cy="10" r="2.5" fill="white" className="animate-pulse" />
        </svg>
      </div>
    </section>
  );
}
