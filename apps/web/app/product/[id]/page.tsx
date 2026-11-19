'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { WorkspaceLayout } from '@/components/layout/WorkspaceLayout';
import { OPPORTUNITIES } from '@/lib/data';
import { ProductMockup } from '@/components/ui/ProductMockup';
import { ArrowLeft, Copy, Printer, Check, Target, TrendingUp, Factory, Palette, DollarSign, CheckCircle2 } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const opp = OPPORTUNITIES.find((o) => o.id === id) || OPPORTUNITIES[0];

  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = () => {
    const md = `# PRINTWAY R&D PRODUCT RESEARCH SPEC SHEET
Target SKU: ${opp.title.toUpperCase()}
Category: ${opp.category} | Niche: ${opp.niche}
Season: ${opp.season}
Recommendation: ${opp.recommendation} (Score: ${opp.score}/100)

## 1. Unit Economics & Printway Factory Fit
- Manufacturing Line: ${opp.product_type}
- Material Spec: ${opp.material}
- Factory Fit Score: ${opp.printway_fit}%
- Recommended Retail Price: ${opp.recommended_price}
- Target Gross Margin: >45%

## 2. Multi-Marketplace Evidence
- Etsy: ${opp.marketplace_evidence.etsy.listings_count} listings | Median $${opp.marketplace_evidence.etsy.median_price} | Sales ${opp.marketplace_evidence.etsy.est_sales_growth}
- Amazon: ${opp.marketplace_evidence.amazon.listings_count} listings | Median $${opp.marketplace_evidence.amazon.median_price} | BSR #${opp.marketplace_evidence.amazon.bsr_rank}
- TikTok Shop: ${opp.marketplace_evidence.tiktok.video_views} views | Velocity ${opp.marketplace_evidence.tiktok.hashtag_velocity}

## 3. Design Intelligence (15 Angles)
- Top Quotes: ${opp.design_insights.quotes.join(', ')}
- Colors: ${opp.design_insights.colors.join(', ')}
- Themes: ${opp.design_insights.themes.join(', ')}
- Personalization: ${opp.design_insights.personalization_elements.join(', ')}

## 4. R&D Audit Conclusion
${opp.reasoning}
`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getVerdictStyle = (rec: string) => {
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
    <WorkspaceLayout title={opp.title} category="Product Spec Sheet">
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Back Link */}
        <Link href="/opportunities" className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Opportunities Feed</span>
        </Link>

        {/* Master Header Card */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-900/90 via-neutral-950/90 to-black p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`px-3 py-1 rounded-md text-xs font-black border uppercase tracking-wider font-mono ${getVerdictStyle(opp.recommendation)}`}>
                RECOMMENDATION: {opp.recommendation}
              </span>
              <span className="text-xs text-neutral-300 bg-white/[0.06] px-2.5 py-0.5 rounded-md border border-white/10 font-medium">
                {opp.badge}
              </span>
              <span className="text-xs text-neutral-400 bg-neutral-800/80 px-2.5 py-0.5 rounded-md">
                {opp.season}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {opp.title}
            </h1>

            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Standardized Line: <strong className="text-neutral-200">{opp.product_type}</strong> • Category: <span className="text-neutral-300">{opp.category}</span>
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="text-left md:text-right">
              <div className="text-[10px] text-neutral-400 uppercase font-medium">Opportunity Score</div>
              <div className="text-3xl font-black text-emerald-400 font-mono">
                {opp.score}<span className="text-neutral-600 text-xs font-normal">/100</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyMarkdown}
                className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-medium border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
                <span>{copied ? 'Copied MD' : 'Copy Spec Markdown'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Spec PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Visual Render & Factory Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 3D Product Simulation (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-neutral-950 p-6 space-y-4">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-white/[0.06]">
              <span className="font-bold text-white">Product Visual Simulation</span>
              <span className="text-blue-400 font-mono text-[11px]">Printway Line Preview</span>
            </div>
            <ProductMockup type={opp.id} className="h-64 w-full" />

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">Target Material:</span>
                <strong className="text-white font-mono">{opp.material}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Target Price Window:</span>
                <strong className="text-emerald-400 font-mono">{opp.recommended_price}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Suggested Launch Window:</span>
                <strong className="text-neutral-200">{opp.suggested_launch}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Printway Factory Fit:</span>
                <strong className="text-purple-400 font-mono">{opp.printway_fit}%</strong>
              </div>
            </div>
          </div>

          {/* Right Column: Multi-Marketplace Evidence & Design Intelligence (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Multi-Marketplace Signals */}
            <div className="rounded-3xl border border-white/10 bg-neutral-950 p-6 space-y-4">
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/[0.06]">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Cross-Marketplace Validation Evidence</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Etsy */}
                <div className="p-3 rounded-2xl bg-orange-500/5 border border-orange-500/20 space-y-1">
                  <div className="text-orange-400 font-bold">Etsy OpenAPI v3</div>
                  <div className="text-neutral-300">Listings: <strong className="text-white font-mono">{opp.marketplace_evidence.etsy.listings_count}</strong></div>
                  <div className="text-neutral-300">Median: <strong className="text-white font-mono">${opp.marketplace_evidence.etsy.median_price}</strong></div>
                  <div className="text-emerald-400 font-bold">Sales: {opp.marketplace_evidence.etsy.est_sales_growth}</div>
                </div>

                {/* Amazon */}
                <div className="p-3 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-1">
                  <div className="text-blue-400 font-bold">Amazon PA-API</div>
                  <div className="text-neutral-300">Listings: <strong className="text-white font-mono">{opp.marketplace_evidence.amazon.listings_count}</strong></div>
                  <div className="text-neutral-300">Median: <strong className="text-white font-mono">${opp.marketplace_evidence.amazon.median_price}</strong></div>
                  <div className="text-blue-400 font-bold">BSR #{opp.marketplace_evidence.amazon.bsr_rank}</div>
                </div>

                {/* TikTok */}
                <div className="p-3 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-1">
                  <div className="text-purple-400 font-bold">TikTok Shop</div>
                  <div className="text-neutral-300">Views: <strong className="text-white font-mono">{opp.marketplace_evidence.tiktok.video_views}</strong></div>
                  <div className="text-purple-400 font-bold">Velocity: {opp.marketplace_evidence.tiktok.hashtag_velocity}</div>
                </div>
              </div>
            </div>

            {/* Design & Quotes Intelligence (15 Angles) */}
            <div className="rounded-3xl border border-white/10 bg-neutral-950 p-6 space-y-4">
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/[0.06]">
                <Palette className="w-4 h-4 text-amber-400" />
                <span>Design Intelligence &amp; Personalization Hooks</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-neutral-400 block mb-1">Top Buyer Quotes:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {opp.design_insights.quotes.map((q, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 font-medium">
                        "{q}"
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-neutral-400 block mb-1">Winning Colors &amp; Palettes:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {opp.design_insights.colors.map((c, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-neutral-200">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-neutral-400 block mb-1">Personalization Elements:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {opp.design_insights.personalization_elements.map((p, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-200 font-medium">
                        + {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: R&D Audit Reason & Manufacturing Strategy */}
        <div className="rounded-3xl border border-white/10 bg-neutral-950 p-6 sm:p-8 space-y-3 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-400" />
            <span>R&amp;D Decision Analysis &amp; Production Feasibility Audit</span>
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {opp.reasoning}
          </p>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
