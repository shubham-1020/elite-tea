'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthChange, signOut as firebaseSignOut, isFirebaseConfigured, db, type User } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  phone: string;
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
  locationAddress: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
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

  // Load profile from localStorage initially for fast render
  useEffect(() => {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProfile(JSON.parse(saved));
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
                const data = docSnap.data() as UserProfile;
                setProfile(data);
                localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data));
              } else {
                // Create basic profile from Firebase user
                const newProfile: UserProfile = {
                  uid: firebaseUser.uid,
                  phone: firebaseUser.phoneNumber || '',
                  name: firebaseUser.displayName || '',
                  email: firebaseUser.email || '',
                  address: '',
                  city: '',
                  state: '',
                  pincode: '',
                  latitude: null,
                  longitude: null,
                  locationAddress: '',
                };
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
        ? { ...prev, ...data }
        : {
            uid: 'demo-user',
            phone: '',
            name: '',
            email: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            latitude: null,
            longitude: null,
            locationAddress: '',
            ...data,
          };
      
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
      address: '',
      city: '',
      state: '',
      pincode: '',
      latitude: null,
      longitude: null,
      locationAddress: '',
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
