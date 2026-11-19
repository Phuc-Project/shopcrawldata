'use client';

import React, { useState } from 'react';
import { OpportunityItem, OPPORTUNITIES } from '@/lib/data';
import { FileText, Layers, ArrowUpRight, TrendingUp, Star, DollarSign, Factory } from 'lucide-react';
import { ProductMockup } from '@/components/ui/ProductMockup';

interface OpportunityFeedProps {
  onSelectOpportunity: (oppId: string) => void;
}

export const OpportunityFeed: React.FC<OpportunityFeedProps> = ({ onSelectOpportunity }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredItems = OPPORTUNITIES.filter((opp) => {
    const matchStatus = statusFilter === 'all' || opp.recommendation.toLowerCase() === statusFilter.toLowerCase();
    const matchCategory = categoryFilter === 'all' || opp.category.toLowerCase().includes(categoryFilter.toLowerCase());
    return matchStatus && matchCategory;
  });

  const getVerdictBadge = (rec: string) => {
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-[-0.02em] flex items-center gap-2">
            <span>Ranked Opportunity Candidates</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono font-normal">
              {filteredItems.length} SKUs Audited
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Algorithmic scoring combining demand velocity, competition gap, and Printway factory feasibility.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-neutral-900 border border-white/10 text-neutral-200 text-xs rounded-xl px-3.5 py-2 outline-none focus:border-blue-500 cursor-pointer font-medium"
          >
            <option value="all">All Verdicts (BUILD / WATCH / SKIP)</option>
            <option value="build">BUILD Only (Ready to manufacture)</option>
            <option value="watch">WATCH Only (Monitoring velocity)</option>
            <option value="skip">SKIP Only (Factory Bottleneck)</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-neutral-900 border border-white/10 text-neutral-200 text-xs rounded-xl px-3.5 py-2 outline-none focus:border-blue-500 cursor-pointer font-medium"
          >
            <option value="all">All Categories</option>
            <option value="decor">Home Decor & Gifts</option>
            <option value="family">Family Gifts</option>
            <option value="pet">Pet Products</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredItems.map((opp) => {
          const scoreColor = getScoreColor(opp.score);
          const strokeDashoffset = 251.2 * (1 - opp.score / 100);

          return (
            <div
              key={opp.id}
              className="rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-900/90 via-neutral-950/90 to-black p-6 hover:border-white/20 transition-all flex flex-col justify-between shadow-xl group"
            >
              <div>
                {/* Header with Badges & Score */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-black border uppercase tracking-wider font-mono ${getVerdictBadge(opp.recommendation)}`}>
                        {opp.recommendation}
                      </span>
                      <span className="text-[11px] text-neutral-300 bg-white/[0.06] px-2.5 py-0.5 rounded-md border border-white/10 font-semibold">
                        {opp.badge}
                      </span>
                      <span className="text-[11px] text-neutral-400 bg-neutral-800/80 px-2 py-0.5 rounded-md">
                        {opp.season}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {opp.title}
                    </h3>
                    <div className="text-xs text-neutral-400">
                      Standardized SKU: <span className="text-neutral-200 font-semibold">{opp.product_type}</span>
                    </div>
                  </div>

                  {/* Circular Score Gauge */}
                  <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center bg-black/40 rounded-2xl border border-white/10 p-1">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 90 90">
                      <circle cx="45" cy="45" r="40" stroke="#262626" strokeWidth="8" fill="transparent" />
                      <circle
                        cx="45"
                        cy="45"
                        r="40"
                        stroke={scoreColor}
                        strokeWidth="8"
                        strokeDasharray="251.2"
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>
                    <div className="absolute text-center font-black text-base text-white font-mono">
                      {opp.score}
                    </div>
                  </div>
                </div>

                {/* Visual Mockup & Metrics Side-by-Side */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 my-4">
                  {/* Product Visual Mockup (5 cols) */}
                  <div className="sm:col-span-5">
                    <ProductMockup type={opp.id} className="h-44 w-full" />
                  </div>

                  {/* Key Metrics Breakdown (7 cols) */}
                  <div className="sm:col-span-7 bg-white/[0.02] p-3.5 rounded-2xl border border-white/[0.06] flex flex-col justify-between space-y-2 text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-neutral-400">Demand Growth:</span>
                        <span className="font-bold text-emerald-400 font-mono">{opp.growth_30d}</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${opp.metrics.growth}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-neutral-400">Opportunity Gap:</span>
                        <span className="font-bold text-blue-400 font-mono">{opp.opportunity_gap}</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${opp.metrics.demand}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-neutral-400">Printway Line Fit:</span>
                        <span className={`font-bold font-mono ${opp.printway_fit >= 75 ? 'text-purple-400' : 'text-red-400'}`}>
                          {opp.printway_fit}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${opp.printway_fit >= 75 ? 'bg-purple-500' : 'bg-red-500'}`}
                          style={{ width: `${opp.printway_fit}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px]">
                      <span className="text-neutral-500">Target Retail:</span>
                      <span className="font-bold text-white font-mono">{opp.recommended_price}</span>
                    </div>
                  </div>
                </div>

                {/* Reasoning summary text */}
                <p className="text-xs text-neutral-400 bg-white/[0.02] p-3 rounded-xl border border-white/[0.04] leading-relaxed mb-4">
                  <strong className="text-neutral-300 font-semibold">R&D Audit: </strong>
                  {opp.reasoning}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
                <div className="text-neutral-400 text-xs">
                  Material: <span className="text-neutral-200 font-medium">{opp.material}</span>
                </div>

                <button
                  onClick={() => onSelectOpportunity(opp.id)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Open Full Spec Sheet</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
