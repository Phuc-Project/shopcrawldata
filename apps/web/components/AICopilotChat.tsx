'use client';

import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, FileText, CheckCircle, AlertTriangle, XCircle, Sliders, Database, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { ProductMockup } from '@/components/ui/ProductMockup';

interface QueryResult {
  query: string;
  timestamp: string;
  status: 'BUILD' | 'WATCH' | 'SKIP';
  title: string;
  score: number;
  niche: string;
  category: string;
  unitEconomics: {
    blankCost: string;
    printCost: string;
    totalMfgCost: string;
    medianRetailPrice: string;
    grossMargin: string;
  };
  metrics: {
    monthlySearchVolume: string;
    demandVelocity: string;
    competitionGrowth: string;
    opportunityGap: string;
    factoryFit: string;
  };
  factoryLine: string;
  summary: string;
  recommendedAction: string;
  productId: string;
}

interface AICopilotChatProps {
  onSelectReport: (oppId: string) => void;
  externalPrompt?: string;
}

export const AICopilotChat: React.FC<AICopilotChatProps> = ({ onSelectReport, externalPrompt }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activePreset, setActivePreset] = useState<string>('q4-growth');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);

  const presets = [
    {
      id: 'q4-growth',
      label: 'Fast-Growing Q4 Products',
      desc: 'High demand velocity with positive opportunity gap',
      query: 'Find the fastest growing personalized products for Q4',
    },
    {
      id: 'niche-compare',
      label: 'Niche Feasibility Benchmark',
      desc: 'Cross-market comparison across Etsy, Amazon & TikTok',
      query: 'Compare Pet Memorial vs Grandpa Gift vs Gardening Sign',
    },
    {
      id: 'metal-tag',
      label: 'Bottleneck Audit: Metal Pet Tag',
      desc: 'Market demand vs factory machine compatibility test (SKIP case)',
      query: 'Audit manufacturing feasibility for Metal Pet Tag',
    },
  ];

  useEffect(() => {
    runQuery(externalPrompt || presets[0].query);
  }, [externalPrompt]);

  const runQuery = (queryText: string) => {
    setLoading(true);
    setSearchTerm(queryText);

    setTimeout(() => {
      const lower = queryText.toLowerCase();

      if (lower.includes('metal') || lower.includes('pet tag')) {
        setResult({
          query: queryText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'SKIP',
          title: 'Metal Pet ID Tag (Deep Laser Engraved)',
          score: 42,
          niche: 'Pet Supplies > Identification Tags',
          category: 'Pet Accessories',
          unitEconomics: {
            blankCost: '$1.80 (Stainless Steel Blank)',
            printCost: '$3.50 (Fiber Laser Tooling)',
            totalMfgCost: '$5.30',
            medianRetailPrice: '$9.99 - $12.99',
            grossMargin: '18% (Sub-threshold)',
          },
          metrics: {
            monthlySearchVolume: '142,000 / mo',
            demandVelocity: '+24% (30D)',
            competitionGrowth: '+48% (Saturated)',
            opportunityGap: '-24% (Negative)',
            factoryFit: '34% (Machine Limit)',
          },
          factoryLine: 'Laser Engraving (Equipment Bottleneck)',
          summary: 'Although raw search volume is moderate, high marketplace competition has compressed retail prices. Printway gross margin fails the 35% hurdle rate and laser tool wear is too high.',
          recommendedAction: 'SKIP manufacturing. Divert capacity toward high-margin Acrylic or Wooden plaques.',
          productId: 'opp-04',
        });
      } else if (lower.includes('grandpa') || lower.includes('wood') || lower.includes('compare')) {
        setResult({
          query: queryText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'BUILD',
          title: "Grandpa's Keepsake Wooden Plaque",
          score: 87,
          niche: 'Family Gifts > Grandparents',
          category: 'Family Gifts',
          unitEconomics: {
            blankCost: '$2.10 (Birch Plywood)',
            printCost: '$3.40 (UV Flatbed Print)',
            totalMfgCost: '$5.50',
            medianRetailPrice: '$21.99',
            grossMargin: '46.8%',
          },
          metrics: {
            monthlySearchVolume: '96,000 / mo',
            demandVelocity: '+31% (30D)',
            competitionGrowth: '+12% (Moderate)',
            opportunityGap: '+19% (Healthy)',
            factoryFit: '94% (Full Compatibility)',
          },
          factoryLine: 'Laser Cut Plywood + UV Flatbed Line',
          summary: 'Steady gift-buying velocity on Etsy and Amazon with high emotional intent. High repeat conversions with multi-grandkid personalization.',
          recommendedAction: 'BUILD. Launch 15 design variants focusing on fishing, workshop, and handprint illustrations.',
          productId: 'opp-02',
        });
      } else {
        setResult({
          query: queryText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'BUILD',
          title: 'Pet Memorial Acrylic Keepsake Ornament',
          score: 91,
          niche: 'Home Decor > Seasonal Ornaments',
          category: 'Home Decor & Gifts',
          unitEconomics: {
            blankCost: '$1.40 (3mm Cast Acrylic)',
            printCost: '$2.80 (UV Flatbed Print)',
            totalMfgCost: '$4.20',
            medianRetailPrice: '$19.99',
            grossMargin: '52.4%',
          },
          metrics: {
            monthlySearchVolume: '184,000 / mo',
            demandVelocity: '+43% (30D)',
            competitionGrowth: '+12% (Low)',
            opportunityGap: '+31% (High Uncrowded)',
            factoryFit: '96% (UV Line Optimized)',
          },
          factoryLine: '3mm Cast Acrylic UV Flatbed Line',
          summary: 'Surging demand (+43%) outpaces seller supply (+12%). High margins (>52%) and perfect compatibility with Printway 3mm acrylic tooling.',
          recommendedAction: 'BUILD IMMEDIATELY. Prioritize production for Q4 holiday launch window.',
          productId: 'opp-01',
        });
      }

      setLoading(false);
    }, 400);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
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
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-[-0.02em] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <span>AI Copilot R&amp;D Studio</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Ask natural language questions about marketplace trends, SKU feasibility, and factory line constraints.
        </p>
      </div>

      {/* Query Bar */}
      <div className="rounded-2xl border border-white/10 bg-neutral-950 p-4 shadow-xl space-y-3">
        <div className="flex items-center bg-white/[0.04] border border-white/10 rounded-xl p-1 pl-4 focus-within:border-blue-500/50 transition-all">
          <Search className="w-4 h-4 text-neutral-500 mr-2 flex-shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runQuery(searchTerm)}
            placeholder="Ask anything: e.g. Evaluate Q4 acrylic ornaments vs metal tags..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-neutral-500 text-xs font-normal"
          />
          <button
            onClick={() => runQuery(searchTerm)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Query Engine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Query Presets */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[11px] text-neutral-500 font-medium">Quick Prompts:</span>
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => runQuery(p.query)}
              className="px-3 py-1 rounded-lg border border-white/[0.06] text-neutral-400 hover:text-white hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] transition-all text-[11px] cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Structured Result Display */}
      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-neutral-950 p-12 text-center text-neutral-400 text-xs">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span>Synthesizing multi-marketplace data &amp; validating Printway factory BOM...</span>
        </div>
      ) : result && (
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-900/90 via-neutral-950/90 to-black p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Result Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-black border uppercase tracking-wider font-mono ${getStatusBadge(result.status)}`}>
                  DECISION: {result.status}
                </span>
                <span className="text-[11px] text-neutral-400 bg-white/[0.06] px-2.5 py-0.5 rounded-md border border-white/10 font-mono">
                  Score: {result.score}/100
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {result.title}
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                {result.category} • Standardized Line: <strong className="text-neutral-200">{result.factoryLine}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/product/${result.productId}`}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Open Full Spec Sheet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Grid Layout: Visual Mockup + Economics + Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Column 1: Mockup Thumbnail (4 cols) */}
            <div className="lg:col-span-4">
              <ProductMockup type={result.productId} className="h-56 w-full" />
            </div>

            {/* Column 2: Unit Economics (4 cols) */}
            <div className="lg:col-span-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4 space-y-2 text-xs">
              <div className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                <span>Printway Unit Economics</span>
              </div>

              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-neutral-400">Blank Cost:</span>
                <span className="text-neutral-200 font-mono font-medium">{result.unitEconomics.blankCost}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-neutral-400">Print / Labor:</span>
                <span className="text-neutral-200 font-mono font-medium">{result.unitEconomics.printCost}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-neutral-400">Total Mfg BOM:</span>
                <span className="text-white font-mono font-bold">{result.unitEconomics.totalMfgCost}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-neutral-400">Target Retail:</span>
                <span className="text-white font-mono font-bold">{result.unitEconomics.medianRetailPrice}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Gross Margin:</span>
                <strong className={`font-mono font-black ${result.status === 'BUILD' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {result.unitEconomics.grossMargin}
                </strong>
              </div>
            </div>

            {/* Column 3: Multi-Market Metrics (4 cols) */}
            <div className="lg:col-span-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4 space-y-2 text-xs">
              <div className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-400" />
                <span>Marketplace Signals</span>
              </div>

              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-neutral-400">Search Volume:</span>
                <span className="text-white font-mono font-medium">{result.metrics.monthlySearchVolume}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-neutral-400">Demand Velocity:</span>
                <span className="text-emerald-400 font-mono font-bold">{result.metrics.demandVelocity}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-neutral-400">Competition Growth:</span>
                <span className="text-neutral-300 font-mono font-medium">{result.metrics.competitionGrowth}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-neutral-400">Opportunity Gap:</span>
                <span className="text-blue-400 font-mono font-bold">{result.metrics.opportunityGap}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Factory Fit:</span>
                <strong className={`font-mono ${result.status === 'BUILD' ? 'text-purple-400' : 'text-red-400'}`}>
                  {result.metrics.factoryFit}
                </strong>
              </div>
            </div>
          </div>

          {/* Detailed Summary & Action Card */}
          <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] leading-relaxed">
              <strong className="text-white block mb-1">R&amp;D Feasibility Summary:</strong>
              <p className="text-neutral-300">{result.summary}</p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 leading-relaxed">
              <strong className="text-blue-300 block mb-1">Recommended Manufacturing Action:</strong>
              <p className="text-blue-100">{result.recommendedAction}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
