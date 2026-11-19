'use client';

import React from 'react';
import { Sparkles, Layers, Search, BarChart3, Radio, FileText } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-18 bg-[#090d16]/85 backdrop-blur-md border-b border-white/10 z-50 flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center font-extrabold text-lg text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            O
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight text-white font-display">
              OpportunityOS
            </span>
            <span className="text-[11px] px-2 py-0.5 bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 rounded-full font-semibold uppercase tracking-wider">
              Printway AI
            </span>
          </div>
        </a>

        {/* Navigation Links */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <li>
            <a href="#feed-section" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-400" />
              Opportunity Feed
            </a>
          </li>
          <li>
            <a href="#copilot-section" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              AI Copilot
            </a>
          </li>
          <li>
            <a href="#compare-section" className="hover:text-white transition-colors flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              Niche Compare
            </a>
          </li>
          <li>
            <a href="#radar-section" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-emerald-400" />
              Trend Radar
            </a>
          </li>
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <a
            href="#copilot-section"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all"
          >
            Try AI Copilot
          </a>
          <a
            href="#feed-section"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02]"
          >
            Launch Feed
          </a>
        </div>
      </div>
    </nav>
  );
};
