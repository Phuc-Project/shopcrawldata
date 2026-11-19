'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, Sparkles, BarChart3, Radio, Database, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AppNavbar: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { href: '/opportunities', label: 'Opportunities', icon: Layers },
    { href: '/copilot', label: 'AI Copilot Studio', icon: Sparkles },
    { href: '/compare', label: 'Niche Compare', icon: BarChart3 },
    { href: '/radar', label: 'Trend Radar', icon: Radio },
    { href: '/catalog', label: 'Printway Catalog', icon: Database },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 h-16 bg-[#07090e]/90 backdrop-blur-md border-b border-zinc-800/80 z-40 flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm text-white shadow-sm group-hover:bg-blue-500 transition-colors">
              O
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-zinc-100 font-display">
                OpportunityOS
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-blue-950 text-blue-400 border border-blue-800/60 rounded font-semibold uppercase">
                PW1
              </span>
            </div>
          </Link>

          {/* Subpage Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-medium">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-zinc-800 text-white font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right CTA / Live status */}
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>Landing</span>
          </Link>

          <Link href="/copilot">
            <Button size="sm" variant="glow" className="text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Ask Copilot
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
