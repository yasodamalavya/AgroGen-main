import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface CropPriceRequest {
  crop: string;
  state: string;
}

export async function POST(request: Request) {
  try {
    const body: CropPriceRequest = await request.json();
    const { crop, state } = body;

    if (!crop || !state) {
      return NextResponse.json(
        { error: 'Crop and state are required' },
        { status: 400 }
      );
    }

    const fallbackPrice = getFallbackPrice(crop, state);

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        price: fallbackPrice,
        source: 'fallback',
        message: 'Using estimated price (AI service unavailable)'
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `What is the current market price for ${crop} in ${state}, India per quintal in INR as of September 2025? Provide the price range or average price in a simple format.`;
      const result = await model.generateContent(prompt);
      const aiResponse = result.response.text();

      const price = parsePriceFromAI(aiResponse) || fallbackPrice;

      return NextResponse.json({
        price,
        source: 'ai',
        rawResponse: aiResponse
      });

    } catch (aiError) {
      console.error('AI API Error:', aiError);
      return NextResponse.json({
        price: fallbackPrice,
        source: 'fallback',
        message: 'Using estimated price (AI service temporarily unavailable)'
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error in crop price API:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch crop price',
        message: 'Please try again later'
      },
      { status: 500 }
    );
  }
}

function parsePriceFromAI(response: string): string | null {
  const priceRegex = /(\d{3,4}(?:-\d{3,4})?)\s*(?:INR|Rs\.?)?\s*(?:per\s+quintal)?/i;
  const match = response.match(priceRegex);
  return match ? match[1] : null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getFallbackPrice(crop: string, state: string): string {
  const defaultPrices: { [key: string]: string } = {
    'rice': '2500-3000',
    'wheat': '2000-2500',
    'cotton': '5000-6000',
    'sugarcane': '300-400',
    'soybean': '4000-5000',
    'maize': '1500-2000',
    'chickpea': '4000-5000'
  };

  return defaultPrices[crop.toLowerCase()] || '2000-3000';
}