"use client";
import { useState } from "react";

export default function FridgeApp() {
  const [input, setInput] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);

  const getRecipe = async () => {
    if (!input) return;
    setLoading(true);
    setRecipe(""); 
    
    try {
      const res = await fetch("/api/recipe", { 
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ ingredients: input }),
});

      const data = await res.json();

      if (!res.ok) {
        // This will show you exactly what went wrong on the screen
        setRecipe(`⚠️ Error: ${data.error || 'Something went wrong'}`);
      } else {
        setRecipe(data.text);
      }
    } catch (err) {
      setRecipe("⚠️ Connection failed. Is the API route correct?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFCFB] text-slate-900 p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <header className="mb-10 text-center">
          <div className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-bold mb-3">
            AI SOUS-CHEF
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">What's in my fridge?</h1>
          <p className="text-slate-500 mt-2">Enter your ingredients, and I'll craft a gourmet recipe.</p>
        </header>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 border border-slate-100 mb-8">
          <label className="block text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">Ingredients</label>
          <textarea 
            className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 transition-all min-h-[120px] text-lg"
            placeholder="e.g. 2 eggs, wilted spinach, leftover rice..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            onClick={getRecipe}
            disabled={loading || !input}
            className={`w-full mt-4 py-4 rounded-xl font-bold text-white transition-all shadow-lg shadow-orange-200 ${
              loading ? "bg-slate-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-bounce">🥕</span> Chopping ingredients...
              </span>
            ) : "Generate Recipe"}
          </button>
        </div>

        {/* Result Section */}
        {recipe && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 prose prose-slate animate-in fade-in slide-in-from-bottom-4 duration-500">
             {/* Using a simple pre-wrap for the AI markdown text */}
            <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
              {recipe}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}