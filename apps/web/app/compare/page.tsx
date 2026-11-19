'use client';

import React from 'react';
import { WorkspaceLayout } from '@/components/layout/WorkspaceLayout';
import { NicheMatrixTable } from '@/components/NicheMatrixTable';
import { LiveScoreCalculator } from '@/components/landing/LiveScoreCalculator';

export default function ComparePage() {
  return (
    <WorkspaceLayout title="Niche Decision Matrix" category="Analytics">
      <div className="space-y-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block mb-1">
            Decision & Feasibility Matrix
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Niche Comparison & Weight Calibration
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Compare candidate niches side-by-side across 7 normalized features and Printway factory capability.
          </p>
        </div>

        {/* Niche Matrix Table */}
        <NicheMatrixTable />

        {/* Live Weight Slider Sandbox */}
        <LiveScoreCalculator />
      </div>
    </WorkspaceLayout>
  );
}
