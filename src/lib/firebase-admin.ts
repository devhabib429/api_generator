import { initializeApp, getApps, cert } from 'firebase-admin/app';

export function initAdmin() {
  if (!getApps().length) {
    try {
      // Get private key from environment
      let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

      // Handle different private key formats
      if (privateKey) {
        // Remove quotes if they exist
        privateKey = privateKey.replace(/"/g, '');
        // Replace literal \n with newlines
        privateKey = privateKey.replace(/\\n/g, '\n');
      }

      if (!process.env.FIREBASE_ADMIN_PROJECT_ID || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL || !privateKey) {
        throw new Error('Missing Firebase Admin credentials');
      }

      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey
        }),
      });
      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Firebase Admin initialization error:', error);
    }
  }
} 