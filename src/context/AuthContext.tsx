'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthChange, signOut as firebaseSignOut, isFirebaseConfigured, db, type User } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { UserProfile, Address } from '@/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  selectAddress: (id: string) => Promise<void>;
  logout: () => Promise<void>;
  isDemoMode: boolean;
  demoLogin: (phone: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PROFILE_STORAGE_KEY = 'elite-tea-profile';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const isDemoMode = !isFirebaseConfigured;
  const router = useRouter();

  const sanitizeProfile = useCallback((data: any): UserProfile => {
    return {
      ...data,
      addresses: Array.isArray(data.addresses) ? data.addresses : [],
      selectedAddressId: data.selectedAddressId || null,
    };
  }, []);

  // Load profile from localStorage initially for fast render
  useEffect(() => {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfile(sanitizeProfile(parsed));
      } catch {
        localStorage.removeItem(PROFILE_STORAGE_KEY);
      }
    }
  }, []);

  // Listen to Firebase auth state
  useEffect(() => {
    if (!isDemoMode) {
      const unsubscribe = onAuthChange(async (firebaseUser) => {
        setUser(firebaseUser);
        
        if (firebaseUser) {
          // Attempt to fetch profile from Firestore
          if (db) {
            try {
              const docRef = doc(db, 'users', firebaseUser.uid);
              const docSnap = await getDoc(docRef);
              
              if (docSnap.exists()) {
                let data = docSnap.data() as UserProfile;
                
                // MIGRATION: Convert legacy fields to addresses array
                if ((!data.addresses || data.addresses.length === 0) && data.address) {
                  const migratedAddress: Address = {
                    id: 'addr-' + Date.now(),
                    label: 'Default Address',
                    address: data.address,
                    city: data.city || '',
                    state: data.state || '',
                    pincode: data.pincode || '',
                    isDefault: true,
                  };
                  data = {
                    ...data,
                    addresses: [migratedAddress],
                    selectedAddressId: migratedAddress.id,
                  };
                  // Persist migrated state
                  await setDoc(docRef, data, { merge: true });
                }

                const sanitized = sanitizeProfile(data);
                setProfile(sanitized);
                localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(sanitized));
              } else {
                // Create basic profile from Firebase user
                const newProfile = sanitizeProfile({
                  uid: firebaseUser.uid,
                  phone: firebaseUser.phoneNumber || '',
                  name: firebaseUser.displayName || '',
                  email: firebaseUser.email || '',
                });
                setProfile(newProfile);
                localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
                
                // Write initial empty/default profile to Firestore
                await setDoc(docRef, newProfile, { merge: true });
              }
            } catch (err) {
              console.error('Error fetching Firestore profile:', err);
            }
          }
        }
        setIsLoading(false);
      });
      return unsubscribe;
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false);
    }
  }, [isDemoMode]);

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    // 1. Calculate the updated profile synchronously
    let updatedProfile: UserProfile;
    
    setProfile((prev) => {
      const nextProfile = prev
        ? sanitizeProfile({ ...prev, ...data })
        : sanitizeProfile({
            uid: 'demo-user',
            phone: '',
            name: '',
            email: '',
            ...data,
          });
      
      updatedProfile = nextProfile;
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
      return nextProfile;
    });

    // 2. Persist to Firestore if available and logged in
    if (!isDemoMode && db && updatedProfile!.uid !== 'demo-user') {
      try {
        const docRef = doc(db, 'users', updatedProfile!.uid);
        await setDoc(docRef, updatedProfile!, { merge: true });
      } catch (err) {
        console.error('Failed to update Firestore profile:', err);
      }
    }
  }, [isDemoMode]);

  const addAddress = useCallback(async (address: Omit<Address, 'id'>) => {
    if (!profile) return;
    
    const newAddress: Address = {
      ...address,
      id: 'addr-' + Date.now(),
    };

    const currentAddresses = profile.addresses || [];
    const newAddresses = [...currentAddresses, newAddress].slice(0, 5);
    await updateProfile({ 
      addresses: newAddresses,
      selectedAddressId: profile.selectedAddressId || newAddress.id 
    });
  }, [profile, updateProfile]);

  const updateAddress = useCallback(async (id: string, address: Partial<Address>) => {
    if (!profile || !profile.addresses) return;
    
    const newAddresses = profile.addresses.map(addr => 
      addr.id === id ? { ...addr, ...address } : addr
    );
    await updateProfile({ addresses: newAddresses });
  }, [profile, updateProfile]);

  const deleteAddress = useCallback(async (id: string) => {
    if (!profile || !profile.addresses) return;
    
    const newAddresses = profile.addresses.filter(addr => addr.id !== id);
    const newSelectedId = profile.selectedAddressId === id 
      ? (newAddresses.length > 0 ? newAddresses[0].id : null)
      : profile.selectedAddressId;

    await updateProfile({ 
      addresses: newAddresses,
      selectedAddressId: newSelectedId
    });
  }, [profile, updateProfile]);

  const selectAddress = useCallback(async (id: string) => {
    await updateProfile({ selectedAddressId: id });
  }, [updateProfile]);

  const logout = useCallback(async () => {
    if (!isDemoMode) {
      await firebaseSignOut();
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  }, [isDemoMode]);

  const demoLogin = useCallback((phone: string) => {
    const demoProfile: UserProfile = {
      uid: 'demo-' + Date.now(),
      phone: `+91${phone}`,
      name: '',
      email: '',
      addresses: [],
      selectedAddressId: null,
    };
    setProfile(demoProfile);
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(demoProfile));
    setIsAuthModalOpen(false);
  }, []);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        selectAddress,
        logout,
        isDemoMode,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
