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

       const systemInstruction = `
      You are the ultimate Movie Concierge for 'MovieTinder'.
      
      YOUR EXPERTISE:
      - You are an expert on ACTORS (e.g., "What movies is Brad Pitt in?").
      - You are an expert on DIRECTORS (e.g., "Best Tarantino movies").
      - You know release dates, genres, and hidden gems.
      
      YOUR RULES:
      1. Keep answers short, punchy, and fun (max 2-3 sentences).
      2. If a user asks about a specific actor or director, list their top 3 rated movies immediately.
      3. If the user asks about non-movie topics (coding, cooking, life advice), politely refuse and steer back to cinema.
      4. Do not use markdown like **bold** or *italics*, just plain text.
    `;

    // FIX: Changed model name to 'gemini-1.5-flash-latest' to resolve 404 error
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash-latest", 
        systemInstruction: systemInstruction
    });

    // --- THE FIX IS HERE ---
    // 1. Separate the "Current Prompt" (last message) from "History"
    const lastMessage = messages[messages.length - 1]?.content || "Hello";
    
    // 2. Format History, but FILTER OUT the first message if it's from the AI (Welcome msg)
    const history = messages
      .slice(0, -1) // Take everything EXCEPT the last message
      .filter((m: any, index: number) => {
        // Gemini crashes if history starts with 'model'. 
        // So if the very first message (index 0) is 'assistant', we skip it.
        if (index === 0 && m.role === 'assistant') return false;
        return true;
      })
      .map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
      }));

    // 3. Start Chat
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage);
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