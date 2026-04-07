'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getUserOrders, Order } from '@/lib/orders';
import { UserProfile, Address } from '@/types';

export default function ProfilePage() {
  const { profile, updateProfile, addAddress, deleteAddress, isLoading, user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    email: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);

  // Address Form State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState<Omit<Address, 'id'>>({
    label: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  // Redirect if not logged in after loading
  useEffect(() => {
    if (!isLoading && !user && !profile) {
      router.push('/');
    }
  }, [isLoading, user, profile, router]);

  // Sync form with profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
      });
    }
  }, [profile]);

  // Fetch Order History
  useEffect(() => {
    async function fetchOrders() {
      if (user?.uid) {
        setIsOrdersLoading(true);
        try {
          const data = await getUserOrders(user.uid);
          setOrders(data);
        } catch (error) {
          console.error('Failed to load orders:', error);
        } finally {
          setIsOrdersLoading(false);
        }
      }
    }
    fetchOrders();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      await updateProfile(formData);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Update profile error:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAddress = async () => {
    if (!addressForm.address || !addressForm.city) return;
    try {
      await addAddress(addressForm);
      setIsAddingAddress(false);
      setAddressForm({ label: '', address: '', city: '', state: '', pincode: '' });
    } catch (error) {
      console.error('Failed to add address:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-cream pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-2xl shadow-brand-900/5 overflow-hidden border border-brand-100/50"
        >
          {/* Header */}
          <div className="bg-brand-900 px-8 py-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gold-400/10 to-transparent" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-left max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white/10 shrink-0">
                {profile.name ? profile.name.charAt(0).toUpperCase() : '👤'}
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-white mb-1">{profile.name || 'My Profile'}</h1>
                <p className="text-gold-400/80 font-medium">{profile.phone}</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white/60 text-xs border border-white/5 uppercase tracking-widest font-bold">Member</span>
                  {orders.length > 0 && <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 text-xs border border-gold-400/20 uppercase tracking-widest font-bold">{orders.length} Orders</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Info Form */}
          <form onSubmit={handleSubmit} className="p-8 sm:p-12">
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              <div className="col-span-2">
                <h3 className="text-lg font-bold text-brand-900 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">👤</span>
                  Personal Information
                </h3>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-900/40 uppercase tracking-wider ml-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full px-5 py-3.5 rounded-2xl bg-brand-50/50 border border-brand-100 focus:bg-white focus:border-gold-500 transition-all outline-none text-brand-900 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-900/40 uppercase tracking-wider ml-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex@example.com"
                  className="w-full px-5 py-3.5 rounded-2xl bg-brand-50/50 border border-brand-100 focus:bg-white focus:border-gold-500 transition-all outline-none text-brand-900 font-medium"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-8 border-t border-brand-100/50">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-brand-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-800 transition-all disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              {saveStatus === 'success' && <span className="text-green-600 text-sm font-bold">✓ Saved</span>}
            </div>
          </form>

          {/* Address Book Section */}
          <div className="p-8 sm:p-12 bg-brand-50/30 border-t border-brand-100/50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-brand-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-gold-50 flex items-center justify-center text-gold-600">📍</span>
                Address Book
              </h3>
              {(profile?.addresses?.length || 0) < 5 && (
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="text-gold-600 font-bold text-sm hover:underline"
                >
                  + Add New
                </button>
              )}
            </div>

            {isAddingAddress && (
              <div className="mb-8 p-6 bg-white rounded-3xl border border-gold-200 shadow-sm space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Address Label (e.g. Home)"
                    value={addressForm.label}
                    onChange={(e) => setAddressForm({...addressForm, label: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-50 border border-brand-100"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-50 border border-brand-100"
                  />
                </div>
                <textarea
                  placeholder="Full Address"
                  value={addressForm.address}
                  onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-50 border border-brand-100 h-24"
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-50 border border-brand-100"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddAddress}
                      className="flex-1 bg-gold-500 text-white py-2.5 rounded-xl font-bold"
                    >
                      Save Address
                    </button>
                    <button
                      onClick={() => setIsAddingAddress(false)}
                      className="px-6 py-2.5 bg-brand-100 text-brand-900 rounded-xl font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              {profile?.addresses?.map((addr) => (
                <div key={addr.id} className="p-5 bg-white rounded-2xl border border-brand-100 relative group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-brand-900 uppercase tracking-widest">{addr.label}</span>
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-brand-800/70 mb-1">{addr.address}</p>
                  <p className="text-xs text-brand-800/40 font-medium">{addr.city}, {addr.pincode}</p>
                </div>
              ))}
              {(profile?.addresses?.length || 0) === 0 && !isAddingAddress && (
                <p className="col-span-2 text-center py-8 text-brand-800/30 font-medium border-2 border-dashed border-brand-100 rounded-2xl">
                  No addresses saved yet.
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Order History Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h2 className="font-display text-3xl font-bold text-brand-900">Order History</h2>
            <div className="w-12 h-1 bg-gold-400 rounded-full" />
          </div>

          {isOrdersLoading ? (
            <div className="grid gap-6">
              {[1, 2].map(i => (
                <div key={i} className="h-32 w-full bg-white rounded-3xl animate-pulse border border-brand-100/50" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] p-12 text-center border border-brand-100/50 shadow-sm">
              <div className="text-4xl mb-4">🍵</div>
              <h3 className="text-xl font-bold text-brand-900 mb-2">No orders yet</h3>
              <p className="text-brand-800/40 mb-6">Start your journey with our premium tea collection.</p>
              <button
                onClick={() => router.push('/products')}
                className="inline-flex items-center gap-2 text-gold-600 font-bold hover:text-gold-700 transition-colors"
              >
                Explore Products →
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-md border border-brand-100/50 hover:shadow-xl transition-all group"
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-6">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center justify-between sm:justify-start gap-4">
                        <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-widest border border-brand-100">
                          Order #{order.id?.slice(-8).toUpperCase()}
                        </span>
                        <span className="text-brand-800/40 text-xs font-medium">
                          {order.createdAt?.toDate ? new Date(order.createdAt.toDate()).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }) : 'Recent'}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-cream/50 px-3 py-2 rounded-xl border border-brand-100/30">
                            <span className="text-xs font-bold text-brand-900">{item.quantity}x</span>
                            <span className="text-xs text-brand-800/70 font-medium truncate max-w-[120px]">{item.product.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex row sm:flex-col justify-between items-end gap-2 border-t sm:border-t-0 sm:border-l border-brand-100/50 pt-4 sm:pt-0 sm:pl-8 min-w-[140px]">
                      <div className="text-right">
                        <p className="text-brand-800/40 text-xs font-bold uppercase tracking-wider mb-1">Total Amount</p>
                        <p className="text-2xl font-display font-bold text-brand-900">₹{order.total}</p>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
                        order.status === 'delivered' 
                          ? 'bg-green-50 text-green-600 border-green-200' 
                          : 'bg-gold-50 text-gold-600 border-gold-200'
                      }`}>
                        {order.status?.replace('_', ' ') || 'Pending'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Security / Help */}
        <div className="grid sm:grid-cols-2 gap-4 text-center">
           <div className="p-6 rounded-3xl bg-white/50 border border-brand-100/50">
             <p className="text-xs font-bold text-brand-900/30 uppercase tracking-widest mb-1">Privacy Guarantee</p>
             <p className="text-sm text-brand-800/50">Your personal data is encrypted and stored in our private cloud.</p>
           </div>
           <div className="p-6 rounded-3xl bg-white/50 border border-brand-100/50">
             <p className="text-xs font-bold text-brand-900/30 uppercase tracking-widest mb-1">Need help?</p>
             <p className="text-sm text-brand-800/50">Chat with our curators on <a href="https://wa.me/917811081552" className="text-gold-600 hover:underline">WhatsApp Support</a>.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
