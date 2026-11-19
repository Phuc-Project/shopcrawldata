'use client';

import React from 'react';
import { Database, Filter, Palette, Factory, CheckCircle2 } from 'lucide-react';

const engines = [
  {
    icon: Database,
    span: 'lg:col-span-7',
    title: 'Multi-Marketplace Ingestion',
    desc: 'Live API connectors to Etsy, Amazon PA, TikTok Shop, and Google Trends. Normalizes price, BSR, velocity, and sentiment into a unified feed.',
    demo: (
      <div className="mt-5 space-y-2 text-[12px] font-mono">
        {[
          { src: 'Etsy', color: 'text-orange-400', item: '"Personalized Grandpa Gift"', stat: '$19.99 · 524 sales' },
          { src: 'Amazon', color: 'text-blue-400', item: '"Custom Acrylic Ornament" BSR #4312', stat: '$17.99 · 420/mo' },
          { src: 'TikTok', color: 'text-purple-400', item: '"Viral Pet Memorial Ornament"', stat: '$18.50 · 1.4k sold' },
        ].map((row) => (
          <div key={row.src} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <span className="text-neutral-400">
              <span className={`${row.color} font-semibold`}>{row.src}</span> · {row.item}
            </span>
            <span className="text-emerald-400 font-semibold whitespace-nowrap ml-4">{row.stat}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Filter,
    span: 'lg:col-span-5',
    title: 'Semantic Normalization',
    desc: 'Maps hundreds of noisy listing titles into one standardized Printway Product Type via vector similarity.',
    demo: (
      <div className="mt-5 space-y-2.5 text-[12px]">
        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
          <div className="text-neutral-500 text-[11px] mb-1">Input listings:</div>
          <div className="text-neutral-300">"Personalized Grandpa Gift from Granddaughter..."</div>
        </div>
        <div className="text-center text-neutral-600 text-[11px]">↓ 0.94 similarity match</div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="text-emerald-400 font-semibold">Custom Shape Acrylic Ornament</span>
        </div>
      </div>
    ),
  },
  {
    icon: Palette,
    span: 'lg:col-span-5',
    title: 'Design Intelligence',
    desc: 'Extracts winning quotes, color palettes, themes, and personalization elements from top-converting listings.',
    demo: (
      <div className="mt-5 space-y-2 text-[12px]">
        {[
          { label: 'Top Quotes', value: '"Forever in our hearts", "Always by my side"' },
          { label: 'Materials', value: 'Black Serif on Clear 3mm Acrylic' },
          { label: 'Personalization', value: 'Pet Photo + Name + Memorial Year' },
        ].map((row) => (
          <div key={row.label} className="flex gap-3 py-2 px-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <span className="text-neutral-500 whitespace-nowrap">{row.label}</span>
            <span className="text-neutral-300">{row.value}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Factory,
    span: 'lg:col-span-7',
    title: 'Production Guard',
    desc: 'Automatically flags SKIP when Printway factory fit is below 75% or margins fall under hurdle rates.',
    demo: (
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
        <div className="p-3.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
          <div className="text-emerald-400 font-semibold mb-1">Acrylic Ornament → BUILD</div>
          <div className="text-neutral-400">Fit: 96% · Margin: 52% · Lead: 24h</div>
        </div>
        <div className="p-3.5 rounded-lg bg-red-500/5 border border-red-500/10">
          <div className="text-red-400 font-semibold mb-1">Metal Pet Tag → SKIP</div>
          <div className="text-neutral-400">Fit: 34% · Equipment gap · Margin: 18%</div>
        </div>
      </div>
    ),
  },
];

export const LandingBentoShowcase: React.FC = () => {
  return (
    <section id="preview" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[12px] uppercase tracking-[0.15em] text-neutral-500 font-medium mb-3">
            Under the Hood
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white mb-3">
            Four engines. One verdict.
          </h2>
          <p className="text-neutral-400 text-[15px] leading-relaxed">
            Each module contributes a normalized score that feeds the deterministic decision engine.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {engines.map((e, idx) => {
            const Icon = e.icon;
            return (
              <div
                key={idx}
                className={`${e.span} rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.03] hover:border-white/[0.1] transition-all duration-300 group`}
              >
                <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.06] flex items-center justify-center text-neutral-400 group-hover:text-blue-400 transition-colors mb-4">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-[16px] font-semibold text-white tracking-[-0.01em] mb-1.5">
                  {e.title}
                </h3>
                <p className="text-neutral-500 text-[13px] leading-relaxed">
                  {e.desc}
                </p>
                {e.demo}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
