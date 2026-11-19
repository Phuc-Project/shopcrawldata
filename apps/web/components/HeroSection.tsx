'use client';

import React, { useState } from 'react';
import { Sparkles, Search, CheckCircle2, TrendingUp, Cpu, Zap } from 'lucide-react';

interface HeroSectionProps {
  onSearchPrompt: (promptText: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearchPrompt }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSearch = () => {
    if (inputValue.trim()) {
      onSearchPrompt(inputValue.trim());
    }
  };

  const handleChipClick = (promptText: string) => {
    setInputValue(promptText);
    onSearchPrompt(promptText);
  };

  return (
    <section className="pt-36 pb-20 text-center relative z-10">
      <div className="max-w-5xl mx-auto px-6">
        {/* Hackathon Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 animate-pulse">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          <span>HN AI Hackathon 2026 • Printway Challenge PW1</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-display mb-6 leading-[1.15] text-slate-100">
          From Marketplace Noise to One <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Winning Product Decision.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-lg text-slate-400 mb-10 leading-relaxed">
          OpportunityOS tells Printway R&D what Print-on-Demand products to manufacture — scoring market demand, competition growth, and factory production fit before the market saturates.
        </p>

        {/* AI Copilot Search Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="flex items-center bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-2 pl-5 shadow-2xl shadow-indigo-500/20 backdrop-blur-xl focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <Sparkles className="w-5 h-5 text-indigo-400 mr-3 flex-shrink-0" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ask OpportunityOS anything (e.g. Find personalized pet items for Q4)..."
              className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder-slate-500 text-base"
            />
            <button
              onClick={handleSearch}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Ask Copilot
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <button
              onClick={() => handleChipClick('Find the fastest growing personalized products for Q4')}
              className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-indigo-500/15 hover:border-indigo-500/40 rounded-lg text-xs text-slate-300 transition-all flex items-center gap-1.5"
            >
              🔥 Fast Growing Q4 Items
            </button>
            <button
              onClick={() => handleChipClick('Compare Pet Memorial vs Grandpa Gift vs Gardening Sign')}
              className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-indigo-500/15 hover:border-indigo-500/40 rounded-lg text-xs text-slate-300 transition-all flex items-center gap-1.5"
            >
              📊 Compare Top Niches
            </button>
            <button
              onClick={() => handleChipClick("Why shouldn't we launch Metal Pet Tag?")}
              className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-indigo-500/15 hover:border-indigo-500/40 rounded-lg text-xs text-slate-300 transition-all flex items-center gap-1.5"
            >
              ⚠️ Demo Trick: Metal Pet Tag
            </button>
          </div>
        </div>

        {/* Connectors Status Strip */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-white/10 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Etsy OpenAPI v3</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Amazon PA</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>TikTok Shop (Kalodata Open)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Google Trends API</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Printway Catalog Norm</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>pgvector LLM Reranker</span>
          </div>
        </div>
      </div>
    </section>
  );
};
