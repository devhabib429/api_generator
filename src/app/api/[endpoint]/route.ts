import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getAuth } from 'firebase-admin/auth';
import { faker } from '@faker-js/faker';

const CONFIG_DIR = path.join(process.cwd(), 'config');
const CONFIG_FILE = path.join(CONFIG_DIR, 'api-configs.json');

async function verifyToken(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) return null;
    
    const decodedToken = await getAuth().verifyIdToken(token);
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
    const configs = JSON.parse(data);
    console.log('Loaded config:', configs[endpoint]);
    return configs[endpoint];
  } catch (error) {
    console.error('Error loading config:', error);
    return null;
  }
}

// Function to load configurations
async function loadConfigs() {
  try {
    await fs.mkdir(CONFIG_DIR, { recursive: true });
    const data = await fs.readFile(CONFIG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

// Function to save configurations
async function saveConfig(endpoint: string, fields: { name: string; type: string }[]) {
  try {
    await fs.mkdir(CONFIG_DIR, { recursive: true });
    const configs = await loadConfigs();
    configs[endpoint] = { fields };
    await fs.writeFile(CONFIG_FILE, JSON.stringify(configs, null, 2));
  } catch (error) {
    console.error('Error saving config:', error);
  }
}

// Update the RouteContext type to match Next.js expectations
type RouteContext = {
  params: Promise<{ endpoint: string }>
};

// Add type for record values
type RecordValue = string | number | boolean;
type ApiRecord = Record<string, RecordValue>;

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
    
    // Get selected fields and filters from query params
    const selectParam = url.searchParams.get('select');
    const selectedFields = selectParam ? selectParam.split(',') : [];
    
    // Get all query params for filtering
    const filters: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      if (!['select', 'count'].includes(key)) {
        filters[key.toLowerCase()] = value.toLowerCase();
      }
    });

    // Load user-specific configuration
    const config = await loadUserConfig(decodedToken.uid, endpoint);
    if (!config) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 });
    }

    console.log('Config loaded:', config);

    const countParam = url.searchParams.get('count');
    const count = countParam ? Math.max(1, parseInt(countParam)) : 100;
    const safeCount = Math.min(100, count);

    // Generate records with field selection and filtering
    let data = Array.from({ length: safeCount }, (_, index) => {
      // Generate a consistent ID for each record based on endpoint and index
      const recordId = `${endpoint}_${index + 1}`;
      
      const baseRecord = {
        id: recordId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const record: ApiRecord = selectedFields.length > 0 
        ? { id: baseRecord.id }
        : baseRecord;

      config.fields.forEach((field: { name: string; type: string }) => {
        const fieldName = field.name;
        if (selectedFields.length === 0 || selectedFields.includes(fieldName.toLowerCase())) {
          const value = generateValue(field.type);
          console.log(`Generated value for ${fieldName} (${field.type}):`, value);
          record[fieldName] = value;
        }
      });

      return record;
    });

    // Apply filters including id
    if (Object.keys(filters).length > 0) {
      data = data.filter(record => {
        return Object.entries(filters).every(([key, value]) => {
          const recordValue = String(record[key] || '').toLowerCase();
          return recordValue.includes(value.toLowerCase());
        });
      });
    }

    return NextResponse.json({
      data: data.slice(0, safeCount),
      pagination: {
        count: data.length,
        total: data.length
      }
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
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
    const { endpoint } = await context.params;
    const { fields } = await request.json();

    await saveConfig(endpoint, fields);

    return NextResponse.json({ success: true }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error saving config:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
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