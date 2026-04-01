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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <PhoneAuth />
            <div className="flex-1 w-full overflow-x-hidden relative">
              <main>{children}</main>
            </div>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
