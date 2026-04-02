'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { itemCount } = useCart();
  const { profile, openAuthModal, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [isMobileScreen, setIsMobileScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobileScreen(window.innerWidth < 768);
    handleResize(); // Set initial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount to handle initial scroll state (e.g., refresh halfway down page)
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  // Close profile menu on outside click
  useEffect(() => {
    if (!showProfileMenu) return;
    const handler = () => setShowProfileMenu(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [showProfileMenu]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/about', label: 'Our Story' },
  ];

  return (
    <>
      <motion.nav
        layout
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          top: isMobileScreen ? 8 : (isScrolled ? 12 : 24),
          left: isMobileScreen ? 12 : (isScrolled ? 12 : 24),
          right: isMobileScreen ? 12 : (isScrolled ? 12 : 24),
          maxWidth: isScrolled ? '900px' : '1200px',
          borderRadius: 9999,
          backgroundColor: isScrolled ? 'rgba(6, 18, 10, 0.85)' : 'rgba(6, 18, 10, 0.25)',
          borderColor: isScrolled ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
        }}
        transition={{
          y: { type: "spring", stiffness: 150, damping: 22, mass: 1 },
          opacity: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          default: { type: "spring", stiffness: 260, damping: 30, mass: 1 }
        }}
        className={`fixed z-[100] mx-auto border backdrop-blur-2xl ${isScrolled ? 'shadow-[0_8px_32px_rgba(0,0,0,0.4)]' : ''}`}
        id="main-nav"
      >
        <motion.div 
          layout
          className="mx-auto flex items-center justify-between w-full"
          animate={{
            paddingTop: isScrolled ? '0.4rem' : '0.8rem',
            paddingBottom: isScrolled ? '0.4rem' : '0.8rem',
            paddingLeft: isScrolled ? '0.6rem' : '1.2rem',
            paddingRight: isScrolled ? '0.6rem' : '1.2rem',
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" id="nav-logo">
            <motion.div 
              layout
              className="relative rounded-full overflow-hidden border-2 border-gold-400/50 group-hover:border-gold-400 transition-colors shadow-lg shadow-gold-400/10 shrink-0"
              animate={{
                width: isScrolled ? 36 : 44,
                height: isScrolled ? 36 : 44,
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image src="/images/logo.png" alt="Elite Tea Logo" fill className="object-cover" sizes="48px" />
            </motion.div>
            <div className="flex flex-col">
              <motion.span 
                layout
                className="font-display font-bold text-white tracking-wider leading-none"
                animate={{
                  fontSize: isScrolled ? '1rem' : '1.125rem',
                }}
                transition={{ duration: 0.4 }}
              >
                Elite <span className="text-gold-gradient">Tea</span>
              </motion.span>
              <motion.span 
                layout
                className="text-white/30 tracking-[0.25em] uppercase font-medium hidden sm:block origin-left"
                animate={{
                  fontSize: isScrolled ? '8px' : '9px',
                  opacity: isScrolled ? 0.8 : 1
                }}
                transition={{ duration: 0.4 }}
              >
                Premium Darjeeling Tea
              </motion.span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                id={`nav-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                className="relative px-4 py-2 text-white/75 hover:text-white font-medium text-sm tracking-wide transition-all duration-300 rounded-lg hover:bg-white/5 group"
              >
                {link.label}
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-gold-400 to-gold-500 group-hover:w-[60%] transition-all duration-300 rounded-full" />
              </Link>
            ))}

            {/* Cart */}
            <Link
              href="/cart"
              id="nav-cart"
              className="relative px-4 py-2 text-white/75 hover:text-white font-medium text-sm tracking-wide transition-all duration-300 rounded-lg hover:bg-white/5 group ml-1 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-0.5 right-0.5 bg-gold-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-lg shadow-gold-500/30">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Auth */}
            {profile ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfileMenu(!showProfileMenu);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 hover:bg-white/15 backdrop-blur-sm border border-white/10 transition-all"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-inner">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : '👤'}
                  </div>
                  <span className="text-white/80 text-sm font-medium hidden sm:block max-w-[80px] truncate">
                    {profile.name || 'Profile'}
                  </span>
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div 
                      className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white rounded-2xl shadow-2xl border border-brand-100/50 overflow-hidden py-2"
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 py-3 border-b border-brand-100/50">
                        <p className="text-brand-900 font-semibold text-sm truncate">{profile.name || 'Guest'}</p>
                        <p className="text-brand-800/40 text-xs truncate">{profile.phone}</p>
                        {profile.locationAddress && (
                          <p className="text-brand-800/30 text-xs truncate mt-0.5">📍 {profile.city || profile.locationAddress}</p>
                        )}
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-brand-800/70 hover:bg-cream text-sm transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </Link>
                      <Link
                        href="/cart"
                        className="flex items-center gap-3 px-4 py-2.5 text-brand-800/70 hover:bg-cream text-sm transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                        </svg>
                        My Cart
                      </Link>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          logout();
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 text-sm w-full transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-sm font-medium transition-colors"
                id="nav-login-btn"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">Login</span>
              </button>
            )}

            {/* Order CTA */}
            <Link
              href="/products"
              id="nav-order-btn"
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-gold-400 to-gold-500 text-brand-900 px-5 py-2 rounded-full text-sm font-bold shadow-lg hover:shadow-gold-500/25 transition-all transform hover:scale-105"
            >
              Order Now
            </Link>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 md:hidden">
              <Link
                href="/cart"
                className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                aria-label="View Cart"
              >
                <svg className="w-5.5 h-5.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-[10px] font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-1 shadow-lg">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                id="mobile-menu-btn"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="relative w-9 h-9 flex flex-col justify-center items-center gap-1.5 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Toggle menu"
              >
                <span
                  className={`block w-5 h-[1.5px] bg-white transition-all origin-center duration-300 ${
                    isMobileOpen ? 'rotate-45 translate-y-[4.5px]' : ''
                  }`}
                />
                <span
                  className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${
                    isMobileOpen ? 'opacity-0 scale-0' : ''
                  }`}
                />
                <span
                  className={`block w-5 h-[1.5px] bg-white transition-all origin-center duration-300 ${
                    isMobileOpen ? '-rotate-45 -translate-y-[4.5px]' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-[110] md:hidden transition-all duration-300 ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsMobileOpen(false)} />
        <div
          className={`absolute right-0 top-0 h-full w-80 bg-gradient-to-b from-brand-900 to-brand-800 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${
            isMobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-between items-center p-6 border-b border-white/10">
            <span className="text-white font-display text-xl font-bold">Menu</span>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-2">
            {/* User info in mobile */}
            {profile && (
              <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : '👤'}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{profile.name || 'Guest'}</p>
                    <p className="text-white/40 text-xs">{profile.phone}</p>
                  </div>
                </div>
              </div>
            )}

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className="text-white/75 hover:text-white font-display text-lg tracking-wide transition-colors p-3 rounded-xl hover:bg-white/5 active:bg-white/10"
              >
                {link.label}
              </Link>
            ))}

            {profile && (
              <Link
                href="/profile"
                onClick={() => setIsMobileOpen(false)}
                className="text-white/75 hover:text-white font-display text-lg tracking-wide transition-colors p-3 rounded-xl hover:bg-white/5 active:bg-white/10 sm:hidden"
              >
                My Profile
              </Link>
            )}

            <Link
              href="/cart"
              onClick={() => setIsMobileOpen(false)}
              className="text-white/75 hover:text-white font-display text-lg tracking-wide transition-colors p-3 rounded-xl hover:bg-white/5 active:bg-white/10 flex items-center justify-between"
            >
              Cart
              {itemCount > 0 && (
                <span className="bg-gold-500 text-brand-900 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            <div className="my-4 border-t border-white/10" />

            {!profile ? (
              <button
                onClick={() => {
                  setIsMobileOpen(false);
                  openAuthModal();
                }}
                className="flex items-center gap-3 text-gold-400 hover:text-gold-300 font-display text-lg tracking-wide transition-colors p-3 rounded-xl hover:bg-white/5 active:bg-white/10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Login / Sign Up
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsMobileOpen(false);
                  logout();
                }}
                className="flex items-center gap-3 text-red-400 hover:text-red-300 text-lg tracking-wide transition-colors p-3 rounded-xl hover:bg-white/5 active:bg-white/10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            )}

            <Link
              href="/products"
              onClick={() => setIsMobileOpen(false)}
              className="mt-6 bg-gradient-to-r from-gold-400 to-gold-500 text-brand-900 px-6 py-3.5 rounded-full text-center font-bold shadow-lg shadow-gold-500/20 active:scale-95 transition-transform"
            >
              Order Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
