import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { ingredients } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;
const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
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

    const prompt = `You are an elite Executive Chef known for complex flavor layering. 
Input Ingredients: ${ingredients}.

Your goal: Create a high-end, restaurant-quality dish using these items PLUS common pantry staples (fats, dry spices, aromatics, condiments). 

CRITICAL RULES:
1. Do not use Markdown symbols (*, #, **).
2. Think about flavor balance: contrast textures (crunch vs creamy) and flavors (acid vs fat).
3. Use professional culinary techniques (e.g., deglazing, emulsifying, tempering).
4. If the ingredients are simple, elevate them with specific spice pairings (e.g., "toasted cumin," "smoked paprika," "zest of lemon").

Structure:
RECIPE TITLE
(A brief 1-sentence description of the flavor profile, e.g., "A smoky, acid-forward take on...")

INGREDIENTS
(Include the user's items + specific spices and pantry staples)

INSTRUCTIONS
(Detailed, technique-heavy steps)`;

    const result = await model.generateContent(prompt);
    const recipeText = result.response.text();
    const recipeTitle = recipeText.split('\n')[0];

    // 2. Fetch a realistic image from Unsplash
    const imageRes = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(recipeTitle + " food")}&per_page=1&orientation=squarish`,
      { headers: { Authorization: `Client-ID ${unsplashKey}` } }
    );
    const imageData = await imageRes.json();
    const imageUrl = imageData.results[0]?.urls?.regular || "https://images.unsplash.com/photo-1495195129352-aeb325a55b65";

    return NextResponse.json({ text: recipeText, image: imageUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}