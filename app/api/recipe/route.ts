import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { ingredients } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    // Initialize the SDK
    const genAI = new GoogleGenerativeAI(apiKey);

    // FIX: Change 'gemini-1.5-flash' to 'gemini-2.5-flash'
    // This is the current stable workhorse model as of 2025.
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash" 
    });

    const prompt = `You are a professional chef. Create a detailed recipe using: ${ingredients}.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    return NextResponse.json({ error: "Model Error: " + err.message }, { status: 500 });
  }
}