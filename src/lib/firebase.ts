import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Debug log the config (without sensitive values)
console.log('Firebase config present:', {
  apiKey: !!firebaseConfig.apiKey,
  authDomain: !!firebaseConfig.authDomain,
  projectId: !!firebaseConfig.projectId,
  // ... other fields
});

// Check if all required config values are present
const isConfigValid = Object.values(firebaseConfig).every(value => value !== undefined);
console.log('Firebase config valid:', isConfigValid);

// Initialize Firebase only if config is valid
const app = isConfigValid && typeof window !== 'undefined' 
  ? getApps().length === 0 
    ? initializeApp(firebaseConfig) 
    : getApps()[0]
  : null;

const auth = app ? getAuth(app) : null;
console.log('Firebase auth initialized:', !!auth);

export { auth }; 