import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  const { ingredients } = await req.json();
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `I have these ingredients: ${ingredients}. 
  Give me a creative recipe name, an ingredient list, and step-by-step instructions. 
  Format it cleanly in Markdown.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return NextResponse.json({ text: response.text() });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate recipe" }, { status: 500 });
  }
}