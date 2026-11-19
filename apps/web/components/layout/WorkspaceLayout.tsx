'use client';

import * as React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';

interface WorkspaceLayoutProps {
  title?: string;
  category?: string;
  children: React.ReactNode;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  title,
  category = 'R&D Studio',
  children,
}) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-black text-neutral-100">
        <AppSidebar />
        
        <SidebarInset className="flex-1 flex flex-col min-w-0 bg-black">
          {/* Top Bar with Trigger & Breadcrumb */}
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/[0.06] bg-black/80 px-6 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="h-4 w-px bg-white/[0.08]" />
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span>{category}</span>
                {title && (
                  <>
                    <span className="text-neutral-600">/</span>
                    <span className="font-semibold text-neutral-200">{title}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Live Feed</span>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
