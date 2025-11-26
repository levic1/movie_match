import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    // 1. Security Check
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "API Key is missing on the server." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const { messages } = await req.json();

    // 2. CUSTOM INSTRUCTIONS (Updated for Directors/Actors)
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

    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: systemInstruction
    });

    // 3. Format History for Gemini
    const history = messages.slice(0, -1).map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
    }));

    const lastMessage = messages[messages.length - 1].content;

    // 4. Generate Response
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage);
    const response = result.response.text();

    return NextResponse.json({ reply: response });

  } catch (error: any) {
    console.error("Gemini API Error:", error); // CHECK YOUR VS CODE TERMINAL FOR THIS
    return NextResponse.json({ error: "Failed to connect to AI." }, { status: 500 });
  }
}