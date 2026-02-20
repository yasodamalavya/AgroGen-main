import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { supabase } from '@/services/SupabaseClient';
import { GoogleGenerativeAI } from "@google/generative-ai";

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

    const { chatId, message, language } = await request.json();

    const { data: chatData, error: fetchError } = await supabase
      .from('Data')
      .select('*')
      .eq('Chat_Id', chatId)
      .eq('userEmail', userEmail)
      .single();

    if (fetchError || !chatData) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    const history = chatData.Chat || [];
    const formDataAndResponse = chatData.FormDataAndResponse;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are a crop yield predicting and suggesting AI. Provide helpful advice on farming, yields, and improvements. Respond naturally in the selected language: ${language}. Handle user inputs in any language, including Hinglish or mixed, but always respond in the pure selected language.`;
    const fullPrompt = `${systemPrompt}\nCrop data context: ${formDataAndResponse}\n\nChat history:\n${history.map((m: { role: string; content: string }) => `${m.role}: ${m.content}`).join('\n')}\nuser: ${message}`;

    const result = await model.generateContent(fullPrompt);
    const botResponse = result.response.text().trim();

    const updatedHistory = [...history, { role: "user", content: message }, { role: "bot", content: botResponse }];

    const { error: updateError } = await supabase
      .from('Data')
      .update({ Chat: updatedHistory })
      .eq('Chat_Id', chatId)
      .eq('userEmail', userEmail);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ content: botResponse });

  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}