'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WorkspaceLayout } from '@/components/layout/WorkspaceLayout';
import { OPPORTUNITIES, OpportunityItem } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Layers, FileText } from 'lucide-react';

export default function OpportunitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredItems = OPPORTUNITIES.filter((opp) => {
    const matchSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        opp.niche.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || opp.recommendation.toLowerCase() === statusFilter.toLowerCase();
    const matchCategory = categoryFilter === 'all' || opp.category.toLowerCase().includes(categoryFilter.toLowerCase());
    return matchSearch && matchStatus && matchCategory;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <WorkspaceLayout title="Opportunity Feed" category="R&D Studio">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block mb-1">
            R&D Opportunity Stream
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Candidate Products ({filteredItems.length})
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Algorithmic scoring combining demand velocity, competition gap, and Printway factory capability.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative w-60">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products or niches..."
              className="pl-9 h-9 text-xs"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-700/80 text-zinc-200 text-xs rounded-xl px-3 h-9 outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Verdicts</option>
            <option value="build">BUILD (≥80 Score)</option>
            <option value="watch">WATCH (60-79)</option>
            <option value="skip">SKIP (&lt;60 or Low Fit)</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-700/80 text-zinc-200 text-xs rounded-xl px-3 h-9 outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="decor">Home Decor</option>
            <option value="family">Family Gifts</option>
            <option value="pet">Pet Products</option>
          </select>
        </div>
      </div>

      {/* Opportunity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {filteredItems.map((opp) => {
          const scoreColor = getScoreColor(opp.score);
          const strokeDashoffset = 251.2 * (1 - opp.score / 100);

          return (
            <Card key={opp.id} className="p-5 bg-[#0d101a] border-zinc-800 hover:border-zinc-700 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={opp.recommendation.toLowerCase() as any}>
                        {opp.recommendation}
                      </Badge>
                      <span className="text-[11px] text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded font-medium border border-zinc-700/50">
                        {opp.badge}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-white font-display">
                      {opp.title}
                    </h2>
                    <div className="text-xs text-zinc-400 mt-1">
                      {opp.category} • <span className="text-zinc-300">{opp.niche}</span>
                    </div>
                  </div>

                  {/* Circular Score Ring */}
                  <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 90 90">
                      <circle cx="45" cy="45" r="40" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="transparent" />
                      <circle
                        cx="45"
                        cy="45"
                        r="40"
                        stroke={scoreColor}
                        strokeWidth="8"
                        strokeDasharray="251.2"
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>
                    <div className="absolute text-center font-display font-bold text-base text-white">
                      {opp.score}<span className="text-[10px] text-zinc-500 font-normal">/100</span>
                    </div>
                  </div>
                </div>

                {/* Metrics List */}
                <div className="space-y-2 bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 my-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Demand Growth</span>
                    <div className="flex-1 mx-3 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${opp.metrics.growth}%` }} />
                    </div>
                    <span className="font-semibold text-emerald-400 min-w-10 text-right">{opp.growth_30d}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Opportunity Gap</span>
                    <div className="flex-1 mx-3 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${opp.metrics.demand}%` }} />
                    </div>
                    <span className="font-semibold text-blue-400 min-w-10 text-right">{opp.opportunity_gap}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Printway Factory Fit</span>
                    <div className="flex-1 mx-3 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${opp.printway_fit}%` }} />
                    </div>
                    <span className="font-semibold text-purple-400 min-w-10 text-right">{opp.printway_fit}%</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <div className="text-zinc-400">
                  Material: <strong className="text-zinc-200 font-medium">{opp.material}</strong>
                </div>

                <Link href={`/product/${opp.id}`}>
                  <Button size="sm" variant="outline" className="text-xs">
                    <FileText className="w-3.5 h-3.5 mr-1 text-blue-400" />
                    View Research Report
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </WorkspaceLayout>
  );
}
