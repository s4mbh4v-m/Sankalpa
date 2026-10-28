/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, WifiOff } from 'lucide-react';
import { SankalpaEmblem } from './SankalpaEmblem';

interface HeaderProps {
  onOpenInstallModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenInstallModal }) => {
  const isOnline = useOnlineStatus();
  const { isInstallable, isInstalled } = usePWAInstall();

  return (
    <header className="sticky top-0 z-30 bg-[#131015]/80 backdrop-blur-md border-b border-[#C6A45C]/20 px-4 py-3">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: SANKALPA Brand & Yantra Emblem */}
        <div className="flex items-center gap-2.5">
          <div className="relative p-0.5 rounded-lg bg-[#181513] border border-[#C6A45C]/30 shadow-sm flex items-center justify-center">
            <SankalpaEmblem size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-[0.2em] text-[#F2EBDD] font-serif uppercase leading-none">
              SANKALPA
            </span>
            <span className="text-[9px] font-medium tracking-widest text-[#C6A45C] uppercase mt-0.5">
              Ledger of Will
            </span>
          </div>
        </div>

        {/* Zone 2: Offline / Status / Install */}
        <div className="flex items-center gap-2">
          {!isOnline && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#251e18] border border-[#82683A]/40 text-[11px] text-[#E6DAC3] font-medium">
              <WifiOff className="w-3 h-3 text-[#C6A45C]" />
              <span>Offline Active</span>
            </div>
          )}

          {/* Action: Install PWA if available & not installed */}
          {!isInstalled && isInstallable && (
            <button
              onClick={onOpenInstallModal}
              className="min-h-[34px] px-3 flex items-center gap-1.5 text-xs font-semibold text-[#F2EBDD] bg-[#221c17] hover:bg-[#2c241e] border border-[#C6A45C]/40 rounded-lg shadow-sm transition-all active:scale-95"
              aria-label="Install SANKALPA App"
            >
              <Download className="w-3.5 h-3.5 text-[#C6A45C]" />
              <span className="tracking-wide text-[11px] uppercase">Install</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
