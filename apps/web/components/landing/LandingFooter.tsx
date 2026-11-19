'use client';

import React from 'react';
import Link from 'next/link';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="py-10 border-t border-white/[0.06] text-neutral-500 text-xs bg-black">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center font-bold text-black text-[10px]">
            OS
          </div>
          <span className="font-semibold text-neutral-300 text-xs">OpportunityOS</span>
          <span className="text-neutral-600">•</span>
          <span>Printway R&D Product Intelligence</span>
        </div>

        <div className="flex items-center gap-6 text-neutral-500">
          <Link href="/dashboard" className="hover:text-neutral-300 transition-colors">Dashboard</Link>
          <Link href="/catalog" className="hover:text-neutral-300 transition-colors">Catalog</Link>
          <span>HN AI Hackathon 2026</span>
        </div>
      </div>
    </footer>
  );
};
