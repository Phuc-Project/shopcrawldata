'use client';

import React, { useState } from 'react';
import { Sliders, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface SliderItem {
  key: string;
  label: string;
  weight: string;
  default: number;
  isFactory?: boolean;
}

const sliderConfig: SliderItem[] = [
  { key: 'demand', label: 'Demand Velocity', weight: '20%', default: 94 },
  { key: 'growth', label: '30-Day Growth', weight: '20%', default: 96 },
  { key: 'competition', label: 'Competition Gap', weight: '15%', default: 78 },
  { key: 'revenue', label: 'Revenue Potential', weight: '15%', default: 87 },
  { key: 'productionFit', label: 'Factory Line Fit', weight: '10%', default: 96, isFactory: true },
];

export const LiveScoreCalculator: React.FC = () => {
  const [values, setValues] = useState<Record<string, number>>({
    demand: 94, growth: 96, competition: 78, revenue: 87, productionFit: 96,
  });

  const update = (key: string, val: number) => setValues((prev) => ({ ...prev, [key]: val }));

  const score = Math.round(
    values.demand * 0.20 +
    values.growth * 0.20 +
    values.competition * 0.15 +
    values.revenue * 0.15 +
    values.productionFit * 0.10 +
    90 * 0.10 +
    85 * 0.10
  );

  const productionFit = values.productionFit;
  let recommendation: 'BUILD' | 'WATCH' | 'SKIP';
  let reasonText: string;

  if (score >= 80 && productionFit >= 75) {
    recommendation = 'BUILD';
    reasonText = `High cross-market velocity and validated production fit (${productionFit}%). Projected margins exceed hurdle rate.`;
  } else if (score >= 60 && productionFit >= 60) {
    recommendation = 'WATCH';
    reasonText = `Moderate signal or upcoming seasonal cycle. Monitor competitor listing velocity before batch manufacturing.`;
  } else {
    recommendation = 'SKIP';
    reasonText = productionFit < 60
      ? `Factory production fit too low (${productionFit}%). Equipment constraints render this SKU unprofitable.`
      : `Market competition overly saturated. Price erosion reduces unit economics below threshold.`;
  }

  const scoreColor = recommendation === 'BUILD' ? '#10b981' : recommendation === 'WATCH' ? '#f59e0b' : '#ef4444';
  const verdictStyle = recommendation === 'BUILD'
    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    : recommendation === 'WATCH'
    ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    : 'text-red-400 bg-red-500/10 border-red-500/20';

  const circumference = 251.2;
  const strokeDashoffset = circumference * (1 - score / 100);

  return (
    <section id="sandbox" className="py-20 relative">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[12px] uppercase tracking-[0.15em] text-neutral-500 font-medium mb-3">
            Interactive Sandbox
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white mb-3">
            Test the scoring algorithm
          </h2>
          <p className="text-neutral-400 text-[15px]">
            Drag the sliders to see how the engine weighs multi-marketplace metrics against factory capacity.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sliders */}
          <div className="lg:col-span-7 space-y-5">
            {sliderConfig.map((s) => (
              <div key={s.key} className={s.isFactory ? 'pt-4 border-t border-white/[0.06]' : ''}>
                <div className="flex justify-between text-[13px] mb-2">
                  <span className="text-neutral-300 font-medium">
                    {s.label}
                    <span className="text-neutral-600 ml-2 text-[11px]">({s.weight})</span>
                    {s.isFactory && (
                      <span className="ml-2 text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/15 font-mono">
                        FACTORY CHECK
                      </span>
                    )}
                  </span>
                  <strong className="font-mono text-white tabular-nums">{values[s.key]}</strong>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={values[s.key]}
                  onChange={(e) => update(s.key, Number(e.target.value))}
                  className="w-full"
                />
              </div>
            ))}
            <p className="text-[12px] text-neutral-600 leading-relaxed">
              Try lowering <span className="text-neutral-400">Factory Line Fit</span> below 75 to see the engine issue a <strong className="text-red-400">SKIP</strong> even on high-demand items.
            </p>
          </div>

          {/* Result */}
          <div className="lg:col-span-5 rounded-xl bg-white/[0.03] border border-white/[0.06] p-6 text-center flex flex-col items-center justify-center">
            <div className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium mb-4">
              Opportunity Score
            </div>

            {/* Circular gauge */}
            <div className="relative w-28 h-28 flex items-center justify-center mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 90 90">
                <circle cx="45" cy="45" r="40" stroke="#1a1a1a" strokeWidth="6" fill="transparent" />
                <circle
                  cx="45" cy="45" r="40"
                  stroke={scoreColor}
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <div className="absolute text-center font-bold text-3xl text-white tabular-nums">
                {score}<span className="text-neutral-600 text-sm font-normal">/100</span>
              </div>
            </div>

            <span className={`px-3 py-1 rounded-md text-[12px] font-semibold border ${verdictStyle} mb-4`}>
              {recommendation}
            </span>

            <p className="text-[12px] text-neutral-500 leading-relaxed max-w-xs mb-4">
              {reasonText}
            </p>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Explore live opportunities
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
