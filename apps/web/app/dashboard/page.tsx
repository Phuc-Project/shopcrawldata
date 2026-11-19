'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { WorkspaceLayout } from '@/components/layout/WorkspaceLayout';
import { OpportunityFeed } from '@/components/OpportunityFeed';
import { AICopilotChat } from '@/components/AICopilotChat';
import { NicheMatrixTable } from '@/components/NicheMatrixTable';
import { TrendRadarAlerts } from '@/components/TrendRadarAlerts';
import { ReportModal } from '@/components/ReportModal';
import { Layers, Sparkles, BarChart3, Radio } from 'lucide-react';

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('prompt') || '';

  const [selectedOppId, setSelectedOppId] = useState<string | null>(null);
  const [externalPrompt, setExternalPrompt] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'feed' | 'copilot' | 'matrix' | 'radar'>('feed');

  useEffect(() => {
    if (initialPrompt) {
      setExternalPrompt(initialPrompt);
      setActiveTab('copilot');
    }
  }, [initialPrompt]);

  return (
    <WorkspaceLayout title="R&D Studio Overview" category="Dashboard">
      <div className="space-y-6">
        {/* Workspace Sub-Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'feed'
                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Opportunity Feed</span>
          </button>

          <button
            onClick={() => setActiveTab('copilot')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'copilot'
                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Copilot Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'matrix'
                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            <span>Niche Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('radar')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'radar'
                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>Trend Radar</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'feed' && (
          <OpportunityFeed onSelectOpportunity={(id) => setSelectedOppId(id)} />
        )}

        {activeTab === 'copilot' && (
          <AICopilotChat
            onSelectReport={(id) => setSelectedOppId(id)}
            externalPrompt={externalPrompt}
          />
        )}

        {activeTab === 'matrix' && <NicheMatrixTable />}

        {activeTab === 'radar' && <TrendRadarAlerts />}

        {/* Report Modal */}
        <ReportModal oppId={selectedOppId} onClose={() => setSelectedOppId(null)} />
      </div>
    </WorkspaceLayout>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-400">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
