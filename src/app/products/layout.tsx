import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Collection',
  description: 'Browse our premium collection of Assam CTC, Green Tea, Rose Tea, and Himalayan Churpi. Freshly sourced and delivered to your doorstep.',
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
