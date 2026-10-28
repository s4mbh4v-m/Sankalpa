/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LedgerProvider, useLedger } from './context/LedgerContext';
import { Header } from './components/common/Header';
import { BottomNav, NavTab } from './components/common/BottomNav';
import { Toast } from './components/common/Toast';
import { PWAInstallModal } from './components/common/PWAInstallBanner';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { DashboardScreen } from './components/dashboard/DashboardScreen';
import { LogScreen } from './components/logger/LogScreen';
import { LedgerScreen } from './components/ledger/LedgerScreen';
import { AnalyticsScreen } from './components/analytics/AnalyticsScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';
import { SankalpaEmblem } from './components/common/SankalpaEmblem';
import { AtmosphericBackground, BackgroundTheme } from './components/common/AtmosphericBackground';

function MainApp() {
  const { isLoading, preferences, addConsumption } = useLedger();
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [logSubMode, setLogSubMode] = useState<'activity' | 'consumption'>('activity');
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Quick 1-tap cigarette logger from dashboard
  const handleQuickLogCigarette = async () => {
    await addConsumption({
      typeId: 'cigarette',
      quantity: 1,
      timestamp: new Date().toISOString(),
      notes: 'Quick log',
    });
  };

  // Navigate handler that can optionally specify the target logger sub-mode
  const handleNavigate = (tab: NavTab, mode?: 'activity' | 'consumption') => {
    setCurrentTab(tab);
    if (mode) {
      setLogSubMode(mode);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#110e13] flex flex-col items-center justify-center p-4 text-[#F2EBDD] relative overflow-hidden">
        <AtmosphericBackground theme="dashboard" />
        <div className="relative flex items-center justify-center mb-4">
          <div className="absolute w-28 h-28 rounded-full bg-[#C6A45C]/20 blur-2xl animate-pulse" />
          <SankalpaEmblem size={64} className="animate-pulse relative z-10 drop-shadow-[0_0_15px_rgba(198,164,92,0.4)]" />
        </div>
        <h1 className="text-2xl font-bold tracking-[0.28em] text-[#F2EBDD] font-serif mb-1">
          SANKALPA
        </h1>
        <p className="text-xs text-[#C6A45C] font-serif tracking-widest uppercase">
          Awakening Ledger of Will...
        </p>
      </div>
    );
  }

  // Determine active background theme
  let backgroundTheme: BackgroundTheme = 'dashboard';
  if (currentTab === 'dashboard') {
    backgroundTheme = 'dashboard';
  } else if (currentTab === 'log') {
    backgroundTheme = logSubMode === 'activity' ? 'virtuous' : 'shadow';
  } else if (currentTab === 'ledger') {
    backgroundTheme = 'ledger';
  } else if (currentTab === 'analytics') {
    backgroundTheme = 'analytics';
  } else if (currentTab === 'settings') {
    backgroundTheme = 'settings';
  }

  const shouldShowFirstRunOnboarding = !preferences.hasCompletedOnboarding;

  return (
    <div className="min-h-screen text-[#e8e4df] flex flex-col selection:bg-[#82683a] selection:text-[#fff8ee] relative">
      {/* Dynamic Layered Atmospheric Background */}
      <AtmosphericBackground theme={backgroundTheme} />

      {/* Top Header */}
      <Header onOpenInstallModal={() => setIsInstallModalOpen(true)} />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 pt-4">
        {currentTab === 'dashboard' && (
          <DashboardScreen
            onNavigate={handleNavigate}
            onQuickLogCigarette={handleQuickLogCigarette}
          />
        )}

        {currentTab === 'log' && (
          <LogScreen
            mode={logSubMode}
            onModeChange={(m) => setLogSubMode(m)}
          />
        )}

        {currentTab === 'ledger' && <LedgerScreen />}

        {currentTab === 'analytics' && <AnalyticsScreen />}

        {currentTab === 'settings' && (
          <SettingsScreen
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
          />
        )}
      </main>

      {/* Bottom Thumb Navigation Bar */}
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Non-intrusive Toast with Undo */}
      <Toast />

      {/* PWA Installation Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Onboarding Guide (First run or manually triggered) */}
      <OnboardingModal
        isOpen={shouldShowFirstRunOnboarding || isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LedgerProvider>
      <MainApp />
    </LedgerProvider>
  );
}
