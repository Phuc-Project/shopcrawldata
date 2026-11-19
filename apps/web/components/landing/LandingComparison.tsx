'use client';

import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

const comparisonData = [
  {
    dimension: 'Marketplace Ingestion',
    traditional: 'Manual browsing across 40+ browser tabs with zero sales velocity history.',
    opportunityOS: 'Automated streams across Etsy OpenAPI v3, Amazon PA, and TikTok Shop with real-time velocity curves.',
  },
  {
    dimension: 'SKU Normalization',
    traditional: 'Subjective guesswork; misses high-growth products hidden under non-standard titles.',
    opportunityOS: 'Dense vector semantic clustering maps noisy titles directly to standardized Printway factory types.',
  },
  {
    dimension: 'Opportunity Scoring',
    traditional: 'Only relies on raw search volume; enters already-saturated categories with decaying margins.',
    opportunityOS: 'Deterministic Opportunity Score (0–100) combining Demand, Velocity, and Competition Gap.',
  },
  {
    dimension: 'Factory Compatibility',
    traditional: 'Disconnected from manufacturing; wastes weeks researching products Printway cannot produce.',
    opportunityOS: 'Integrated Printway production line fit validation (≥75% requirement; protects gross margin).',
  },
  {
    dimension: 'R&D Output',
    traditional: 'Messy spreadsheets and subjective slides taking 3–5 business days per product cycle.',
    opportunityOS: 'Instant 1-Click R&D Spec Sheet with 15 validated design angles, target pricing, and BOM.',
  },
];

export const LandingComparison: React.FC = () => {
  return (
    <section id="positioning" className="py-20 relative border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[12px] uppercase tracking-[0.15em] text-neutral-500 font-medium mb-3">
            Why OpportunityOS
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white mb-3">
            The operational difference
          </h2>
          <p className="text-neutral-400 text-[15px] leading-relaxed">
            How OpportunityOS transforms traditional, spreadsheet-driven R&D into a high-speed intelligence engine.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  <th className="py-4 px-6 text-neutral-400 font-medium text-xs uppercase tracking-wider w-[24%]">
                    Dimension
                  </th>
                  <th className="py-4 px-6 text-neutral-400 font-medium text-xs uppercase tracking-wider w-[38%]">
                    Traditional Manual R&D
                  </th>
                  <th className="py-4 px-6 text-blue-400 font-medium text-xs uppercase tracking-wider w-[38%] bg-blue-500/[0.03]">
                    OpportunityOS Engine
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-medium text-white align-top">
                      {row.dimension}
                    </td>
                    <td className="py-4 px-6 text-neutral-400 leading-relaxed align-top">
                      <div className="flex items-start gap-2.5">
                        <X className="w-4 h-4 text-neutral-600 flex-shrink-0 mt-0.5" />
                        <span>{row.traditional}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-neutral-200 leading-relaxed align-top bg-blue-500/[0.02]">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{row.opportunityOS}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
