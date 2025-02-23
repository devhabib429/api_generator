import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const CONFIG_DIR = path.join(process.cwd(), 'config');
const CONFIG_FILE = path.join(CONFIG_DIR, 'api-configs.json');

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

type RouteContext = { params: Promise<{ endpoint: string }> };

// Add type for record values
type RecordValue = string | number | boolean;
type ApiRecord = Record<string, RecordValue>;

export async function GET(request: NextRequest, context: RouteContext) {
  try {
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

    const configs = await loadConfigs();
    const storedConfig = configs[endpoint];
    
    if (!storedConfig) {
      return NextResponse.json(
        { error: 'API configuration not found' },
        { status: 404 }
      );
    }

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

      storedConfig.fields.forEach((field: { name: string; type: string }) => {
        const fieldName = field.name.toLowerCase();
        if (selectedFields.length === 0 || selectedFields.includes(fieldName)) {
          record[fieldName] = generateFieldValue(fieldName, field.type, index + 1);
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
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

function generateFieldValue(fieldName: string, type: string, index: number): RecordValue {
  // Generate values based on field name and type
  if (fieldName.includes('name')) {
    return `John Doe ${index}`;
  }
  if (fieldName.includes('email')) {
    return `john.doe${index}@example.com`;
  }
  if (fieldName.includes('phone')) {
    return `+1 (555) ${String(index).padStart(3, '0')}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
  }
  if (fieldName.includes('address')) {
    return `${index} Main St, City, Country`;
  }

  // Fallback to type-based generation
  switch (type.toLowerCase()) {
    case 'string':
      return `Sample Text ${index}`;
    case 'number':
      return index;
    case 'boolean':
      return Boolean(index % 2);
    default:
      return `Value ${index}`;
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function OPTIONS(_request: NextRequest, _context: RouteContext) {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 