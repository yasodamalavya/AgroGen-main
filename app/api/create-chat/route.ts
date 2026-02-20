import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { supabase } from '@/services/SupabaseClient';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getPrediction } from '@/lib/predictYield';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = user.primaryEmailAddress?.emailAddress;
    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    const formData = await request.json();
    const requiredFields = ['crop', 'season', 'state', 'annualRainfall', 'area', 'fertilizer', 'pesticide', 'cropYear'];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const predictionData = await getPrediction(formData);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const titlePrompt = `Summarize this crop form data into a short, descriptive title (max 50 characters): ${JSON.stringify(formData)}`;
    const titleResult = await model.generateContent(titlePrompt);
    const title = titleResult.response.text().trim().slice(0, 50);

    const systemPrompt = `
You are a crop yield prediction & suggestion AI. 
You should do the following:

1. Provide a yield prediction and assessment based on the provided data.
2. If fertilizer or pesticide is zero / missing / negligible, mention that this can lead to poor yield.
3. Give general suggestions for improvement (water, soil, timing, cultivation practices, etc.).
4. Estimate a percentage improvement in yield if these suggestions are followed.
5. **Important**: Do *not* suggest specific fertilizer or pesticide names *unless* the user explicitly asks for them. If user asks, then you *can* suggest region-appropriate fertilizers/pesticides.

6. If the user requests specific names, here are **sample fertilizers and pesticides used in India for rice** that you may draw from:

   **Fertilizers:**
   - Urea (nitrogen source) :contentReference[oaicite:0]{index=0}  
   - DAP (Diammonium Phosphate) or TSP (Triple Super Phosphate) for phosphorus :contentReference[oaicite:1]{index=1}  
   - Muriate of Potash (MOP, potassium source) :contentReference[oaicite:2]{index=2}  
   - Bio-fertilizers like Azolla, Blue-green algae, Azotobacter, Azospirillum, Phosphobacteria, Phosphate solubilizers, Mycorrhiza :contentReference[oaicite:3]{index=3}  

   **Pesticides / Insecticides / Biological controls:**
   - Chlorantraniliprole (for stem borer, leaf folder) :contentReference[oaicite:4]{index=4}  
   - Emamectin Benzoate :contentReference[oaicite:5]{index=5}  
   - Chlorpyrifos (pests like stem borer, leaf folder, whorl maggot) :contentReference[oaicite:6]{index=6}  
   - Neem-based products / Neem oil or Neem cake for pest management and soil health :contentReference[oaicite:7]{index=7}  
   - Pyraxalt™ active for planthopper control :contentReference[oaicite:8]{index=8}  

7. When suggesting specific names (if asked), mention approximate dose/formulation or pest names if known, and note safety / regulation / waiting periods as relevant.

`;

    const initialPrompt = `
${systemPrompt}
Crop Data: ${JSON.stringify(formData)}
Prediction: ${JSON.stringify(predictionData)}

Now, produce:
- A succinct yield prediction + assessment.
- General suggestions (without naming specific fertilizers/pesticides unless the user asked).
- Estimated % improvement if suggestions are followed.
Ignore any “good yield” bias in prediction data; assess on merits.
`;

    const initialResult = await model.generateContent(initialPrompt);
    const initialMessage = initialResult.response.text().trim();

    const chatId = crypto.randomUUID();
    const chatHistory = [{ role: 'bot', content: initialMessage }];
    const formDataAndResponse = JSON.stringify({ formData, prediction: predictionData });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await supabase
      .from('Data')
      .insert({
        Chat_Id: chatId,
        userEmail,
        Title: title,
        Chat: chatHistory,
        FormDataAndResponse: formDataAndResponse,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error(`Failed to insert into Supabase: ${error.message}`);
    }

    return NextResponse.json({ chatId, title, initialMessage });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error creating chat:', error);
    return NextResponse.json(
      { error: 'Failed to create chat', details: error.message },
      { status: 500 }
    );
  }
}