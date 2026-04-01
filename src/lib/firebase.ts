import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  Auth,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

import { getFirestore, Firestore } from 'firebase/firestore';

/* ──────────────────────────────────────────────
   Firebase Configuration
   
   Create a .env.local file with these variables:
   
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ────────────────────────────────────────────── */

const firebaseConfig = {
  apiKey: "AIzaSyCoWafG45jPpPArpajg8XEFZNLy4lWFf9Y",
  authDomain: "elite-tea.firebaseapp.com",
  projectId: "elite-tea",
  storageBucket: "elite-tea.firebasestorage.app",
  messagingSenderId: "692835376448",
  appId: "1:692835376448:web:5196f446d4aedc4e8b6ea5",
  measurementId: "G-281CDMJKEX"
};

// Check if Firebase is properly configured
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured && typeof window !== 'undefined') {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db };

/* ──────── reCAPTCHA Setup ──────── */
let recaptchaVerifier: RecaptchaVerifier | null = null;

export function setupRecaptcha(buttonId: string): RecaptchaVerifier | null {
  if (!auth) return null;

  // Clean up existing verifier
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
  }

  recaptchaVerifier = new RecaptchaVerifier(auth, buttonId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved
    },
  });

  return recaptchaVerifier;
}

/* ──────── Send OTP ──────── */
export async function sendOTP(phoneNumber: string): Promise<ConfirmationResult | null> {
  if (!auth || !recaptchaVerifier) return null;

  // Ensure phone number is in E.164 format
  const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

  try {
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
    return confirmationResult;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
}

/* ──────── Verify OTP ──────── */
export async function verifyOTP(
  confirmationResult: ConfirmationResult,
  otp: string
): Promise<User | null> {
  try {
    const result = await confirmationResult.confirm(otp);
    return result.user;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
}

/* ──────── Sign Out ──────── */
export async function signOut(): Promise<void> {
  if (!auth) return;
  await firebaseSignOut(auth);
}

/* ──────── Google Auth ──────── */
export async function signInWithGoogle(): Promise<User | null> {
  if (!auth) return null;
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
}

/* ──────── Apple Auth ──────── */
export async function signInWithApple(): Promise<User | null> {
  if (!auth) return null;
  const provider = new OAuthProvider('apple.com');
  // Optional scopes: provider.addScope('email'); provider.addScope('name');
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Apple:', error);
    throw error;
  }
}

/* ──────── Auth State Listener ──────── */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export type { User, ConfirmationResult };
