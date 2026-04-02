import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { CartItem } from '@/types';

export interface Order {
  id?: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'prepaid' | 'cod';
  status: 'pending_whatsapp' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: any;
  couponCode?: string;
}

export async function saveOrder(order: Omit<Order, 'createdAt' | 'status'>) {
  if (!db) return null;

  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...order,
      status: 'pending_whatsapp',
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving order to Firestore:', error);
    throw error;
  }
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  if (!db) return [];

  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
}
