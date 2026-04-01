export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  weight: string;
  weightOptions: { weight: string; price: number }[];
  image: string;
  images: string[];
  tags: string[];
  brewingInstructions?: string;
  inStock: boolean;
  featured: boolean;
  rating: number;
  reviews: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedWeight: string;
  selectedPrice: number;
}

export interface CouponCode {
  code: string;
  discount: number; // percentage
  minOrder: number;
  description: string;
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  text: string;
  rating: number;
  avatar: string;
}
