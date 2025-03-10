import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getAuth } from 'firebase-admin/auth';
import { faker } from '@faker-js/faker';
import { initAdmin } from '@/lib/firebase-admin';

// Initialize Firebase Admin at the top of the file
initAdmin();

const CONFIG_DIR = path.join(process.cwd(), 'config');

async function verifyToken(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) {
      console.log('No token provided');
      return null;
    }
    
    const decodedToken = await getAuth().verifyIdToken(token);
    console.log('Token verified successfully');
    return decodedToken;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

// Function to load user-specific configurations
async function loadUserConfig(userId: string, endpoint: string) {
  try {
    const userConfigDir = path.join(CONFIG_DIR, userId);
    const configPath = path.join(userConfigDir, 'api-configs.json');
    const data = await fs.readFile(configPath, 'utf-8');
    const configs = JSON.parse(data) as ConfigType;
    
    // Debug logs
    console.log('All configs:', configs);
    console.log('Loading config for endpoint:', endpoint);
    console.log('Fields received:', configs[endpoint]?.fields);
    
    return configs[endpoint];
  } catch (error) {
    console.error('Error loading config:', error);
    return null;
  }
}

// Update the RouteContext type to match Next.js expectations
type RouteContext = {
  params: Promise<{ endpoint: string }>
};

// Add type for record values
type RecordValue = string | number | boolean;
type ApiRecord = Record<string, RecordValue>;

// Add this type at the top with other types
type ConfigType = {
  [key: string]: {
    fields: { name: string; type: string }[];
  };
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const decodedToken = await verifyToken(request);
    if (!decodedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { endpoint } = await context.params;
    const url = new URL(request.url);

    // Load user-specific configuration
    const config = await loadUserConfig(decodedToken.uid, endpoint);
    console.log('Loaded config for endpoint:', endpoint, config);

    if (!config || !config.fields) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 });
    }

    const countParam = url.searchParams.get('count');
    const count = countParam ? Math.max(1, parseInt(countParam)) : 100;
    const safeCount = Math.min(100, count);

    // Generate records
    const data = Array.from({ length: safeCount }, (_, index) => {
      const record: Record<string, any> = {
        id: `${endpoint}_${index + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Make sure we process all fields from the config
      config.fields.forEach((field: { name: string; type: string }) => {
        const value = generateValue(field.type);
        console.log(`Generated value for ${field.name} (${field.type}):`, value);
        record[field.name] = value;
      });

      return record;
    });

    return NextResponse.json({
      data,
      pagination: {
        count: data.length,
        total: data.length
      }
    });

  } catch (error) {
    console.error('Error generating data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function generateValue(type: string): RecordValue {
  const lowercaseType = type.toLowerCase();
  console.log('Generating value for type:', lowercaseType);

  switch (lowercaseType) {
    // Basic Types
    case 'string':
      return faker.lorem.word();
    case 'number':
      return faker.number.int(1000);
    case 'boolean':
      return faker.datatype.boolean();
    case 'date':
      return faker.date.recent().toISOString();
      
    // Special Types
    case 'email':
      return faker.internet.email();
    case 'phone':
      return faker.phone.number();
    case 'url':
      return faker.internet.url();
    case 'uuid':
      return faker.string.uuid();
      
    // Content Types
    case 'firstname':
    case 'firstName':  // Match both camelCase and lowercase
      return faker.person.firstName();
    case 'lastname':
    case 'lastName':   // Match both camelCase and lowercase
      return faker.person.lastName();
    case 'fullname':
    case 'fullName':   // Match both camelCase and lowercase
      return faker.person.fullName();
    case 'username':
      return faker.internet.userName();
    case 'company':
      return faker.company.name();
    case 'address':
      return faker.location.streetAddress();
    case 'city':
      return faker.location.city();
    case 'country':
      return faker.location.country();
    case 'zipcode':
    case 'zipCode':    // Match both camelCase and lowercase
      return faker.location.zipCode();
      
    // Technical Types
    case 'ipv4':
      return faker.internet.ipv4();
    case 'ipv6':
      return faker.internet.ipv6();
    case 'mac':
      return faker.internet.mac();
    case 'color':
      return faker.internet.color();
      
    default:
      console.log('Unmatched type:', type);
      return faker.lorem.word();
  }
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const decodedToken = await verifyToken(request);
    if (!decodedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { endpoint } = await context.params;
    const { fields } = await request.json();

    // Validate endpoint and fields
    if (!endpoint || !fields || !Array.isArray(fields)) {
      console.error('Invalid request data:', { endpoint, fields });
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    console.log('Saving fields:', fields);

    const userConfigDir = path.join(CONFIG_DIR, decodedToken.uid);
    await fs.mkdir(userConfigDir, { recursive: true });
    const configPath = path.join(userConfigDir, 'api-configs.json');

    // Load or create config
    let configs: ConfigType = {};
    try {
      const existingData = await fs.readFile(configPath, 'utf-8');
      configs = JSON.parse(existingData) as ConfigType;
    } catch (error) {
      // File doesn't exist, start with empty object
    }

    // Update with new fields
    configs[endpoint] = { fields };
    
    // Log before saving
    console.log('Saving config:', { endpoint, fields });

    // Save config
    await fs.writeFile(configPath, JSON.stringify(configs, null, 2));

    // Verify saved data
    const savedConfig = await loadUserConfig(decodedToken.uid, endpoint);
    console.log('Verified saved config:', savedConfig);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 