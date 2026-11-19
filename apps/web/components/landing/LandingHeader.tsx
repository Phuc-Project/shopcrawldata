'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const LandingHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14">
      <div className="h-full border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
              <span className="text-black font-bold text-xs tracking-tight">OS</span>
            </div>
            <span className="font-semibold text-[15px] tracking-[-0.03em] text-white">
              OpportunityOS
            </span>
          </Link>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: '#preview', label: 'Product' },
              { href: '#sandbox', label: 'Demo' },
              { href: '#positioning', label: 'Why Us' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-[13px] text-neutral-400 hover:text-white transition-colors rounded-md hover:bg-white/[0.04]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <Link
            href="/dashboard"
            className="group flex items-center gap-1.5 px-3.5 py-1.5 text-[13px] font-medium text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.08] hover:border-white/[0.16] rounded-lg transition-all duration-200"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>
      </div>
    </header>
  );
};
