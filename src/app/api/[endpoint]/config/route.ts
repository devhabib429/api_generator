import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import type { NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

    console.log('Admin Credentials Check:', {
      hasProjectId: !!projectId,
      hasClientEmail: !!clientEmail,
      hasPrivateKey: !!privateKey,
    });

    if (!projectId || !clientEmail || !privateKey) {
      console.error('Missing Firebase Admin credentials');
      throw new Error('Firebase Admin credentials missing');
    }

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
  }
}

const CONFIG_DIR = path.join(process.cwd(), 'config');

// Add at the top with other type definitions
type Config = {
  fields: { name: string; type: string; }[];
};

type Configs = {
  [key: string]: Config;
};

// Function to load user-specific configurations
async function loadConfigs(userId: string): Promise<Configs> {
  const userConfigDir = path.join(CONFIG_DIR, userId);
  await fs.mkdir(userConfigDir, { recursive: true });
  const configPath = path.join(userConfigDir, 'api-configs.json');

  try {
    const data = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading config file:', error);
    return {};
  }
}

// Function to save user-specific configurations
async function saveConfig(userId: string, endpoint: string, config: Config) {
  const userConfigDir = path.join(CONFIG_DIR, userId);
  await fs.mkdir(userConfigDir, { recursive: true });
  const configPath = path.join(userConfigDir, 'api-configs.json');

  let existingConfigs: Configs = {};
  try {
    const data = await fs.readFile(configPath, 'utf-8');
    existingConfigs = JSON.parse(data);
  } catch {
    // If file doesn't exist, we'll create it with an empty object
    console.log('Creating new config file');
  }

  existingConfigs[endpoint] = config;
  await fs.writeFile(configPath, JSON.stringify(existingConfigs, null, 2));
}

type Context = {
  params: Promise<{ endpoint: string }>;
};

// Improved token verification
async function verifyToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('No Bearer token found');
      return null;
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      console.error('Token is empty');
      return null;
    }

    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(token);
    console.log('Token verified successfully for user:', decodedToken.uid);
    return decodedToken;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const decodedToken = await verifyToken(request);
    if (!decodedToken) {
      console.error('Authentication failed');
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Received fields:', body.fields); // Debug log

    if (!Array.isArray(body.fields)) {
      console.error('Fields is not an array:', body.fields);
      return NextResponse.json({ error: 'Invalid fields format' }, { status: 400 });
    }

    const config: Config = {
      fields: body.fields
    };

    await saveConfig(decodedToken.uid, body.endpoint, config);
    console.log('Saved config:', config); // Debug log

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest, context: Context) {
  try {
    const decodedToken = await verifyToken(request);
    if (!decodedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { endpoint } = await context.params;
    const configs = await loadConfigs(decodedToken.uid);
    const config = configs[endpoint];

    if (!config) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 });
    }

    return NextResponse.json(config);
  } catch (error: unknown) {
    console.error('Error loading config:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal Server Error' 
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 