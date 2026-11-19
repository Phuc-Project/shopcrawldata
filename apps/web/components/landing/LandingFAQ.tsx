'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    q: 'How does OpportunityOS compute the Opportunity Score without AI hallucination?',
    a: 'The Opportunity Score is calculated 100% deterministically from mathematical feature formulas (Demand Velocity 20%, 30D Growth 20%, Competition Gap 15%, Revenue Potential 15%, Factory Line Fit 10%, Personalization 10%, Seasonality 10%). Machine learning models are strictly used for semantic entity extraction and text clustering.',
  },
  {
    q: 'What is the Opportunity Gap metric?',
    a: 'Opportunity Gap = Demand Growth % − Seller Listing Competition Growth %. A positive gap (such as +31% on Pet Memorial Acrylic Ornaments) indicates buyer search volume is accelerating significantly faster than new sellers are entering, creating an uncrowded market opportunity window.',
  },
  {
    q: 'How does Printway factory production validation work?',
    a: 'OpportunityOS integrates directly with Printway\'s production catalog (materials, machine compatibility, tooling constraints, and minimum gross margin hurdle rate of 35%+). If an item is trending on Etsy but Printway cannot manufacture it profitably (e.g. laser engraved metal pet tags), OpportunityOS issues a SKIP recommendation.',
  },
  {
    q: 'Which marketplaces are connected to OpportunityOS?',
    a: 'OpportunityOS supports live API connectors to Etsy OpenAPI v3, Amazon Product Advertising API, TikTok Shop (Kalodata Open Center), and Google Trends API, alongside offline HAR capture file ingestion.',
  },
];

export const LandingFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 relative border-t border-white/[0.06]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[12px] uppercase tracking-[0.15em] text-neutral-500 font-medium mb-3">
            Technical & Business FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white mb-3">
            Frequently asked questions
          </h2>
          <p className="text-neutral-400 text-[15px] leading-relaxed">
            Deterministic scoring, Opportunity Gap metrics, and factory calibration details.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 cursor-pointer hover:bg-white/[0.03] hover:border-white/[0.1] transition-all"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-[15px] font-semibold text-white">
                  {f.q}
                </h3>
                {openIndex === i ? (
                  <ChevronUp className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-600 flex-shrink-0" />
                )}
              </div>

              {openIndex === i && (
                <p className="text-[13px] text-neutral-400 mt-3 pt-3 border-t border-white/[0.06] leading-relaxed">
                  {f.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
