'use client';

import React from 'react';
import { Database, Cpu, Calculator, CheckCircle, Sliders } from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  return (
    <section id="pipeline-section" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 block mb-2">
            Mathematical Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 font-display mb-3">
            Opportunity Score Formula
          </h2>
          <p className="text-slate-400 text-base">
            Scores are deterministic and fully explainable — derived from raw data rather than arbitrary LLM hallucination.
          </p>
        </div>

        {/* Weights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-5 text-center">
            <h4 className="text-cyan-400 font-bold text-lg mb-1 font-display">Demand Score (20%)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sales velocity, BSR rank percentile, search volume, and review velocity across Etsy & Amazon.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-5 text-center">
            <h4 className="text-emerald-400 font-bold text-lg mb-1 font-display">Growth Score (20%)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              30-day demand growth minus competition growth (Opportunity Gap calculation).
            </p>
          </div>

          <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-5 text-center">
            <h4 className="text-amber-400 font-bold text-lg mb-1 font-display">Competition (15%)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Listing count, top seller market concentration ratio, and review barrier.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-5 text-center">
            <h4 className="text-purple-400 font-bold text-lg mb-1 font-display">Printway Fit (10%)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Material compatibility, manufacturing difficulty, and estimated margin (35%+ threshold).
            </p>
          </div>
        </div>

        {/* Flow Diagram */}
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center text-xs">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 w-full">
              <Database className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <strong className="text-slate-200 block text-sm mb-1">Marketplace Connectors</strong>
              <span className="text-slate-400">Etsy, Amazon, TikTok Shop, Trends</span>
            </div>

            <div className="text-indigo-400 font-bold text-lg">→</div>

            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 w-full">
              <Cpu className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
              <strong className="text-slate-200 block text-sm mb-1">Product Normalizer</strong>
              <span className="text-slate-400">Semantic LLM + Vector Search</span>
            </div>

            <div className="text-indigo-400 font-bold text-lg">→</div>

            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 w-full">
              <Calculator className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <strong className="text-slate-200 block text-sm mb-1">Feature Engine</strong>
              <span className="text-slate-400">Demand, Growth, Fit Weighted Sum</span>
            </div>

            <div className="text-indigo-400 font-bold text-lg">→</div>

            <div className="flex-1 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 w-full">
              <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <strong className="text-emerald-300 block text-sm mb-1">Recommendation</strong>
              <span className="text-emerald-400 font-bold">BUILD / WATCH / SKIP</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
