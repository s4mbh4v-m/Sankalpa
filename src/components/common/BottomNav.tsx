/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LayoutDashboard, PlusCircle, Scale, BarChart3 } from 'lucide-react';
import { AltarShrineIcon } from './SacredSymbols';

export type NavTab = 'dashboard' | 'log' | 'ledger' | 'analytics' | 'settings';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard' as NavTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'log' as NavTab, label: 'Record', icon: PlusCircle },
    { id: 'ledger' as NavTab, label: 'Ledger', icon: Scale },
    { id: 'analytics' as NavTab, label: 'Insights', icon: BarChart3 },
    { id: 'settings' as NavTab, label: 'Altar', icon: AltarShrineIcon },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#131015]/85 backdrop-blur-md border-t border-[#C6A45C]/20 pb-[env(safe-area-inset-bottom)]"
      aria-label="Primary navigation"
    >
      <div className="max-w-xl mx-auto grid grid-cols-5 h-16 items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`min-h-[48px] flex flex-col items-center justify-center relative transition-colors ${
                isActive ? 'text-[#F2EBDD]' : 'text-[#8a8278] hover:text-[#c4baa9]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-[#C6A45C]' : ''
                  }`}
                />
                {isActive && (
                  <span className="absolute -inset-1 rounded-full bg-[#C6A45C]/20 blur-sm -z-10" />
                )}
              </div>
              <span
                className={`text-[11px] tracking-wider uppercase mt-1 transition-colors ${
                  isActive ? 'font-bold text-[#F2EBDD]' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#C6A45C] shadow-[0_0_6px_#C6A45C]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
