import { NextResponse } from 'next/server';
import textToSpeech from '@google-cloud/text-to-speech';

const client = new textToSpeech.TextToSpeechClient({
    apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text, language } = await request.json();
    const langMap: { [key: string]: string } = {
      English: 'en-US',
      Hindi: 'hi-IN',
      Telugu: 'te-IN',
      Oriya: 'or-IN',
    };
    const requestObj = {
      input: { text },
      voice: { languageCode: langMap[language] || 'en-US', ssmlGender: 'NEUTRAL' as const },
      audioConfig: { audioEncoding: 'MP3' as const },
    };
    const [response] = await client.synthesizeSpeech(requestObj);
    const audioContent = Buffer.from(response.audioContent as Uint8Array).toString('base64');
    return NextResponse.json({ audioContent });
  } catch (error) {
    console.error('TTS Error:', error);
    return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 });
  }
}