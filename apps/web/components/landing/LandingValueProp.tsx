'use client';

import React from 'react';
import { Target, TrendingUp, Layers, Palette, Factory, BarChart2 } from 'lucide-react';

const decisions = [
  {
    icon: Target,
    number: '01',
    title: 'What should we manufacture?',
    desc: 'Instant deterministic recommendation (BUILD / WATCH / SKIP) combining cross-marketplace demand with Printway factory capability.',
  },
  {
    icon: TrendingUp,
    number: '02',
    title: 'What products are starting to trend?',
    desc: 'Early velocity radar alerts that detect breakout listings and keyword acceleration before competitors saturate the niche.',
  },
  {
    icon: Layers,
    number: '03',
    title: 'Which niche has high demand & low competition?',
    desc: 'Calculates the real Opportunity Gap (Demand Velocity % minus Seller Competition Growth %) to identify empty market windows.',
  },
  {
    icon: Palette,
    number: '04',
    title: 'What style & quotes do buyers want?',
    desc: 'Extracts top-converting typography, trending quotes, material palettes, and personalization hooks from winning listings.',
  },
  {
    icon: Factory,
    number: '05',
    title: 'Can Printway manufacture this product?',
    desc: 'Audits BOM, material thickness, laser vs UV line constraints, and enforces a strict gross margin hurdle rate (≥35%).',
  },
  {
    icon: BarChart2,
    number: '06',
    title: 'What is the success probability?',
    desc: 'Unified Opportunity Score (0–100) calculated deterministically with full formula transparency — zero AI hallucinations.',
  },
];

export const LandingValueProp: React.FC = () => {
  return (
    <section id="features" className="py-20 relative border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[12px] uppercase tracking-[0.15em] text-neutral-500 font-medium mb-3">
            Core Decisions Solved
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white mb-3">
            Engineered specifically for Printway R&D
          </h2>
          <p className="text-neutral-400 text-[15px] leading-relaxed">
            Generic keyword tools leave your team guessing. OpportunityOS translates marketplace signals into concrete manufacturing decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decisions.map((d, idx) => {
            const Icon = d.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 group relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-neutral-400 group-hover:text-blue-400 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-xs font-semibold text-neutral-600 group-hover:text-neutral-400 transition-colors">
                      {d.number}
                    </span>
                  </div>
                  <h3 className="text-[15px] font-semibold text-white tracking-[-0.01em] mb-2">
                    {d.title}
                  </h3>
                  <p className="text-neutral-400 text-[13px] leading-relaxed">
                    {d.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
