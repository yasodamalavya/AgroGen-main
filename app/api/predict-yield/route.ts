import { NextResponse } from 'next/server';
import { getPrediction } from '@/lib/predictYield';

export async function POST(request: Request) {
  const body = await request.json();
  const requiredFields = ['crop', 'season', 'state', 'annualRainfall', 'area', 'fertilizer', 'pesticide', 'cropYear'];
  const missingFields = requiredFields.filter((field) => !body[field]);

  if (missingFields.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missingFields.join(', ')}` },
      { status: 400 }
    );
  }

  const data = await getPrediction(body);
  return NextResponse.json(data);
}