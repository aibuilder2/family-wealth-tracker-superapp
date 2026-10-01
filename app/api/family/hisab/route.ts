import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data_family_hisab.json');

// In-memory cache for fast response and serverless fallback
let hisabCache: any[] = [];

// Try to hydrate cache on server start if file exists
try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      hisabCache = parsed;
    }
  }
} catch (e) {
  // Ignore filesystem read errors in restricted serverless environments
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const partner = searchParams.get('partner');

  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        hisabCache = parsed;
      }
    }
  } catch (e) {}

  let entries = hisabCache;
  if (partner) {
    const pLower = partner.toLowerCase().trim();
    const partnerEntries = hisabCache.filter(e => 
      String(e.toMember || '').toLowerCase().trim().includes(pLower) || 
      String(e.fromMember || '').toLowerCase().trim().includes(pLower) ||
      pLower.includes(String(e.toMember || '').toLowerCase().trim()) ||
      pLower.includes(String(e.fromMember || '').toLowerCase().trim())
    );
    if (partnerEntries.length > 0) {
      entries = partnerEntries;
    }
  }

  return NextResponse.json({
    status: 'ok',
    count: entries.length,
    totalAll: hisabCache.length,
    entries: entries,
    allEntries: hisabCache
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const incomingEntries = Array.isArray(body?.entries) 
      ? body.entries 
      : Array.isArray(body) 
      ? body 
      : [];

    if (incomingEntries.length > 0) {
      hisabCache = incomingEntries;
      try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(incomingEntries, null, 2), 'utf-8');
      } catch (err) {
        // Ignore filesystem write errors in restricted serverless environments
      }
    }

    return NextResponse.json({
      status: 'ok',
      message: 'Family hisab entries synced successfully',
      count: hisabCache.length
    });
  } catch (err: any) {
    return NextResponse.json(
      { status: 'error', message: err?.message || 'Failed to sync hisab' },
      { status: 400 }
    );
  }
}
