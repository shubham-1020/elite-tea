'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  signInWithGoogle,
  signInWithApple,
  setupRecaptcha,
  sendOTP,
  verifyOTP,
} from '@/lib/firebase';
import type { ConfirmationResult } from '@/lib/firebase';

type Step = 'choose' | 'phone-enter' | 'phone-otp' | 'details';

export default function PhoneAuth() {
  const { isAuthModalOpen, closeAuthModal, updateProfile, demoLogin, isDemoMode } = useAuth();
  const [step, setStep] = useState<Step>('choose');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationAddress, setLocationAddress] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [otpTimer, setOtpTimer] = useState(0);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  // Reset on modal close
  useEffect(() => {
    if (!isAuthModalOpen) {
      setStep('choose');
      setError('');
      setLoading(false);
      setOtp('');
      setConfirmationResult(null);
      setOtpTimer(0);
    }
  }, [isAuthModalOpen]);

  // OTP countdown timer
  useEffect(() => {
    if (otpTimer <= 0) return;
    const interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Fetch City & State from Pincode
  useEffect(() => {
    if (pincode.length === 6) {
      const fetchLocation = async () => {
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
          const data = await res.json();
          if (data && data[0] && data[0].Status === 'Success') {
            const postOffice = data[0].PostOffice[0];
            if (postOffice) {
              setCity(postOffice.District || postOffice.Block || '');
              setState(postOffice.State || '');
            }
          }
        } catch (error) {
          console.error("Failed to fetch pincode details:", error);
        }
      };
      
      const timeoutId = setTimeout(fetchLocation, 600); // debounce API call
      return () => clearTimeout(timeoutId);
    }
  }, [pincode]);

  // ── Google Sign In ──
  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    if (isDemoMode) {
      setTimeout(() => {
        setName('Demo User');
        setEmail('demo@elitetea.in');
        setStep('details');
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      const user = await signInWithGoogle();
      if (user) {
        setName(user.displayName || '');
        setEmail(user.email || '');
        if (user.phoneNumber) {
          setPhone(user.phoneNumber.replace('+91', ''));
        }
        setStep('details');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Google sign-in failed.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ── Apple Sign In ──
  const handleAppleSignIn = async () => {
    setError('');
    setLoading(true);

    if (isDemoMode) {
      setTimeout(() => {
        setName('Apple Demo');
        setEmail('apple@elitetea.in');
        setStep('details');
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      const user = await signInWithApple();
      if (user) {
        setName(user.displayName || '');
        setEmail(user.email || '');
        if (user.phoneNumber) {
          setPhone(user.phoneNumber.replace('+91', ''));
        }
        setStep('details');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Apple sign-in failed.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ── Phone: Send OTP ──
  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setError('');
    setLoading(true);

    if (isDemoMode) {
      setTimeout(() => {
        setStep('phone-otp');
        setOtpTimer(30);
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      // Setup invisible reCAPTCHA
      setupRecaptcha('recaptcha-container');

      const result = await sendOTP(phone);
      if (result) {
        setConfirmationResult(result);
        setStep('phone-otp');
        setOtpTimer(30);
      } else {
        setError('Failed to send OTP. Please check your phone number.');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to send OTP.';
      if (errorMsg.includes('too-many-requests')) {
        setError('Too many attempts. Please wait a few minutes and try again.');
      } else if (errorMsg.includes('invalid-phone-number')) {
        setError('Invalid phone number. Please check and try again.');
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Phone: Verify OTP ──
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setError('');
    setLoading(true);

    if (isDemoMode) {
      if (otp === '123456') {
        demoLogin(phone);
        setStep('details');
        setLoading(false);
      } else {
        setError('Demo mode: use OTP 123456');
        setLoading(false);
      }
      return;
    }

    try {
      if (!confirmationResult) {
        setError('Session expired. Please request a new OTP.');
        setStep('phone-enter');
        return;
      }

      const user = await verifyOTP(confirmationResult, otp);
      if (user) {
        setName(user.displayName || '');
        setEmail(user.email || '');
        setStep('details');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Invalid OTP.';
      if (errorMsg.includes('invalid-verification-code')) {
        setError('Wrong OTP. Please check and try again.');
      } else if (errorMsg.includes('code-expired')) {
        setError('OTP expired. Please request a new one.');
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Save Profile ──
  const handleSaveProfile = async () => {
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    if (!address.trim() || !pincode.trim() || !city.trim() || !state.trim()) {
      setError('Please fill out your complete address details (Address, Pincode, City, State)');
      return;
    }
    if (pincode.length !== 6) {
      setError('Please enter a valid 6-digit Pincode');
      return;
    }

    setError('');
    setLoading(true);

    if (isDemoMode && step === 'details') {
      demoLogin(phone);
    }

    try {
      await updateProfile({
        phone: phone.startsWith('+91') ? phone : `+91${phone}`,
        name: name.trim(),
        email: email.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        latitude: coords?.lat || null,
        longitude: coords?.lng || null,
        locationAddress,
      });

      closeAuthModal();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save profile. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ── Get User Location ──
  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          if (data.display_name) {
            setLocationAddress(data.display_name);
            const addr = data.address;
            if (addr) {
              if (addr.city || addr.town || addr.village) setCity(addr.city || addr.town || addr.village);
              if (addr.state) setState(addr.state);
              if (addr.postcode) setPincode(addr.postcode);
              const road = [addr.road, addr.neighbourhood, addr.suburb].filter(Boolean).join(', ');
              if (road) setAddress(road);
            }
          }
        } catch {
          setLocationAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        }
        setLocationLoading(false);
      },
      (err) => {
        setLocationLoading(false);
        if (err.code === 1) {
          setError('Location access denied. Please enable location permissions.');
        } else {
          setError('Unable to get your location. Please enter manually.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // Helper: step titles
  const getTitle = () => {
    switch (step) {
      case 'choose': return 'Welcome to Elite Tea';
      case 'phone-enter': return 'Login with Phone';
      case 'phone-otp': return 'Verify OTP';
      case 'details': return 'Complete Your Profile';
    }
  };

  const getSubtitle = () => {
    switch (step) {
      case 'choose': return 'Sign in to continue shopping';
      case 'phone-enter': return 'We\'ll send a verification code via SMS';
      case 'phone-otp': return `Code sent to +91 ${phone}`;
      case 'details': return 'Add your details for fast checkout';
    }
  };

  const getIcon = () => {
    switch (step) {
      case 'choose': return '🔑';
      case 'phone-enter': return '📱';
      case 'phone-otp': return '🔢';
      case 'details': return '👤';
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 modal-overlay bg-black/40 backdrop-blur-sm" onClick={closeAuthModal}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-brand-900 p-6 text-center relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Back button for sub-steps */}
          {step !== 'choose' && (
            <button
              onClick={() => {
                if (step === 'phone-otp') setStep('phone-enter');
                else if (step === 'phone-enter') setStep('choose');
                else if (step === 'details') setStep('choose');
                setError('');
              }}
              className="absolute top-4 left-4 text-white/50 hover:text-white transition-colors"
              aria-label="Back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">{getIcon()}</span>
          </div>

          <h2 className="font-display text-2xl font-bold text-white">{getTitle()}</h2>
          <p className="text-white/60 text-sm mt-1">{getSubtitle()}</p>

          {isDemoMode && step === 'choose' && (
            <div className="mt-3 px-3 py-1.5 bg-gold-500/20 rounded-full inline-block">
              <span className="text-gold-300 text-xs font-medium">✨ Demo Mode — Quick Login</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Invisible reCAPTCHA container */}
          <div id="recaptcha-container" ref={recaptchaContainerRef} />

          {/* ── STEP 1: Choose Login Method ── */}
          {step === 'choose' && (
            <div className="space-y-3 py-4">
              {/* Google */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-sm"
              >
                {loading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                  </svg>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>

              {/* Apple */}
              <button
                onClick={handleAppleSignIn}
                disabled={loading}
                className="w-full py-3.5 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-sm"
              >
                {loading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                  </svg>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.46-3.06-.4C2.79 15.253 3.513 7.59 7.05 7.37c1.3.066 2.45.86 3.12.86.72 0 1.95-.87 3.35-.74 1.5.093 2.887.778 3.766 1.96-3.267 1.838-2.737 6.22 0 7.37-1.127 2.15-1.848 3.53-2.247 4.14M12.03 7.25c-.15-2.24 1.82-4.22 4-4.25.13 2.4-2.14 4.41-4 4.25"/>
                    </svg>
                    Continue with Apple
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-2">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Phone OTP */}
              <button
                onClick={() => { setStep('phone-enter'); setError(''); }}
                disabled={loading}
                className="w-full py-3.5 bg-brand-50 border border-brand-200 text-brand-900 rounded-xl font-semibold hover:bg-brand-100 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Continue with Phone (SMS)
              </button>

              <p className="text-center text-xs text-brand-800/40 mt-2">
                By continuing, you agree to our Terms of Service & Privacy Policy
              </p>
            </div>
          )}

          {/* ── STEP 2: Enter Phone Number ── */}
          {step === 'phone-enter' && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-xs font-semibold text-brand-800/60 mb-1.5 block">Phone Number</label>
                <div className="flex gap-2">
                  <div className="flex items-center px-4 py-3 bg-cream rounded-xl border border-brand-200/50 text-brand-800 font-semibold text-sm shrink-0">
                    🇮🇳 +91
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10-digit number"
                    className="flex-1 px-4 py-3 bg-cream rounded-xl border border-brand-200/50 text-base focus:outline-none focus:ring-2 focus:ring-gold-400 text-brand-900 font-medium tracking-wider"
                    maxLength={10}
                    autoFocus
                  />
                </div>
              </div>

              <button
                onClick={handleSendOTP}
                disabled={loading || phone.length !== 10}
                className="w-full py-3.5 bg-brand-800 text-white rounded-xl font-semibold hover:bg-brand-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                    </svg>
                    Sending OTP...
                  </>
                ) : (
                  'Send Verification Code'
                )}
              </button>

              <p className="text-center text-xs text-brand-800/40">
                Standard SMS charges may apply
              </p>
            </div>
          )}

          {/* ── STEP 3: Enter OTP ── */}
          {step === 'phone-otp' && (
            <div className="space-y-5 py-4">
              <div>
                <label className="text-xs font-semibold text-brand-800/60 mb-2 block text-center">
                  Enter the 6-digit code sent to your phone
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="● ● ● ● ● ●"
                  className="w-full px-4 py-4 bg-cream rounded-xl border border-brand-200/50 text-center text-2xl tracking-[0.6em] focus:outline-none focus:ring-2 focus:ring-gold-400 text-brand-900 font-bold"
                  maxLength={6}
                  autoFocus
                />
              </div>

              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className="w-full py-3.5 bg-brand-800 text-white rounded-xl font-semibold hover:bg-brand-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                    </svg>
                    Verifying...
                  </>
                ) : (
                  'Verify & Continue'
                )}
              </button>

              {/* Resend timer */}
              <div className="text-center">
                {otpTimer > 0 ? (
                  <p className="text-sm text-brand-800/40">
                    Resend code in <span className="font-bold text-brand-800">{otpTimer}s</span>
                  </p>
                ) : (
                  <button
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="text-sm font-semibold text-gold-600 hover:text-gold-700 transition-colors disabled:opacity-50"
                  >
                    Resend Code
                  </button>
                )}
              </div>

              {isDemoMode && (
                <p className="text-center text-xs text-brand-800/30 bg-gold-50 p-2 rounded-lg">
                  💡 Demo mode: use code <span className="font-bold">123456</span>
                </p>
              )}
            </div>
          )}

          {/* ── STEP 4: User Details ── */}
          {step === 'details' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-brand-800/60 mb-1 block">Phone Number *</label>
                <div className="flex gap-2">
                  <div className="flex items-center px-4 py-3 bg-cream rounded-xl border border-brand-200/50 text-brand-800 font-medium text-sm shrink-0">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit number"
                    className="flex-1 px-4 py-2.5 bg-cream rounded-xl border border-brand-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 text-brand-900"
                    maxLength={10}
                    autoFocus={!phone}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-brand-800/60 mb-1 block">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2.5 bg-cream rounded-xl border border-brand-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 text-brand-900"
                  required
                />
              </div>

              {/* Location Button */}
              <div>
                <button
                  onClick={getLocation}
                  disabled={locationLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors disabled:opacity-50 mt-2 mb-2"
                >
                  {locationLoading ? (
                    'Getting your location...'
                  ) : (
                    <>
                      📍 {locationAddress ? 'Location captured — Tap to refresh' : 'Autofill using GPS'}
                    </>
                  )}
                </button>
                {locationAddress && (
                  <p className="text-[11px] text-green-600 mt-1 px-1 truncate max-w-sm">
                    ✅ {locationAddress}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-brand-800/60 mb-1 block">Complete Address *</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House/Flat No., Building Name, Street, Area"
                  rows={2}
                  className="w-full px-4 py-2.5 bg-cream rounded-xl border border-brand-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 text-brand-900 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-brand-800/60 mb-1 block">Pincode *</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="6-digit PIN"
                    maxLength={6}
                    className="w-full px-4 py-2.5 bg-cream rounded-xl border border-brand-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 text-brand-900"
                    required
                  />
                  {pincode.length === 6 && city && (
                     <span className="text-[10px] text-green-600 mt-1 block px-1">✓ Area Auto-fetched</span>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-brand-800/60 mb-1 block">City *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City / District"
                    className="w-full px-4 py-2.5 bg-cream rounded-xl border border-brand-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 text-brand-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-brand-800/60 mb-1 block">State *</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    className="w-full px-4 py-2.5 bg-cream rounded-xl border border-brand-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 text-brand-900"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-brand-800/60 mb-1 block">Email (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="For order updates"
                    className="w-full px-4 py-2.5 bg-cream rounded-xl border border-brand-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 text-brand-900"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                className="w-full py-3.5 bg-brand-800 text-white rounded-xl font-semibold hover:bg-brand-900 transition-all flex items-center justify-center gap-2 mt-2"
              >
                Save & Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
