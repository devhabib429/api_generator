import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBiuz0o992m_cf3zjzMtGULaQKe8uILt_U",
  authDomain: "api-generator-72f12.firebaseapp.com",
  projectId: "api-generator-72f12",
  storageBucket: "api-generator-72f12.firebasestorage.app",
  messagingSenderId: "804693676251",
  appId: "1:804693676251:web:ece1427ca772915f50fcfe"
};

// Initialize Firebase only on client side
const app = typeof window !== 'undefined' ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null; 