import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import FadeIn from '@/components/FadeIn';

export const metadata: Metadata = {
  title: 'Our Sourcing Story',
  description:
    'Discover the story behind Elite Tea — from the misty gardens of Darjeeling to your cup. Learn about our direct sourcing model, zero middlemen guarantee, and commitment to fresh, heritage tea.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/brand-story.png"
          alt="Darjeeling tea gardens"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-900/60 via-brand-900/40 to-brand-900/80" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <span className="text-gold-400 font-semibold text-sm tracking-widest uppercase">The Truth About Tea</span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-3 leading-tight">
            Breaking the Chain. <br />
            <span className="text-gold-gradient">Direct from Darjeeling.</span>
          </h1>
        </div>
      </section>

      {/* Story Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            {/* The Problem */}
            <FadeIn className="mb-16">
              <span className="text-gold-500 font-semibold text-sm tracking-widest uppercase">The Industry Problem</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-900 mt-2 mb-6">
                Why Does Traditional Tea Taste Stale?
              </h2>
              <div className="space-y-4 text-brand-800/70 leading-relaxed">
                <p>
                  Most tea lovers don&apos;t realize that the tea they buy from supermarkets is usually <strong>6 to 12 months old</strong>. Between the tea estate where the leaf is plucked and the cup you drink from, there is a bloated chain of middlemen.
                </p>
                <p>
                  The leaves go from the garden to an auction house, then to national distributors, then regional wholesalers, and finally to retail shelves. By the time it reaches you, the delicate essential oils that give tea its character have evaporated. Worse, the farmers who grew the tea barely see a fraction of what you paid.
                </p>
              </div>
            </FadeIn>

            {/* The Solution */}
            <FadeIn delay={0.1} className="mb-16 bg-white rounded-3xl p-8 sm:p-12 shadow-lg border border-brand-100/30 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl group-hover:bg-gold-400/20 transition-all duration-700" />
              
              <span className="text-gold-500 font-semibold text-sm tracking-widest uppercase relative z-10">Our Solution</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-900 mt-2 mb-8 relative z-10">
                Zero Middlemen. Period.
              </h2>
              
              <div className="grid md:grid-cols-2 gap-12 relative z-10">
                <div className="space-y-6">
                  <p className="text-brand-800/70 leading-relaxed">
                    Elite Tea was founded to break this exact chain. We bypass the auctions and distributors entirely. We built direct relationships with heritage gardens sitting high in the misty altitudes of Darjeeling and Assam.
                  </p>
                  <p className="text-brand-800/70 leading-relaxed text-sm p-4 bg-cream-dark border-l-4 border-gold-500 rounded-r-xl">
                    &quot;When you order from us, you&apos;re buying tea that was plucked, processed, and packed straight from the estate. No warehouse sitting. No blending with old stock.&quot;
                  </p>
                </div>
                
                <div className="flex flex-col justify-center space-y-8 relative">
                  <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-gold-300 via-gold-500 to-green-500" />
                  
                  <div className="relative flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gold-400 flex items-center justify-center text-white shrink-0 z-10 shadow-lg">1</div>
                    <div>
                      <h4 className="font-display font-bold text-brand-900">Darjeeling Estates</h4>
                      <p className="text-sm text-brand-800/60">Tea is plucked at optimum harvest time</p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-white shrink-0 z-10 shadow-lg">2</div>
                    <div>
                      <h4 className="font-display font-bold text-brand-900">Immediate Packaging</h4>
                      <p className="text-sm text-brand-800/60">Processed & sealed to lock in volatile oils</p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white shrink-0 z-10 shadow-lg">3</div>
                    <div>
                      <h4 className="font-display font-bold text-brand-900">Shipped to You</h4>
                      <p className="text-sm text-brand-800/60">Direct via courier, guaranteeing peak freshness</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Churpi Modernized */}
            <FadeIn delay={0.2} className="mb-16">
              <span className="text-gold-500 font-semibold text-sm tracking-widest uppercase">Beyond Tea</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-900 mt-2 mb-6">
                Elite Himalayan Churpi — A Direct Trade Treasure
              </h2>
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-4 text-brand-800/70 leading-relaxed">
                  <p>
                    Our direct-trade philosophy doesn&apos;t stop at tea. High in the majestic Himalayas, indigenous communities have crafted Churpi (hard yak and cow cheese) for centuries.
                  </p>
                  <p>
                    Rather than buying this cultural treasure from commercial aggregators, we source it directly from high-altitude village cooperatives. Sun-dried and aged to perfection, its smoky, tangy flavour pairs beautifully with our robust teas.
                  </p>
                  <p>
                    This direct model means Himalayan farmers receive fair compensation, and you receive an authentic, unadulterated product.
                  </p>
                </div>
                <div className="relative h-[350px] rounded-3xl overflow-hidden shadow-xl border border-brand-100/50">
                  <Image src="/images/churpi.png" alt="Himalayan Churpi" fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="(max-width: 1024px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-brand-900/10" />
                </div>
              </div>
            </FadeIn>

            {/* Values */}
            <FadeIn delay={0.3} className="bg-brand-900 text-white rounded-3xl p-8 sm:p-12 mb-16 relative overflow-hidden">
               {/* Decorative map elements could go here */}
               <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold-400/5 rounded-full blur-3xl pointer-events-none" />
               
              <h2 className="font-display text-3xl font-bold text-center mb-10 relative z-10">
                The Elite <span className="text-gold-gradient">Impact</span>
              </h2>
              <div className="grid sm:grid-cols-2 gap-8 relative z-10">
                {[
                  { icon: '🌱', title: 'Priceless Freshness', desc: 'Taste the nuanced flavour notes that are usually lost to time in warehouse storage.' },
                  { icon: '🤝', title: 'Fair Farmer Pay', desc: 'Cutting out traders allows us to pay estates significantly above auction prices.' },
                  { icon: '✨', title: 'Transparent Origin', desc: 'We know exactly which garden your tea came from. 100% traceability.' },
                  { icon: '📦', title: 'Reduced Footprint', desc: 'Fewer transit legs mean a lower carbon footprint for every cup you enjoy.' },
                ].map((v) => (
                  <div key={v.title} className="flex gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                    <div className="text-3xl shrink-0">{v.icon}</div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-gold-400 mb-1">{v.title}</h3>
                      <p className="text-white/60 text-sm">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* CTA */}
            <FadeIn delay={0.4} className="text-center bg-cream-dark p-12 rounded-3xl border border-brand-100">
              <h2 className="font-display text-3xl font-bold text-brand-900 mb-4">
                Taste the <span className="text-gold-gradient">Direct Difference</span>
              </h2>
              <p className="text-brand-800/60 mb-8 max-w-lg mx-auto">
                Ready to experience Darjeeling tea the way it was meant to be? Explore our freshly sourced collection today.
              </p>
              <Link
                href="/products"
                id="about-cta"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-gold-600 hover:to-gold-700 transition-all transform hover:scale-105 shadow-xl shadow-gold-500/20"
              >
                Shop Direct from Darjeeling
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
