'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Factory, ArrowRight, Star, ShoppingBag, Eye, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { ProductMockup } from '@/components/ui/ProductMockup';

const trendData = [
  { day: 'W1', etsy: 120, amazon: 90, tiktok: 140, total: 350 },
  { day: 'W2', etsy: 190, amazon: 140, tiktok: 280, total: 610 },
  { day: 'W3', etsy: 310, amazon: 220, tiktok: 520, total: 1050 },
  { day: 'W4', etsy: 480, amazon: 340, tiktok: 980, total: 1800 },
  { day: 'W5', etsy: 650, amazon: 490, tiktok: 1450, total: 2590 },
  { day: 'W6', etsy: 890, amazon: 680, tiktok: 2100, total: 3670 },
  { day: 'W7', etsy: 1240, amazon: 940, tiktok: 3200, total: 5380 },
];

const markets = [
  { key: 'all', label: 'Combined Streams', color: '#3b82f6' },
  { key: 'etsy', label: 'Etsy OpenAPI', color: '#f97316' },
  { key: 'tiktok', label: 'TikTok Shop', color: '#a855f7' },
] as const;

type MarketKey = typeof markets[number]['key'];

const materials = {
  acrylic: {
    mockup: 'acrylic_ornament',
    name: '3mm Cast Acrylic (UV Flatbed Line)',
    margin: '52.4%',
    cost: '$4.20',
    price: '$19.99',
    fit: 96,
    verdict: 'BUILD' as const,
    bottleneck: 'None (In-House Line Ready)',
    leadTime: '24-48 hours',
  },
  plywood: {
    mockup: 'wooden_plaque',
    name: 'Laser Cut Birch Plywood (UV Print)',
    margin: '46.8%',
    cost: '$5.50',
    price: '$21.99',
    fit: 88,
    verdict: 'BUILD' as const,
    bottleneck: 'Laser Engraving Bed Limit',
    leadTime: '48 hours',
  },
  canvas: {
    mockup: 'canvas_print',
    name: 'Stretched Poly-Cotton Canvas 8×10',
    margin: '38.0%',
    cost: '$8.90',
    price: '$24.99',
    fit: 72,
    verdict: 'WATCH' as const,
    bottleneck: 'Manual Stretching Labor',
    leadTime: '72 hours',
  },
};

type MaterialKey = keyof typeof materials;

export const HeroLiveShowcase: React.FC = () => {
  const [selectedMarket, setSelectedMarket] = useState<MarketKey>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialKey>('acrylic');
  const mat = materials[selectedMaterial];

  const verdictColor = mat.verdict === 'BUILD'
    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    : 'text-amber-400 bg-amber-500/10 border-amber-500/30';

  const dataKey = selectedMarket === 'all' ? 'total' : selectedMarket;
  const strokeColor = markets.find(m => m.key === selectedMarket)?.color || '#3b82f6';

  return (
    <section className="py-16 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section label */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-[12px] font-medium tracking-wide mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Live Cross-Marketplace Feasibility Engine
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-[-0.03em] text-white">
            Auditing: Pet Memorial Keepsake Series
          </h2>
          <p className="text-neutral-400 text-sm mt-2">
            Standardized SKU candidate evaluated against Printway UV &amp; Laser manufacturing lines.
          </p>
        </div>

        {/* Master Card */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-900/80 via-neutral-950/90 to-black p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
          {/* Top Bar with Live Marketplace Badges */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-semibold">
                <span>Etsy</span>
                <span className="text-white font-mono">#1 Bestseller</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-semibold">
                <span>Amazon PA</span>
                <span className="text-white font-mono">BSR #4,312</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-400 text-xs font-semibold">
                <span>TikTok Shop</span>
                <span className="text-white font-mono">4.2M views</span>
              </div>
            </div>

            {/* Score Pill */}
            <div className="flex items-center gap-4 bg-white/[0.04] px-4 py-2 rounded-2xl border border-white/10">
              <div className="text-right">
                <div className="text-[10px] text-neutral-400 uppercase font-medium">Opportunity Score</div>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  91<span className="text-neutral-500 text-xs font-normal">/100</span>
                </div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${verdictColor}`}>
                {mat.verdict}
              </span>
            </div>
          </div>

          {/* 3-Column Visual Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-center">
            {/* Column 1: Live Interactive Product Mockup (4 cols) */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="w-full">
                <div className="text-xs font-semibold text-neutral-300 mb-2 flex items-center justify-between">
                  <span>Factory Production Render</span>
                  <span className="text-[11px] text-blue-400 font-mono">3D Simulation</span>
                </div>
                <ProductMockup type={mat.mockup} className="h-60 w-full" />
                
                {/* Material Switcher Pills */}
                <div className="grid grid-cols-3 gap-1.5 bg-neutral-900/90 p-1.5 rounded-xl border border-white/10 mt-3 text-xs">
                  {(Object.keys(materials) as MaterialKey[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => setSelectedMaterial(key)}
                      className={`py-1.5 rounded-lg font-medium transition-all cursor-pointer text-center ${
                        selectedMaterial === key
                          ? 'bg-blue-600 text-white font-bold shadow-md'
                          : 'text-neutral-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {key === 'acrylic' ? 'Acrylic' : key === 'plywood' ? 'Plywood' : 'Canvas'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: 7-Week Multi-Marketplace Velocity Chart (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Multi-Market Velocity (Units/Week)
                </div>

                <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-lg border border-white/10 text-[11px]">
                  {markets.map((m) => (
                    <button
                      key={m.key}
                      onClick={() => setSelectedMarket(m.key)}
                      className={`px-2 py-0.5 rounded-md font-medium transition-all cursor-pointer ${
                        selectedMarket === m.key
                          ? 'bg-white/10 text-white font-bold'
                          : 'text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {m.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Area Chart Container */}
              <div className="h-44 w-full rounded-2xl bg-black/50 border border-white/[0.08] p-2.5">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="liveFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={strokeColor} stopOpacity={0.4} />
                        <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#09090b',
                        borderColor: '#27272a',
                        borderRadius: '8px',
                        fontSize: '11px',
                        color: '#ffffff',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey={dataKey}
                      stroke={strokeColor}
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#liveFill)"
                      name="Units Sold"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Stats Footer */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-neutral-500 text-[10px] uppercase font-medium">Opportunity Gap</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono">+31% (Uncrowded)</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-neutral-500 text-[10px] uppercase font-medium">Search Velocity</div>
                  <div className="text-sm font-bold text-white font-mono">184,000 / mo</div>
                </div>
              </div>
            </div>

            {/* Column 3: Factory BOM & Specs (3 cols) */}
            <div className="lg:col-span-3 rounded-2xl bg-white/[0.03] border border-white/10 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-white/[0.06]">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Factory className="w-3.5 h-3.5 text-blue-400" />
                  Printway BOM
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Fit: {mat.fit}%
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="text-[10px] text-neutral-400">Mfg Line</div>
                  <div className="text-neutral-200 font-medium text-[11px] truncate">{mat.name}</div>
                </div>
                
                <div className="flex justify-between py-1 border-t border-white/[0.04]">
                  <span className="text-neutral-400">BOM Unit Cost:</span>
                  <span className="text-neutral-200 font-mono font-bold">{mat.cost}</span>
                </div>
                
                <div className="flex justify-between py-1 border-t border-white/[0.04]">
                  <span className="text-neutral-400">Target Retail:</span>
                  <span className="text-white font-mono font-bold">{mat.price}</span>
                </div>

                <div className="flex justify-between py-1 border-t border-white/[0.04]">
                  <span className="text-neutral-400">Gross Margin:</span>
                  <span className="text-emerald-400 font-mono font-black text-sm">{mat.margin}</span>
                </div>

                <div className="flex justify-between py-1 border-t border-white/[0.04] text-[11px]">
                  <span className="text-neutral-400">Lead Time:</span>
                  <span className="text-neutral-300 font-medium">{mat.leadTime}</span>
                </div>
              </div>

              <Link
                href="/product/opp-01"
                className="w-full mt-2 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md cursor-pointer"
              >
                <span>Export Spec Sheet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
