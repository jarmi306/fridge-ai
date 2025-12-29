import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// 1. Initialize the AI with your key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// 2. You MUST export an async function named POST
export async function POST(req: Request) {
  try {
    // 3. Parse the incoming JSON body
    const body = await req.json();
    const { ingredients } = body;

    if (!ingredients) {
      return NextResponse.json({ error: "No ingredients provided" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are a professional chef. I have: ${ingredients}. Give me a detailed recipe.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}