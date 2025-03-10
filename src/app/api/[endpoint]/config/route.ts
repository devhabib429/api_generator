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
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      console.error('Firebase Admin credentials are not properly configured');
      throw new Error('Firebase Admin credentials missing');
    }

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    // Don't throw here, let the API routes handle the error
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

// Update verifyToken to handle uninitialized Firebase
async function verifyToken(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) return null;
    
    const auth = getAuth();
    if (!auth) {
      console.error('Firebase Auth not initialized');
      return null;
    }

    return await auth.verifyIdToken(token);
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const decodedToken = await verifyToken(request);
    if (!decodedToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
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
    console.error('Save Error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
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