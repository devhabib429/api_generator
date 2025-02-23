import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import type { NextRequest } from 'next/server';

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

type Context = {
  params: { endpoint: string } & Promise<{ endpoint: string }>;
};

export async function POST(request: NextRequest, context: Context) {
  const { endpoint } = context.params;
  try {
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

export async function GET(request: NextRequest, context: Context) {
  const { endpoint } = context.params;
  try {
    const configs = await loadConfigs();
    const config = configs[endpoint];

    if (!config) {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(config, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error loading config:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function OPTIONS(_request: NextRequest, _context: Context) {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 