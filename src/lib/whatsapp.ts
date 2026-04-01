import { CartItem } from '@/types';
import { UserProfile } from '@/context/AuthContext';

const WHATSAPP_NUMBER = '917811081552';

export function generateWhatsAppMessage(
  items: CartItem[],
  subtotal: number,
  discount: number,
  total: number,
  couponCode?: string,
  customerName?: string,
  customerPhone?: string,
  profile?: UserProfile | null,
  paymentMethod?: 'prepaid' | 'cod',
  prepaidDiscount?: number

): string {
  let message = `🍵 *New Order — Elite Tea*\n`;
  message += `━━━━━━━━━━━━━━━━━━\n\n`;

  items.forEach((item, index) => {
    message += `${index + 1}. *${item.product.name}*\n`;
    message += `   Weight: ${item.selectedWeight}\n`;
    message += `   Qty: ${item.quantity}\n`;
    message += `   Price: ₹${item.selectedPrice * item.quantity}\n\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `Subtotal: ₹${subtotal}\n`;

  if (discount > 0) {
    message += `Coupon Discount${couponCode ? ` (${couponCode})` : ''}: -₹${discount}\n`;
  }
  if (paymentMethod === 'prepaid' && prepaidDiscount && prepaidDiscount > 0) {
    message += `Prepaid Bonus (10% Off): -₹${prepaidDiscount}\n`;
  }
  
  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `Payment Method: *${paymentMethod === 'prepaid' ? 'Prepaid / UPI' : 'Cash on Delivery'}*\n`;
  message += `*Final Total: ₹${total}*\n\n`;

  // Use profile data if available, fallback to manual inputs
  const name = profile?.name || customerName;
  const phone = profile?.phone || customerPhone;

  if (name) {
    message += `👤 Name: ${name}\n`;
  }
  if (phone) {
    message += `📞 Phone: ${phone}\n`;
  }

  // Include address & location from profile
  if (profile?.address || profile?.city) {
    const addressParts = [
      profile.address,
      profile.city,
      profile.state,
      profile.pincode,
    ].filter(Boolean);
    message += `📍 Address: ${addressParts.join(', ')}\n`;
  }

  if (profile?.latitude && profile?.longitude) {
    message += `🗺️ Location: https://maps.google.com/?q=${profile.latitude},${profile.longitude}\n`;
  }

  message += `\n📦 Please confirm my order. Thank you!`;

  return message;
}

export function getWhatsAppUrl(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}
