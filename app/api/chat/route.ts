import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Server Configuration Error: Missing API Key" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const body = await req.json();
    const messages = body.messages || [];

    // FIX: Use the stable, working version
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash", 
    });

    const lastMessage = messages[messages.length - 1]?.content || "Hello";
    
    // Filter out the assistant's welcome message
    const history = messages
      .slice(0, -1)
      .filter((m: any, index: number) => {
        if (index === 0 && m.role === 'assistant') return false;
        return true;
      })
      .map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
      }));

    const chat = model.startChat({ history });
    
    // Add System Instruction to the prompt (Since Flash 1.5 supports it in config, 
    // but putting it here is safer for all model types)
    const prompt = `
      SYSTEM: You are a Movie Concierge. 
      - ONLY talk about movies, actors, directors.
      - Refuse other topics politely.
      - Keep answers under 50 words.
      
      USER: ${lastMessage}
    `;

    const result = await chat.sendMessage(prompt);
    const response = result.response.text();

    return NextResponse.json({ reply: response });

  } catch (error: any) {
    console.error("🔥 GOOGLE AI ERROR:", error.message);
    return NextResponse.json({ 
        error: "AI Service Error", 
        details: error.message 
    }, { status: 500 });
  }
}