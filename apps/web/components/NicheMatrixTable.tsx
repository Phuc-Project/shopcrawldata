'use client';

import React from 'react';
import { OPPORTUNITIES } from '@/lib/data';
import { ProductMockup } from '@/components/ui/ProductMockup';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export const NicheMatrixTable: React.FC = () => {
  const getBadgeStyle = (rec: string) => {
    switch (rec) {
      case 'BUILD':
        return 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40';
      case 'WATCH':
        return 'text-amber-300 bg-amber-500/20 border-amber-500/40';
      case 'SKIP':
        return 'text-red-300 bg-red-500/20 border-red-500/40';
      default:
        return 'text-neutral-400 bg-neutral-800 border-neutral-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-[-0.02em]">
          Niche Feasibility Decision Matrix
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Side-by-side comparative benchmarking across market velocity, competition saturation, and factory BOM fit.
        </p>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/10 text-neutral-400 uppercase tracking-wider font-semibold">
                <th className="py-4 px-5">Product Candidate</th>
                <th className="py-4 px-4">Score</th>
                <th className="py-4 px-4">Demand Growth (30d)</th>
                <th className="py-4 px-4">Opportunity Gap</th>
                <th className="py-4 px-4">Printway Factory Fit</th>
                <th className="py-4 px-4">Target Retail Price</th>
                <th className="py-4 px-4">Verdict Action</th>
                <th className="py-4 px-4 text-right">Spec Sheet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-neutral-300">
              {OPPORTUNITIES.map((opp) => (
                <tr key={opp.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 bg-neutral-900 flex items-center justify-center">
                        <ProductMockup type={opp.id} className="w-full h-full p-1" />
                      </div>
                      <div>
                        <strong className="text-white block text-sm font-semibold">{opp.title}</strong>
                        <span className="text-[11px] text-neutral-400">{opp.category} • {opp.material}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-mono font-extrabold text-sm text-white">
                    {opp.score}<span className="text-neutral-600 text-xs font-normal">/100</span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-bold text-emerald-400 font-mono">{opp.growth_30d}</span>
                    <span className="text-neutral-500 text-[10px] block">Velocity: {opp.metrics.growth}/100</span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-bold text-blue-400 font-mono">{opp.opportunity_gap}</span>
                    <span className="text-neutral-500 text-[10px] block">{opp.competition_level} Comp</span>
                  </td>

                  <td className="py-4 px-4">
                    <span className={`font-bold font-mono ${opp.printway_fit >= 75 ? 'text-purple-400' : 'text-red-400'}`}>
                      {opp.printway_fit}%
                    </span>
                    <span className="text-neutral-500 text-[10px] block">Line Check</span>
                  </td>

                  <td className="py-4 px-4 text-white font-mono font-medium">
                    {opp.recommended_price}
                  </td>

                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black border uppercase tracking-wider font-mono ${getBadgeStyle(opp.recommendation)}`}>
                      {opp.recommendation}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <Link
                      href={`/product/${opp.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-blue-600 hover:text-white text-neutral-300 font-medium text-[11px] transition-all"
                    >
                      <span>Spec</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
