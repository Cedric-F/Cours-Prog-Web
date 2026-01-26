import { NextResponse } from 'next/server';
import structure from '@/data/structure.json';

export async function GET() {
  return NextResponse.json(structure);
}
