import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const CONFIG_DIR = path.join(process.cwd(), 'config');
const CONFIG_FILE = path.join(CONFIG_DIR, 'api-configs.json');

export async function POST(
  request: Request,
  { params }: { params: { endpoint: string } }
) {
  try {
    const { endpoint } = params;
    const { fields } = await request.json();

    await fs.mkdir(CONFIG_DIR, { recursive: true });
    const configs = await loadConfigs();
    configs[endpoint] = { fields };
    await fs.writeFile(CONFIG_FILE, JSON.stringify(configs, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving config:', error);
    return NextResponse.json({ error: 'Failed to save configuration' }, { status: 500 });
  }
}

async function loadConfigs() {
  try {
    const data = await fs.readFile(CONFIG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
} 