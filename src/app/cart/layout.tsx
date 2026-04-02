import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Cart',
  description: 'View your selected premium teas. Secure checkout and fast delivery across India.',
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
