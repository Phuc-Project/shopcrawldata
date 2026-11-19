'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const LandingCTA: React.FC = () => {
  return (
    <section className="py-24 relative border-t border-white/[0.06] overflow-hidden">
      {/* Background glow */}
      <div className="hero-glow bg-blue-600 bottom-[-150px] left-1/2 -translate-x-1/2 opacity-10" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.04em] text-white mb-4">
          Ready to discover your next winning product?
        </h2>
        <p className="max-w-xl mx-auto text-[16px] text-neutral-400 mb-8 leading-relaxed">
          Access real-time multi-marketplace intelligence, deterministic scoring, and factory-ready spec sheets.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="group flex items-center justify-center gap-2 px-6 py-3 text-[14px] font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
          >
            <span>Launch R&D Studio</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <a
            href="#sandbox"
            className="px-5 py-3 text-[14px] font-medium text-neutral-400 hover:text-white border border-white/[0.08] hover:border-white/[0.16] rounded-xl transition-colors"
          >
            Try Scoring Sandbox
          </a>
        </div>
      </div>
    </section>
  );
};
