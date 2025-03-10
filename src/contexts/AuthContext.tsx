'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut,
  User
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User | undefined>;
  logout: () => Promise<void>;
  getAuthToken: () => Promise<string | null>;
  apiToken: string | null;
  regenerateToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiToken, setApiToken] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      console.error('Auth not initialized in AuthContext');
      return;
    }
    
    console.log('Setting up auth state listener...');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', !!user);
      setUser(user);
      if (user) {
        const token = await user.getIdToken();
        setApiToken(token);
      } else {
        setApiToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      if (!auth) {
        console.error('Firebase auth not initialized');
        throw new Error('Authentication service not available');
      }
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      console.log('Starting Google sign in...');
      const result = await signInWithPopup(auth, provider);
      console.log('Sign in successful:', !!result.user);
      return result.user;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      if (error instanceof Error) {
        throw new Error(`Sign in failed: ${error.message}`);
      }
      throw new Error('Sign in failed');
    }
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  const getAuthToken = async () => {
    if (!user) return null;
    return await user.getIdToken();
  };

  const regenerateToken = async () => {
    if (!user) return;
    await user.getIdToken(true);
    const newToken = await user.getIdToken();
    setApiToken(newToken);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signInWithGoogle, 
      logout, 
      getAuthToken,
      apiToken,
      regenerateToken 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 