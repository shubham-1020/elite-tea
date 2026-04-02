import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PhoneAuth from '@/components/PhoneAuth';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://elite-tea.vercel.app'),
  title: {
    default: 'Elite Tea — Premium Assam Tea | Elite Green Tea | Elite Rose Tea | Himalayan Churpi',
    template: '%s | Elite Tea',
  },
  description:
    'Discover the finest premium teas from Assam. Hand-picked Elite Assam CTC, organic Elite Green Tea, aromatic Elite Rose Tea & authentic Elite Himalayan Churpi. Order directly via WhatsApp. Free shipping across India.',
  keywords: [
    'Assam Tea',
    'Premium Tea',
    'Organic Tea India',
    'Elite Green Tea',
    'Elite Rose Tea',
    'Himalayan Churpi',
    'Elite Assam CTC',
    'Buy Tea Online India',
    'Elite Tea',
    'Best Assam Tea',
    'Northeast India Tea',
    'Loose Leaf Tea',
    'Elite Tea Company',
    'Darjeeling Tea delivery',
  ],
  authors: [{ name: 'Elite Tea' }],
  alternates: {
    canonical: 'https://elite-tea.vercel.app',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Elite Tea — Premium Assam Tea & Himalayan Delicacies',
    description:
      'Hand-picked premium teas from the gardens of Assam. Experience Elite Assam CTC, Elite Green Tea, Elite Rose Tea & Elite Himalayan Churpi.',
    url: 'https://elite-tea.vercel.app',
    siteName: 'Elite Tea',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: '/images/hero-bg.png', width: 1200, height: 630, alt: 'Elite Tea Gardens' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elite Tea — Premium Assam Tea',
    description: 'Hand-picked premium teas from Assam. Order via WhatsApp.',
    images: ['/images/hero-bg.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Elite Tea',
  url: 'https://elite-tea.vercel.app',
  logo: 'https://elite-tea.vercel.app/images/logo.png',
  sameAs: [
    'https://twitter.com/elitetea',
    'https://instagram.com/elitetea',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+917811081552',
    contactType: 'customer service',
    areaServed: 'IN',
    availableLanguage: ['en', 'Hindi'],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://elite-tea.vercel.app/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Products',
      item: 'https://elite-tea.vercel.app/products',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'About',
      item: 'https://elite-tea.vercel.app/about',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-body">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-6 focus:py-3 focus:bg-gold-500 focus:text-brand-900 focus:font-bold focus:rounded-xl focus:shadow-2xl transition-all"
        >
          Skip to main content
        </a>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <PhoneAuth />
            <div className="flex-1 w-full overflow-x-hidden relative">
              <main id="main-content">{children}</main>
            </div>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
