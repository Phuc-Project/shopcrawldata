'use client';

import React from 'react';
import { Database, Filter, Calculator, CheckCircle2, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Database,
    step: 'STEP 01',
    title: 'Multi-Marketplace Ingestion',
    desc: 'Automated streams pull listings, prices, sales velocity, and BSR ranks from Etsy OpenAPI v3, Amazon PA, TikTok Shop, and Google Trends.',
  },
  {
    icon: Filter,
    step: 'STEP 02',
    title: 'Semantic SKU Normalization',
    desc: 'Dense embeddings cluster thousands of noisy seller titles into standardized Printway factory product types.',
  },
  {
    icon: Calculator,
    step: 'STEP 03',
    title: 'Deterministic Scoring',
    desc: 'Transparent formula computes Demand (20%), Growth (20%), Competition Gap (15%), Margin (15%), and Factory Compatibility (10%).',
  },
  {
    icon: CheckCircle2,
    step: 'STEP 04',
    title: 'Actionable Verdict & Spec',
    desc: 'Generates BUILD, WATCH, or SKIP decision sheets with target BOM, recommended pricing, and 15 validated design angles.',
  },
];

export const LandingHowItWorks: React.FC = () => {
  return (
    <section id="workflow" className="py-20 relative border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[12px] uppercase tracking-[0.15em] text-neutral-500 font-medium mb-3">
            System Architecture
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white mb-3">
            From raw signal to factory floor
          </h2>
          <p className="text-neutral-400 text-[15px] leading-relaxed">
            Four deterministic pipeline steps convert millions of marketplace data points into vetted production specs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[11px] font-semibold text-blue-400 tracking-wider">
                      {s.step}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-neutral-400">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-[15px] font-semibold text-white tracking-[-0.01em] mb-2">
                    {s.title}
                  </h3>
                  <p className="text-neutral-400 text-[13px] leading-relaxed">
                    {s.desc}
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
