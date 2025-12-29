// Add this line at the very top of route.ts
export const runtime = 'nodejs'; 
export const dynamic = 'force-dynamic';

import { GoogleGenerativeAI } from "@google/generative-ai";
// ... rest of your code

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// This ensures the file is treated as a module
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const { ingredients } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Create a detailed recipe using these ingredients: ${ingredients}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}