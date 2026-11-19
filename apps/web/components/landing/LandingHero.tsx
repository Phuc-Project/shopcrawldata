'use client';

import React, { useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';

interface LandingHeroProps {
  onSearchPrompt?: (promptText: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onSearchPrompt }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSearch = () => {
    if (inputValue.trim() && onSearchPrompt) {
      onSearchPrompt(inputValue.trim());
    }
  };

  const handleChipClick = (text: string) => {
    setInputValue(text);
    if (onSearchPrompt) onSearchPrompt(text);
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background glow effects */}
      <div className="hero-glow bg-blue-500 top-[-200px] left-1/2 -translate-x-1/2" />
      <div className="hero-glow bg-indigo-600 top-[-100px] right-[-200px]" style={{ width: 400, height: 400 }} />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        {/* Eyebrow */}
        <div className="animate-fade-in">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-neutral-400 text-[12px] font-medium tracking-wide mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Printway R&D Intelligence Platform
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-[clamp(36px,6vw,72px)] font-bold tracking-[-0.04em] leading-[1.05] mb-6 animate-fade-in-delay-1">
          <span className="text-white">Stop guessing.</span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-400 bg-clip-text text-transparent">
            Start manufacturing winners.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-[17px] leading-relaxed text-neutral-400 mb-10 animate-fade-in-delay-2">
          We analyze demand across Etsy, Amazon, and TikTok — then cross-check against Printway's factory specs to generate
          {' '}<span className="text-white font-medium">BUILD</span>,
          {' '}<span className="text-white font-medium">WATCH</span>, or
          {' '}<span className="text-white font-medium">SKIP</span> verdicts
          you can act on immediately.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-5 animate-fade-in-delay-3">
          <div className="flex items-center bg-white/[0.04] border border-white/[0.08] rounded-xl p-1 pl-4 focus-within:border-blue-500/40 focus-within:bg-white/[0.06] transition-all duration-300">
            <Search className="w-4 h-4 text-neutral-500 mr-2.5 flex-shrink-0" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Try: pet memorial ornament, grandpa gift..."
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-neutral-500 text-[14px]"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-[13px] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              Analyze
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Chips */}
        <div className="flex flex-wrap justify-center gap-2 text-[12px] animate-fade-in-delay-3">
          <button
            onClick={() => handleChipClick('Find fastest growing personalized products for Q4')}
            className="px-3 py-1.5 rounded-lg border border-white/[0.06] text-neutral-500 hover:text-neutral-300 hover:border-white/[0.12] hover:bg-white/[0.03] transition-all cursor-pointer"
          >
            Q4 Growth Products
          </button>
          <button
            onClick={() => handleChipClick('Compare Pet Memorial vs Grandpa Gift')}
            className="px-3 py-1.5 rounded-lg border border-white/[0.06] text-neutral-500 hover:text-neutral-300 hover:border-white/[0.12] hover:bg-white/[0.03] transition-all cursor-pointer"
          >
            Cross-Niche Compare
          </button>
          <button
            onClick={() => handleChipClick("Why shouldn't we launch Metal Pet Tag?")}
            className="px-3 py-1.5 rounded-lg border border-red-500/10 text-red-400/60 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/[0.03] transition-all cursor-pointer"
          >
            SKIP Audit Demo
          </button>
        </div>
      </div>
    </section>
  );
};
