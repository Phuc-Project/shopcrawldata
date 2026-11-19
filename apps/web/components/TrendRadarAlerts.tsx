'use client';

import React from 'react';
import { EARLY_ALERTS } from '@/lib/data';
import { Radio, Zap, Clock, ArrowUpRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export const TrendRadarAlerts: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-[-0.02em] flex items-center gap-2">
          <Radio className="w-5 h-5 text-emerald-400" />
          <span>Real-Time Trend Velocity Radar</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Automated multi-marketplace stream detection flagging surging keyword volume before category saturation.
        </p>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {EARLY_ALERTS.map((alert) => (
          <div
            key={alert.id}
            className="rounded-3xl border border-white/10 bg-neutral-950 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl hover:border-white/20 transition-all group"
          >
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <strong className="text-white text-base font-bold">
                    "{alert.keyword}"
                  </strong>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                    {alert.confidence} Confidence
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-neutral-400">
                  <span>Demand Velocity: <strong className="text-emerald-400 font-mono font-bold">{alert.demand_velocity}</strong></span>
                  <span>Comp Growth: <strong className="text-neutral-300 font-mono">{alert.competition_velocity}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-neutral-500">
                <Clock className="w-3.5 h-3.5" />
                <span>{alert.time_ago}</span>
              </div>

              <Link
                href="/copilot"
                className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-blue-600 hover:text-white text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Audit in Copilot</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
