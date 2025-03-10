import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

    console.log('Admin Credentials Check:', {
      hasProjectId: !!projectId,
      hasClientEmail: !!clientEmail,
      hasPrivateKey: !!privateKey,
    });

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Firebase Admin credentials missing');
    }

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        // Ensure proper formatting of private key
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

// Store configurations in memory instead of file system
const apiConfigs = new Map();

export async function POST(request: NextRequest) {
  try {
    const decodedToken = await verifyToken(request);
    if (!decodedToken) {
      console.log('Authentication failed');
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    const data = await request.json();
    const { endpoint, fields } = data;

    if (!endpoint || !fields) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // Store config in memory
    apiConfigs.set(endpoint, {
      userId: decodedToken.uid,
      fields: fields
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST handler error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function verifyToken(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) {
      console.log('No token provided');
      return null;
    }
    
    const auth = getAuth();
    console.log('Verifying token...');
    const decodedToken = await auth.verifyIdToken(token);
    console.log('Token verified successfully');
    return decodedToken;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  // Add CORS headers
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 