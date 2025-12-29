"use client";
import { useState } from "react";

export default function FridgeApp() {
  const [input, setInput] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);

  const getRecipe = async () => {
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ ingredients: input }),
    });
    const data = await res.json();
    setRecipe(data.text);
    setLoading(false);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 font-sans">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-center">Fridge AI 🥗</h1>
        <textarea 
          className="w-full p-3 border rounded-lg"
          placeholder="Enter ingredients (e.g. eggs, spinach, bread)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button 
          onClick={getRecipe}
          disabled={loading}
          className="w-full bg-orange-500 text-white p-3 rounded-lg font-bold hover:bg-orange-600"
        >
          {loading ? "Chef is thinking..." : "Generate Recipe"}
        </button>
        {recipe && (
          <div className="mt-6 p-4 bg-white rounded-lg shadow whitespace-pre-wrap">
            {recipe}
          </div>
        )}
      </div>
    </main>
  );
}