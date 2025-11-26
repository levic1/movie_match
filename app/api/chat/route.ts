import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // 2. Configure the Model (Gemini 1.5 Flash is fast & efficient)
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: "You are a Movie Concierge for the app 'MovieTinder'. You are witty, helpful, and only talk about movies. Keep answers short (under 50 words) and fun. If asked about code/math, politely steer back to cinema."
    });

    // 3. Convert Frontend Message History to Gemini Format
    // Frontend uses 'assistant', Gemini uses 'model'
    // We separate the "History" from the "Current Prompt" (last message)
    const history = messages.slice(0, -1).map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
    }));

    const lastMessage = messages[messages.length - 1].content;

    // 4. Start Chat Session
    const chat = model.startChat({
        history: history,
    });

    // 5. Send Message
    const result = await chat.sendMessage(lastMessage);
    const response = result.response.text();

    return NextResponse.json({ reply: response });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to connect to Gemini." }, { status: 500 });
  }
}