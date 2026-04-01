'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { generateWhatsAppMessage, getWhatsAppUrl } from '@/lib/whatsapp';

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
    subtotal,
    discount,
    total,
  } = useCart();

  const { profile, openAuthModal } = useAuth();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'prepaid' | 'cod'>('prepaid');

  const prepaidDiscount = paymentMethod === 'prepaid' ? Math.round(total * 0.1) : 0;
  const finalTotal = total - prepaidDiscount;

  const handleApplyCoupon = () => {
    const result = applyCoupon(couponInput);
    setCouponMessage(result.message);
    setCouponSuccess(result.success);
    if (result.success) setCouponInput('');
  };

  const handleWhatsAppOrder = () => {
    if (!profile) {
      openAuthModal();
      return;
    }

    const message = generateWhatsAppMessage(
      items,
      subtotal,
      discount,
      finalTotal,
      appliedCoupon?.code,
      profile.name || undefined,
      profile.phone || undefined,
      profile,
      paymentMethod,
      prepaidDiscount
    );
    window.open(getWhatsAppUrl(message), '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream pt-28 pb-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="font-display text-3xl font-bold text-brand-900 mb-4">Your Cart is Empty</h1>
          <p className="text-brand-800/50 mb-8">
            Looks like you haven&apos;t added any teas yet. Explore our collection to find your perfect brew!
          </p>
          <Link
            href="/products"
            id="shop-now-empty"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-8 py-4 rounded-full font-semibold hover:from-gold-600 hover:to-gold-700 transition-all transform hover:scale-105 shadow-xl"
          >
            Explore Teas
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-gold-500 font-semibold text-sm tracking-widest uppercase">Shopping</span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-900 mt-1">
              Your <span className="text-gold-gradient">Cart</span>
            </h1>
          </div>
          <button
            onClick={clearCart}
            id="clear-cart"
            className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedWeight}`}
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-md flex flex-col sm:flex-row gap-4 sm:gap-6 border border-brand-100/30"
              >
                <div className="relative w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-cream shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-display text-lg font-semibold text-brand-900 hover:text-gold-600 transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-brand-800/40 text-sm mt-1">{item.selectedWeight}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-cream rounded-lg border border-brand-200/50 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-3 py-2 text-brand-800/60 hover:bg-brand-100 transition-colors text-sm"
                        >
                          −
                        </button>
                        <span className="px-4 py-2 text-brand-900 font-semibold text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-3 py-2 text-brand-800/60 hover:bg-brand-100 transition-colors text-sm"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-400 hover:text-red-600 transition-colors p-2"
                        aria-label="Remove item"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <span className="text-brand-900 font-bold text-lg">₹{item.selectedPrice * item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-brand-100/30 sticky top-28">
              <h2 className="font-display text-xl font-bold text-brand-900 mb-6">Order Summary</h2>

              {/* User Profile Info */}
              {profile ? (
                <div className="mb-5 p-3 bg-green-50/80 rounded-xl border border-green-200/60">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-green-700 text-sm font-semibold">✅ Signed in</p>
                  </div>
                  <p className="text-green-600 text-xs">{profile.name || 'Guest'} • {profile.phone}</p>
                  {profile.city && (
                    <p className="text-green-600/70 text-xs mt-0.5">📍 {profile.city}{profile.state ? `, ${profile.state}` : ''}</p>
                  )}
                </div>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="w-full mb-5 p-3 bg-gold-50 rounded-xl border border-gold-200/50 text-gold-700 text-sm font-medium hover:bg-gold-100 transition-colors text-center"
                >
                  🔒 Login for faster checkout & delivery tracking
                </button>
              )}

              {/* Coupon */}
              <div className="mb-6">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 p-3 rounded-xl border border-green-200">
                    <div>
                      <p className="text-green-700 text-sm font-semibold">🎉 {appliedCoupon.code}</p>
                      <p className="text-green-600 text-xs">{appliedCoupon.description}</p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-400 hover:text-red-600 text-xs font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Coupon code"
                        id="coupon-input"
                        className="flex-1 px-4 py-2.5 rounded-xl bg-cream border border-brand-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 uppercase"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        id="apply-coupon"
                        className="px-4 py-2.5 bg-brand-800 text-white rounded-xl text-sm font-medium hover:bg-brand-900 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {couponMessage && (
                      <p className={`text-xs mt-2 ${couponSuccess ? 'text-green-600' : 'text-red-500'}`}>
                        {couponMessage}
                      </p>
                    )}
                    <p className="text-brand-800/40 text-xs mt-2">Try: ELITE10, FIRSTORDER, TEA20</p>
                  </div>
                )}
              </div>

              {/* Payment Method Toggle */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-brand-900 mb-3 block">Payment Method</label>
                <div className="grid grid-cols-2 gap-3 bg-cream p-1.5 rounded-2xl border border-brand-200/50">
                  <button
                    onClick={() => setPaymentMethod('prepaid')}
                    className={`py-2.5 rounded-xl text-sm font-semibold transition-all flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'prepaid'
                        ? 'bg-white text-green-700 shadow-md transform scale-[1.02]'
                        : 'text-brand-800/60 hover:text-brand-900'
                    }`}
                  >
                    🚀 Prepaid
                    <span className="text-[10px] font-medium opacity-80 mt-1">Get 10% Extra Off</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('cod')}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                      paymentMethod === 'cod'
                        ? 'bg-white text-brand-900 shadow-md transform scale-[1.02]'
                        : 'text-brand-800/60 hover:text-brand-900'
                    }`}
                  >
                    Cash on Delivery
                  </button>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-brand-800/60 text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 text-sm">
                    <span>Coupon Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                {paymentMethod === 'prepaid' && prepaidDiscount > 0 && (
                  <div className="flex justify-between text-gold-600 font-medium text-sm">
                    <span>Prepaid Bonus (10% Off)</span>
                    <span>-₹{prepaidDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-brand-800/40 text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t border-brand-100 pt-3">
                  <div className="flex justify-between text-brand-900">
                    <span className="font-display text-lg font-bold">Total</span>
                    <span className="font-display text-2xl font-bold">₹{finalTotal}</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Order Button */}
              {profile ? (
                <button
                  onClick={handleWhatsAppOrder}
                  id="whatsapp-order-btn"
                  className="w-full flex items-center justify-center gap-3 bg-green-600 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-green-700 transition-all transform hover:scale-[1.02] shadow-xl"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Order on WhatsApp
                </button>
              ) : (
                <button
                  onClick={openAuthModal}
                  id="checkout-login-btn"
                  className="w-full flex items-center justify-center gap-3 bg-brand-900 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-brand-950 transition-all transform shadow-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Sign in to Checkout
                </button>
              )}

              <p className="text-brand-800/40 text-xs text-center mt-4">
                {profile
                  ? 'Your details & location will be shared for delivery.'
                  : 'Your order will be sent to our WhatsApp. We\'ll confirm and arrange delivery.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
