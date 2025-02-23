import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
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

export async function GET(
  request: Request,
  context: { params: { endpoint: string } }
) {
  try {
    const { endpoint } = await Promise.resolve(context.params);
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
      // Generate a consistent ID for each record
      const recordId = uuidv4();
      
      const baseRecord = {
        id: recordId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const record: Record<string, any> = selectedFields.length > 0 
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
          // Get the record value, converting to string for comparison
          const recordValue = String(record[key] || '').toLowerCase();
          // Check if the filter value is included in the record value
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

function generateFieldValue(fieldName: string, type: string, index: number): any {
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

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 