'use client';

import React from 'react';

interface ProductMockupProps {
  type: 'acrylic_ornament' | 'wooden_plaque' | 'canvas_print' | 'metal_pet_tag' | string;
  className?: string;
}

export const ProductMockup: React.FC<ProductMockupProps> = ({ type, className = '' }) => {
  switch (type) {
    case 'acrylic_ornament':
    case 'opp-01':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border border-white/10 p-4 ${className}`}>
          {/* Subtle lighting backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(59,130,246,0.15),transparent_70%)]" />
          
          {/* Glass Acrylic Ornament */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-white/40 bg-gradient-to-b from-white/20 via-white/5 to-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_0_20px_rgba(255,255,255,0.2)] flex flex-col items-center justify-center text-center p-3">
            {/* Hanging Ribbon Hole */}
            <div className="absolute -top-2 w-4 h-4 rounded-full bg-amber-400/90 border border-amber-200 shadow-md flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-black/40" />
            </div>
            
            {/* Design Illustration */}
            <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 text-xs mb-1">
              🐾
            </div>
            <div className="text-[11px] font-bold text-white tracking-tight drop-shadow">
              Forever in Our Hearts
            </div>
            <div className="text-[9px] text-amber-300 font-serif italic">
              "Bella" • 2012 - 2026
            </div>
            <div className="text-[8px] text-neutral-400 mt-1">
              3mm Cast Clear Acrylic
            </div>
            
            {/* Glass shine reflection streak */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
          </div>

          {/* Badge */}
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 font-mono">
            BUILD • Score 91
          </div>
        </div>
      );

    case 'wooden_plaque':
    case 'opp-02':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border border-white/10 p-4 ${className}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.12),transparent_70%)]" />
          
          {/* Wood Texture Plaque */}
          <div className="relative w-40 h-32 sm:w-48 sm:h-36 rounded-lg border border-amber-700/60 bg-gradient-to-br from-[#3d2714] via-[#2a1a0d] to-[#1e1208] shadow-[0_8px_30px_rgba(0,0,0,0.7)] flex flex-col items-center justify-center p-3 text-center">
            {/* Wood grain highlight */}
            <div className="w-full h-full border border-amber-600/30 rounded flex flex-col items-center justify-center p-2 bg-gradient-to-b from-white/[0.03] to-transparent">
              <div className="text-amber-400/90 text-sm mb-0.5">🎣</div>
              <div className="text-[12px] font-extrabold text-amber-100 tracking-tight font-serif uppercase">
                Grandpa's Fishing Buddies
              </div>
              <div className="text-[9px] text-amber-300/80 font-mono mt-1">
                Leo • Noah • Emma
              </div>
              <div className="text-[8px] text-amber-500/80 mt-1 font-mono">
                Laser Cut Birch Plywood (Fit: 94%)
              </div>
            </div>
          </div>

          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 font-mono">
            BUILD • Score 87
          </div>
        </div>
      );

    case 'canvas_print':
    case 'opp-03':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border border-white/10 p-4 ${className}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]" />
          
          {/* Canvas Frame */}
          <div className="relative w-36 h-40 sm:w-44 sm:h-44 rounded border-2 border-neutral-700 bg-gradient-to-b from-neutral-800 to-neutral-900 shadow-2xl flex flex-col items-center justify-center p-3 text-center">
            <div className="text-emerald-400 text-base mb-1">🌿 🌸</div>
            <div className="text-[11px] font-bold text-neutral-100 font-serif">
              Grandma's Garden
            </div>
            <div className="text-[8px] text-emerald-400/90 mt-1 font-mono">
              Where Love Grows Deep
            </div>
            <div className="text-[7px] text-neutral-400 mt-2">
              Stretched Canvas 8×10"
            </div>
          </div>

          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-[10px] font-bold text-amber-300 font-mono">
            WATCH • Score 71
          </div>
        </div>
      );

    case 'metal_pet_tag':
    case 'opp-04':
    default:
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border border-white/10 p-4 ${className}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_70%)]" />
          
          {/* Metal Bone Tag */}
          <div className="relative w-36 h-24 sm:w-44 sm:h-28 rounded-full border border-neutral-400/50 bg-gradient-to-r from-neutral-300 via-neutral-100 to-neutral-400 shadow-lg flex flex-col items-center justify-center p-3 text-center text-black">
            <div className="text-[12px] font-extrabold tracking-wider font-mono">
              MILO
            </div>
            <div className="text-[9px] font-mono text-neutral-700">
              555-0199 • LOST DOG
            </div>
            <div className="text-[7px] text-red-600 font-bold uppercase mt-1">
              High Equipment Limit
            </div>
          </div>

          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-red-500/20 border border-red-500/30 text-[10px] font-bold text-red-400 font-mono">
            SKIP • Low Fit (34%)
          </div>
        </div>
      );
  }
};
