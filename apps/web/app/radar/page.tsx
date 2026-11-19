'use client';

import React from 'react';
import { WorkspaceLayout } from '@/components/layout/WorkspaceLayout';
import { TrendRadarAlerts } from '@/components/TrendRadarAlerts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function RadarPage() {
  return (
    <WorkspaceLayout title="Early Trend Radar" category="Intelligence">
      <div className="space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-1">
            Real-Time Anomaly Detection
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Early Trend Radar & Velocity Alerts
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Automated daily cron monitoring keyword surge velocity across Etsy, Amazon, and TikTok Shop before saturation.
          </p>
        </div>

        {/* Live Radar Feed */}
        <TrendRadarAlerts />

        {/* Technical Detection Logic */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <Card className="p-5 bg-[#0e111a] border-zinc-800">
            <CardHeader className="p-0 mb-3">
              <CardTitle className="text-sm text-cyan-400 font-display">1. Keyword Velocity Tracking</CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-xs text-zinc-400 leading-relaxed">
              Monitors search query acceleration on Etsy & Amazon. Flags spikes exceeding +50% weekly volume.
            </CardContent>
          </Card>

          <Card className="p-5 bg-[#0e111a] border-zinc-800">
            <CardHeader className="p-0 mb-3">
              <CardTitle className="text-sm text-emerald-400 font-display">2. Competition Lag Detection</CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-xs text-zinc-400 leading-relaxed">
              Measures seller response time. An alert triggers when demand velocity exceeds competitor listing growth by &gt;30%.
            </CardContent>
          </Card>

          <Card className="p-5 bg-[#0e111a] border-zinc-800">
            <CardHeader className="p-0 mb-3">
              <CardTitle className="text-sm text-purple-400 font-display">3. Multi-Platform Cross Verification</CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-xs text-zinc-400 leading-relaxed">
              Verifies if a trend appearing on TikTok Shop has corresponding search intent on Google Trends & Etsy.
            </CardContent>
          </Card>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
