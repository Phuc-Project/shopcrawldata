'use client';

import React from 'react';
import { WorkspaceLayout } from '@/components/layout/WorkspaceLayout';
import { AICopilotChat } from '@/components/AICopilotChat';
import { useRouter } from 'next/navigation';

export default function CopilotPage() {
  const router = useRouter();

  const handleSelectReport = (oppId: string) => {
    router.push(`/product/${oppId}`);
  };

  return (
    <WorkspaceLayout title="AI Copilot Studio" category="R&D Studio">
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block mb-1">
            Autonomous R&D Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            AI Product Research Copilot
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Chat directly with the Copilot to query marketplaces, normalize product titles, and verify Printway factory feasibility.
          </p>
        </div>

        <AICopilotChat onSelectReport={handleSelectReport} />
      </div>
    </WorkspaceLayout>
  );
}
