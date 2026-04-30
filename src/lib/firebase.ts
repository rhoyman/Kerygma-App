import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDp4GG4CcGUafg39FJ80CJECwmEmVF3vow",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "kerygmaapp-c2bee.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "kerygmaapp-c2bee",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "kerygmaapp-c2bee.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "617325665799",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:617325665799:web:629cdedd07ff0f879f14a2"
};

// Initialize Firebase only if the API key is present
const app = (firebaseConfig.apiKey && getApps().length === 0) 
  ? initializeApp(firebaseConfig) 
  : (firebaseConfig.apiKey ? getApp() : null);

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const googleProvider = new GoogleAuthProvider();

export const isFirebaseEnabled = !!app;
