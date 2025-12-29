import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { ingredients } = await request.json();
    
    // 1. Check for API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing in Vercel" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // 2. Try the model with a 'v1' prefix if '1.5-flash' fails, 
    // or just use the official string: "gemini-1.5-flash"
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
    });

    const prompt = `You are a chef. Create a detailed recipe using: ${ingredients}.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (err: any) {
    console.error(err);
    // 3. Return the specific error to the UI for debugging
    return NextResponse.json({ error: "Gemini Error: " + err.message }, { status: 500 });
  }
}