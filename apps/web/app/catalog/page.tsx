'use client';

import React from 'react';
import { WorkspaceLayout } from '@/components/layout/WorkspaceLayout';
import { PRINTWAY_CATALOG } from '@/lib/data';
import { Factory, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ProductMockup } from '@/components/ui/ProductMockup';

export default function CatalogPage() {
  return (
    <WorkspaceLayout title="Production Catalog" category="Manufacturing">
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Factory className="w-6 h-6 text-blue-400" />
            <span>Printway Manufacturing Line Catalog</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Standardized factory capabilities, equipment constraints, margin hurdle rates (≥35%), and turnaround times.
          </p>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRINTWAY_CATALOG.map((cat) => {
            const isHighFit = cat.printway_fit >= 75;
            return (
              <div
                key={cat.type_id}
                className="rounded-3xl border border-white/10 bg-neutral-950 p-6 flex flex-col justify-between shadow-xl space-y-4 hover:border-white/20 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-neutral-400 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.06]">
                      {cat.type_id}
                    </span>
                    <span
                      className={`px-3 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider font-mono ${
                        isHighFit
                          ? 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40'
                          : 'text-red-300 bg-red-500/20 border-red-500/40'
                      }`}
                    >
                      {isHighFit ? 'Active Factory Line' : 'Equipment Bottleneck'}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-white mb-2">
                    {cat.name}
                  </h2>

                  {/* Thumbnail Mockup */}
                  <div className="my-3">
                    <ProductMockup type={cat.type_id} className="h-40 w-full" />
                  </div>

                  <div className="space-y-2 text-xs text-neutral-300 bg-white/[0.02] p-4 rounded-2xl border border-white/[0.04]">
                    <div className="flex justify-between py-1 border-b border-white/[0.04]">
                      <span className="text-neutral-400">Material Spec:</span>
                      <strong className="text-white font-mono">{cat.material}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/[0.04]">
                      <span className="text-neutral-400">Est. Gross Margin:</span>
                      <strong className="text-emerald-400 font-mono font-bold">{cat.margin_est}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/[0.04]">
                      <span className="text-neutral-400">Difficulty:</span>
                      <span className={isHighFit ? 'text-neutral-200' : 'text-amber-300 font-bold'}>{cat.difficulty}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-neutral-400">Lead Time:</span>
                      <span className="text-neutral-200 font-mono">{cat.lead_time}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Factory Compatibility:</span>
                  <strong className={`font-mono text-base font-black ${isHighFit ? 'text-emerald-400' : 'text-red-400'}`}>
                    {cat.printway_fit}%
                  </strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </WorkspaceLayout>
  );
}
