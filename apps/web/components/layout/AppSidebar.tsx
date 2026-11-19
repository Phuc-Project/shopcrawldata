'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Layers,
  Sparkles,
  BarChart3,
  Radio,
  Home,
  CheckCircle2,
  Factory,
} from 'lucide-react';

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

  const mainNav = [
    { href: '/opportunities', label: 'Opportunity Feed', icon: Layers, badge: '4 New' },
    { href: '/copilot', label: 'AI Copilot Studio', icon: Sparkles },
    { href: '/compare', label: 'Niche Decision Matrix', icon: BarChart3 },
    { href: '/radar', label: 'Early Trend Radar', icon: Radio, badge: 'Live' },
  ];

  const factoryNav = [
    { href: '/catalog', label: 'Printway Factory Catalog', icon: Factory },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-white/[0.06] bg-black">
      {/* Sidebar Header */}
      <SidebarHeader className="p-3.5 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center font-bold text-xs text-black flex-shrink-0">
              OS
            </div>
            {state === 'expanded' && (
              <div className="flex flex-col">
                <span className="font-semibold text-[14px] tracking-tight text-white leading-tight">
                  OpportunityOS
                </span>
                <span className="text-[10px] text-neutral-400 font-normal">
                  Printway R&D
                </span>
              </div>
            )}
          </Link>
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      {/* Sidebar Navigation Content */}
      <SidebarContent className="px-2 py-3">
        {/* Main Platform Group */}
        <SidebarGroup>
          {state === 'expanded' && (
            <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium px-2 mb-1">
              R&D Studio
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                      <Link
                        href={item.href}
                        className={`flex items-center justify-between w-full px-2.5 py-2 rounded-lg text-[13px] transition-colors ${
                          isActive
                            ? 'bg-white/[0.08] text-white font-medium'
                            : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-neutral-500'}`} />
                          {state === 'expanded' && <span>{item.label}</span>}
                        </div>
                        {state === 'expanded' && item.badge && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/20">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Manufacturing Group */}
        <SidebarGroup className="mt-3">
          {state === 'expanded' && (
            <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium px-2 mb-1">
              Manufacturing
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {factoryNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-colors ${
                          isActive
                            ? 'bg-white/[0.08] text-white font-medium'
                            : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                        }`}
                      >
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-neutral-500'}`} />
                        {state === 'expanded' && <span>{item.label}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Back to Public Landing */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Public Landing Page">
                  <Link
                    href="/"
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-colors"
                  >
                    <Home className="w-4 h-4 text-neutral-500" />
                    {state === 'expanded' && <span>Landing Page</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="p-3 border-t border-white/[0.06]">
        {state === 'expanded' ? (
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-[11px] text-neutral-400 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Printway Sync Active</span>
            </div>
            <div className="text-[10px] text-neutral-500 font-mono">v1.0 • HN AI Hackathon</div>
          </div>
        ) : (
          <div className="flex justify-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
