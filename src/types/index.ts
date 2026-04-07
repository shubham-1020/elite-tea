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

export interface Address {
  id: string;
  label: string; // e.g. "Home", "Work"
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface UserProfile {
  uid: string;
  phone: string;
  name: string;
  email: string;
  addresses: Address[];
  selectedAddressId: string | null;
  // Legacy fields for migration
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: number | null;
  longitude?: number | null;
  locationAddress?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  text: string;
  rating: number;
  avatar: string;
}
