import { CartItem, Address } from '@/types';

const WHATSAPP_NUMBER = '917811081552';

export function generateWhatsAppMessage(
  items: CartItem[],
  subtotal: number,
  discount: number,
  total: number,
  couponCode?: string,
  customerName?: string,
  customerPhone?: string,
  selectedAddress?: Address | null,
  paymentMethod: 'prepaid' | 'cod' = 'prepaid',
  prepaidDiscount?: number,
  shippingFee?: number,
  codCharge?: number
): string {
  let message = `🍵 *NEW ORDER - ELITE TEA*\n`;
  message += `╔══════════════════╗\n`;
  message += `  *ORDER DETAILS*\n`;
  message += `╚══════════════════╝\n\n`;

  items.forEach((item, index) => {
    message += `${index + 1}. *${item.product.name}*\n`;
    message += `   📦 Weight: ${item.selectedWeight}\n`;
    message += `   🔢 Qty: ${item.quantity}\n`;
    message += `   💰 Price: ₹${item.selectedPrice * item.quantity}\n\n`;
  });

  message += `──────────────────\n`;
  message += `*Subtotal:* ₹${subtotal}\n`;

  if (discount > 0) {
    message += `*Coupon code (${couponCode}):* -₹${discount}\n`;
  }
  if (paymentMethod === 'prepaid' && prepaidDiscount && prepaidDiscount > 0) {
    message += `*Prepaid Benefit (10% OFF):* -₹${prepaidDiscount}\n`;
  }
  if (shippingFee && shippingFee > 0) {
    message += `*Shipping:* ₹${shippingFee}\n`;
  }
  if (codCharge && codCharge > 0) {
    message += `*COD Charge:* ₹${codCharge}\n`;
  }
  
  message += `──────────────────\n`;
  message += `💳 *Payment:* ${paymentMethod === 'prepaid' ? 'PREPAID / UPI' : 'CASH ON DELIVERY'}\n`;
  message += `🔥 *TOTAL AMOUNT: ₹${total}*\n`;
  message += `──────────────────\n\n`;

  message += `╔══════════════════╗\n`;
  message += `  *CUSTOMER INFO*\n`;
  message += `╚══════════════════╝\n`;

  if (customerName) message += `👤 *Name:* ${customerName}\n`;
  if (customerPhone) message += `📞 *Phone:* ${customerPhone}\n`;

  // Include address from selected address
  if (selectedAddress) {
    const addressParts = [
      selectedAddress.address,
      selectedAddress.city,
      selectedAddress.state,
      selectedAddress.pincode,
    ].filter(Boolean);
    message += `📍 *Address:* ${addressParts.join(', ')}\n`;
  }

  message += `\n✨ *Please confirm my order. Thank you!*`;

  return message;
}

export function getWhatsAppUrl(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}
