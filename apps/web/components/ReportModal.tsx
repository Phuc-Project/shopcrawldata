'use client';

import React, { useState } from 'react';
import { OPPORTUNITIES, OpportunityItem } from '@/lib/data';
import { X, Copy, Printer, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ProductMockup } from '@/components/ui/ProductMockup';

interface ReportModalProps {
  oppId: string | null;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ oppId, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!oppId) return null;

  const opp = OPPORTUNITIES.find((o) => o.id === oppId) || OPPORTUNITIES[0];

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

  const handleCopyMarkdown = () => {
    const md = `# PRINTWAY R&D PRODUCT SPEC SHEET: ${opp.title.toUpperCase()}
Decision: ${opp.recommendation} | Opportunity Score: ${opp.score}/100
Category: ${opp.category} | Niche: ${opp.niche} (${opp.season})
Target Material: ${opp.material}
Recommended Retail: ${opp.recommended_price}
Factory Compatibility: ${opp.printway_fit}%

## Multi-Marketplace Signals
- Demand Velocity: ${opp.metrics.growth}/100 (${opp.growth_30d})
- Opportunity Gap: ${opp.opportunity_gap}

## R&D Conclusion
${opp.reasoning}`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-950 border border-white/10 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-black border uppercase tracking-wider font-mono ${getVerdictStyle(opp.recommendation)}`}>
                {opp.recommendation}
              </span>
              <span className="text-xs text-neutral-400 font-mono">Score: {opp.score}/100</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {opp.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-neutral-300">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-5">
              <ProductMockup type={opp.id} className="h-44 w-full" />
            </div>

            <div className="sm:col-span-7 bg-white/[0.02] p-4 rounded-2xl border border-white/[0.04] space-y-2">
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-neutral-400">Material Spec:</span>
                <strong className="text-white font-mono">{opp.material}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-neutral-400">Target Retail:</span>
                <strong className="text-emerald-400 font-mono">{opp.recommended_price}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-neutral-400">Printway Factory Fit:</span>
                <strong className="text-purple-400 font-mono">{opp.printway_fit}%</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Launch Window:</span>
                <span className="text-neutral-200">{opp.suggested_launch}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] space-y-1.5 leading-relaxed">
            <strong className="text-white block font-semibold">R&amp;D Feasibility Analysis:</strong>
            <p className="text-neutral-300">{opp.reasoning}</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-white/10 flex items-center justify-between bg-neutral-900/60">
          <Link
            href={`/product/${opp.id}`}
            onClick={onClose}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>Open Dedicated Spec Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/10 text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
              <span>{copied ? 'Copied' : 'Copy MD'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
