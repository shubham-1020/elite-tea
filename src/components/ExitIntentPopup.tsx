import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const { openAuthModal } = useAuth();

  useEffect(() => {
    // 1. Recover state from SessionStorage (so we don't annoy them in one sitting)
    const shown = sessionStorage.getItem('elite-exit-intent-shown');
    if (shown) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // 2. Detect cursor leaving the top of the viewport (Exit Intent)
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem('elite-exit-intent-shown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShown]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('FIRSTORDER');
    alert('Code copied! 🎁 Use it at checkout.');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVisible(false)}
            className="absolute inset-0 bg-brand-950/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-gold-400/20"
          >
            {/* Design Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-500/5 rounded-full blur-3xl -ml-20 -mb-20" />

            {/* Content */}
            <div className="relative p-8 sm:p-12 text-center">
              <button
                onClick={() => setIsVisible(false)}
                className="absolute top-6 right-6 text-brand-800/30 hover:text-brand-900 transition-colors"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="text-5xl mb-6">🍵</div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-900 mb-4">
                Wait! Don't leave <span className="text-gold-gradient">Thirsty.</span>
              </h2>
              <p className="text-brand-800/60 text-lg mb-8 leading-relaxed">
                4,000 visitors couldn't resist our Elite Assam blend. Get yours for **15% OFF** right now.
              </p>

              {/* Coupon UI */}
              <div className="bg-brand-50 border-2 border-dashed border-gold-400/30 rounded-2xl p-6 mb-8 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gold-400/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <div className="relative">
                  <span className="text-xs font-bold text-gold-600 uppercase tracking-widest block mb-2">First Order Special</span>
                  <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-brand-200">
                    <span className="font-display text-2xl font-black text-brand-900 tracking-wider">FIRSTORDER</span>
                    <button
                      onClick={handleCopyCode}
                      className="text-gold-600 font-bold hover:text-gold-700 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setIsVisible(false)}
                  className="w-full bg-brand-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-brand-950 transition-all shadow-xl hover:scale-[1.02] transform"
                >
                  Okay, Show Me The Tea!
                </button>
                <button
                   onClick={() => {
                     setIsVisible(false);
                     openAuthModal();
                   }}
                   className="text-brand-800/40 text-sm font-medium hover:text-brand-900 transition-colors"
                >
                  No thanks, I'll pay full price.
                </button>
              </div>

              {/* Trust Badge */}
              <div className="mt-8 flex items-center justify-center gap-2 text-[10px] uppercase font-bold text-brand-800/30 tracking-[0.2em]">
                <span className="w-8 h-[1px] bg-brand-200" />
                Trusted by 4,000+ Sippers
                <span className="w-8 h-[1px] bg-brand-200" />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
