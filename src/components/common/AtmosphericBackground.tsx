/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export type BackgroundTheme =
  | 'dashboard'
  | 'virtuous'
  | 'shadow'
  | 'ledger'
  | 'analytics'
  | 'settings'
  | 'settings-activities'
  | 'settings-consumptions'
  | 'settings-rules'
  | 'settings-limits'
  | 'settings-data';

interface AtmosphericBackgroundProps {
  theme: BackgroundTheme;
}

export const AtmosphericBackground: React.FC<AtmosphericBackgroundProps> = ({ theme }) => {
  const isPunya = theme === 'virtuous' || theme === 'settings-activities' || theme === 'settings';
  const isPapa = theme === 'shadow' || theme === 'settings-consumptions';
  const isRules = theme === 'settings-rules';
  const isLimits = theme === 'settings-limits';
  const isData = theme === 'settings-data';
  const isLedgerOrAnalytics = theme === 'ledger' || theme === 'analytics';

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* =================================================================== */}
      {/* 1. ATMOSPHERIC BASE COLOR GRADIENTS (SCREEN & SECTION SPECIFIC)     */}
      {/* =================================================================== */}

      {/* DASHBOARD: Seamless transition from Golden Virtue to Crimson Shadow */}
      {theme === 'dashboard' && (
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            background: `
              radial-gradient(circle at 50% 120px, rgba(198, 164, 92, 0.22) 0%, rgba(141, 112, 64, 0.12) 35%, transparent 70%),
              radial-gradient(circle at 50% 700px, rgba(181, 62, 73, 0.20) 0%, rgba(100, 36, 44, 0.12) 40%, transparent 75%),
              radial-gradient(ellipse at 10% 75%, rgba(231, 122, 86, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 90% 25%, rgba(198, 164, 92, 0.10) 0%, transparent 50%),
              linear-gradient(180deg, #181511 0%, #201a14 22%, #181419 50%, #211218 78%, #110d10 100%)
            `,
          }}
        />
      )}

      {/* PUNYA & ALTAR ACTIVITIES: Warm charcoal, deep olive-brown, bronze & radiant gold */}
      {isPunya && (
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            background: `
              radial-gradient(circle at 50% 140px, rgba(198, 164, 92, 0.28) 0%, rgba(141, 112, 64, 0.16) 42%, transparent 75%),
              radial-gradient(ellipse at 50% 0px, rgba(242, 235, 221, 0.16) 0%, transparent 55%),
              radial-gradient(circle at 85% 55%, rgba(70, 56, 34, 0.35) 0%, transparent 60%),
              radial-gradient(circle at 15% 70%, rgba(41, 37, 26, 0.5) 0%, transparent 55%),
              linear-gradient(180deg, #191812 0%, #262117 30%, #1f1a13 70%, #12100d 100%)
            `,
          }}
        />
      )}

      {/* PAPA & ALTAR CONSUMPTIONS: Obsidian, charcoal, deep burgundy & ember highlights */}
      {isPapa && (
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            background: `
              radial-gradient(circle at 50% 150px, rgba(181, 62, 73, 0.28) 0%, rgba(100, 36, 44, 0.16) 45%, transparent 75%),
              radial-gradient(ellipse at 50% 70%, rgba(53, 24, 32, 0.50) 0%, transparent 65%),
              radial-gradient(circle at 12% 40%, rgba(231, 122, 86, 0.14) 0%, transparent 45%),
              radial-gradient(circle at 88% 75%, rgba(181, 62, 73, 0.18) 0%, transparent 45%),
              linear-gradient(180deg, #120e13 0%, #23131a 32%, #2c141e 68%, #110b0e 100%)
            `,
          }}
        />
      )}

      {/* POINT RULES: Restrained, dark neutral theme with subtle gold accents */}
      {isRules && (
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            background: `
              radial-gradient(circle at 50% 120px, rgba(198, 164, 92, 0.15) 0%, rgba(85, 72, 50, 0.08) 38%, transparent 68%),
              radial-gradient(circle at 85% 65%, rgba(130, 104, 58, 0.10) 0%, transparent 50%),
              linear-gradient(180deg, #131215 0%, #1a181c 35%, #151317 70%, #0d0c0f 100%)
            `,
          }}
        />
      )}

      {/* PERSONAL LIMITS: Disciplined dark theme with boundary restraint motifs */}
      {isLimits && (
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            background: `
              radial-gradient(circle at 50% 130px, rgba(110, 120, 150, 0.15) 0%, rgba(198, 164, 92, 0.09) 38%, transparent 68%),
              radial-gradient(circle at 15% 75%, rgba(65, 72, 92, 0.15) 0%, transparent 52%),
              linear-gradient(180deg, #111116 0%, #171822 35%, #13141b 70%, #0b0c10 100%)
            `,
          }}
        />
      )}

      {/* DATA & BACKUP: Technology-inspired dark obsidian with cyber-gold circuit luminous lines */}
      {isData && (
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            background: `
              radial-gradient(circle at 50% 120px, rgba(198, 164, 92, 0.18) 0%, rgba(45, 80, 110, 0.10) 45%, transparent 70%),
              radial-gradient(circle at 80% 80%, rgba(198, 164, 92, 0.09) 0%, transparent 50%),
              linear-gradient(180deg, #0d0f14 0%, #12161f 35%, #0f1217 70%, #07090d 100%)
            `,
          }}
        />
      )}

      {/* LEDGER & INSIGHTS: Harmonious dual-balance twilight aesthetic */}
      {isLedgerOrAnalytics && (
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            background: `
              radial-gradient(circle at 50% 120px, rgba(198, 164, 92, 0.18) 0%, rgba(141, 112, 64, 0.08) 35%, transparent 65%),
              radial-gradient(circle at 50% 680px, rgba(181, 62, 73, 0.16) 0%, rgba(100, 36, 44, 0.08) 35%, transparent 65%),
              linear-gradient(180deg, #161414 0%, #1c181b 35%, #18141b 65%, #0f0d11 100%)
            `,
          }}
        />
      )}

      {/* =================================================================== */}
      {/* 2. OVERSIZED TRANSLUCENT CELESTIAL GEOMETRIC ARTWORK                */}
      {/* =================================================================== */}

      {/* A. DASHBOARD SIGNATURE EMBLEM: Dual Equilibrium Yantra & Eclipse Sun */}
      {theme === 'dashboard' && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[540px] h-[540px] opacity-25">
          <svg
            viewBox="0 0 540 540"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="dashGoldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F2EBDD" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#C6A45C" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#82683A" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="dashCrimsonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E77A56" stopOpacity="0.2" />
                <stop offset="40%" stopColor="#C94750" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#351820" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Outer Concentric Sacred Circles */}
            <circle cx="270" cy="270" r="255" stroke="url(#dashGoldGrad)" strokeWidth="1.2" strokeDasharray="4 6" opacity="0.6" />
            <circle cx="270" cy="270" r="235" stroke="#C6A45C" strokeWidth="1" opacity="0.4" />
            <circle cx="270" cy="270" r="205" stroke="#82683A" strokeWidth="0.8" opacity="0.5" />
            <circle cx="270" cy="270" r="170" stroke="url(#dashCrimsonGrad)" strokeWidth="1" strokeDasharray="8 4" opacity="0.5" />

            {/* 8 Cardinal & Ordinal Axis Lines */}
            <g stroke="#C6A45C" strokeWidth="0.75" opacity="0.5">
              <line x1="270" y1="15" x2="270" y2="525" />
              <line x1="15" y1="270" x2="525" y2="270" />
              <line x1="90" y1="90" x2="450" y2="450" strokeDasharray="2 4" />
              <line x1="450" y1="90" x2="90" y2="450" strokeDasharray="2 4" />
            </g>

            {/* Upper Golden Sun Rays (Discipline / Ascension) */}
            <g stroke="url(#dashGoldGrad)" strokeWidth="1.5">
              {Array.from({ length: 16 }).map((_, i) => {
                const angle = (i * 22.5 - 90) * (Math.PI / 180);
                if (Math.sin(angle) > 0.05) return null;
                const x1 = 270 + Math.cos(angle) * 175;
                const y1 = 270 + Math.sin(angle) * 175;
                const x2 = 270 + Math.cos(angle) * 230;
                const y2 = 270 + Math.sin(angle) * 230;
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
              })}
            </g>

            {/* Lower Shadow Eclipse Arc (Gravity / Consequence) */}
            <path
              d="M 100 270 A 170 170 0 0 0 440 270"
              stroke="url(#dashCrimsonGrad)"
              strokeWidth="2.5"
              fill="rgba(53, 24, 32, 0.12)"
            />

            {/* Opposing Geometric Yantra Triangles */}
            <polygon
              points="270,120 400,345 140,345"
              fill="rgba(198, 164, 92, 0.06)"
              stroke="url(#dashGoldGrad)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <polygon
              points="270,420 400,195 140,195"
              fill="rgba(201, 71, 80, 0.06)"
              stroke="url(#dashCrimsonGrad)"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* Central Equilibrium Circle & Diamond */}
            <circle cx="270" cy="270" r="54" stroke="#C6A45C" strokeWidth="1.2" opacity="0.7" />
            <circle cx="270" cy="270" r="32" stroke="#C94750" strokeWidth="1" opacity="0.6" />
            <polygon points="270,246 294,270 270,294 246,270" fill="url(#dashGoldGrad)" stroke="#FFF8EE" strokeWidth="1" opacity="0.8" />
          </svg>
        </div>
      )}

      {/* B. PUNYA WORLD & ALTAR ACTIVITIES EMBLEM: Radiant Golden Sun Mandala */}
      {isPunya && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[560px] h-[560px] opacity-30">
          <svg
            viewBox="0 0 560 560"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              <radialGradient id="virtSunGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF8EE" stopOpacity="0.9" />
                <stop offset="35%" stopColor="#C6A45C" stopOpacity="0.5" />
                <stop offset="70%" stopColor="#82683A" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#82683A" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="virtLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F2EBDD" />
                <stop offset="50%" stopColor="#C6A45C" />
                <stop offset="100%" stopColor="#82683A" />
              </linearGradient>
            </defs>

            {/* Radiant Ambient Core */}
            <circle cx="280" cy="280" r="260" fill="url(#virtSunGlow)" />

            {/* Sacred Concentric Linework */}
            <circle cx="280" cy="280" r="250" stroke="url(#virtLineGrad)" strokeWidth="1.2" strokeDasharray="3 5" />
            <circle cx="280" cy="280" r="225" stroke="#C6A45C" strokeWidth="1" opacity="0.6" />
            <circle cx="280" cy="280" r="190" stroke="#82683A" strokeWidth="1.5" />
            <circle cx="280" cy="280" r="150" stroke="#C6A45C" strokeWidth="0.8" strokeDasharray="6 3" />
            <circle cx="280" cy="280" r="100" stroke="#F2EBDD" strokeWidth="1" opacity="0.7" />

            {/* 24 Radiant Sun Rays */}
            <g stroke="#C6A45C" strokeWidth="1.2" opacity="0.65">
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i * 15) * (Math.PI / 180);
                const x1 = 280 + Math.cos(angle) * 195;
                const y1 = 280 + Math.sin(angle) * 195;
                const x2 = 280 + Math.cos(angle) * 245;
                const y2 = 280 + Math.sin(angle) * 245;
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
              })}
            </g>

            {/* Nested Sacred Equilateral Triangles */}
            <polygon
              points="280,105 432,367 128,367"
              fill="rgba(198, 164, 92, 0.08)"
              stroke="url(#virtLineGrad)"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <polygon
              points="280,145 397,348 163,348"
              fill="none"
              stroke="#F2EBDD"
              strokeWidth="1"
              strokeOpacity="0.4"
            />
            <polygon
              points="280,415 410,212 150,212"
              fill="none"
              stroke="#82683A"
              strokeWidth="1.2"
              strokeOpacity="0.5"
            />

            {/* Central Bindu Diamond */}
            <polygon points="280,245 315,280 280,315 245,280" fill="url(#virtLineGrad)" stroke="#FFF8EE" strokeWidth="1.5" />
            <circle cx="280" cy="280" r="6" fill="#FFF8EE" />
          </svg>
        </div>
      )}

      {/* C. PAPA WORLD & ALTAR CONSUMPTIONS EMBLEM: Trishula & Fractured Eclipse */}
      {isPapa && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[560px] h-[560px] opacity-28">
          <svg
            viewBox="0 0 560 560"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              <radialGradient id="shadowCrimsonGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#C94750" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#64242C" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#351820" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="shadowLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E77A56" />
                <stop offset="50%" stopColor="#C94750" />
                <stop offset="100%" stopColor="#351820" />
              </linearGradient>
            </defs>

            {/* Dark Ambient Glow */}
            <circle cx="280" cy="280" r="260" fill="url(#shadowCrimsonGlow)" />

            {/* Fractured Eclipse Arcs & Rings */}
            <circle cx="280" cy="280" r="245" stroke="#C94750" strokeWidth="1" strokeDasharray="12 8" opacity="0.45" />
            <circle cx="280" cy="280" r="220" stroke="url(#shadowLineGrad)" strokeWidth="1.5" opacity="0.6" />
            <circle cx="280" cy="280" r="180" stroke="#351820" strokeWidth="2" />
            <circle cx="280" cy="280" r="140" stroke="#E77A56" strokeWidth="0.8" strokeDasharray="4 6" opacity="0.6" />

            {/* Central Trishula Silhouette Linework */}
            <path
              d="M 280 130 V 390"
              stroke="url(#shadowLineGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 255 170 L 280 130 L 305 170"
              stroke="url(#shadowLineGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 210 200 C 210 290 250 320 280 320 C 310 320 350 290 350 200"
              stroke="url(#shadowLineGrad)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Eclipse Crescent Shadow Curve */}
            <path
              d="M 120 280 A 160 160 0 1 1 440 280 A 135 135 0 1 0 120 280 Z"
              fill="rgba(53, 24, 32, 0.35)"
              stroke="url(#shadowLineGrad)"
              strokeWidth="1.5"
            />

            {/* Inverted Downward Triangles (Desire / Gravity) */}
            <polygon
              points="280,455 432,193 128,193"
              fill="rgba(201, 71, 80, 0.08)"
              stroke="url(#shadowLineGrad)"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Angular Ornamental Diamond Grid */}
            <polygon points="280,240 320,280 280,320 240,280" fill="rgba(33, 20, 25, 0.8)" stroke="#C94750" strokeWidth="1.5" />
            <polygon points="280,255 305,280 280,305 255,280" fill="#E77A56" opacity="0.7" />
          </svg>
        </div>
      )}

      {/* D. POINT RULES EMBLEM: Geometric Precision & Balance Scales */}
      {isRules && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[520px] h-[520px] opacity-22">
          <svg
            viewBox="0 0 520 520"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Concentric Precision Dial Rings */}
            <circle cx="260" cy="260" r="240" stroke="#C6A45C" strokeWidth="1" strokeDasharray="3 5" />
            <circle cx="260" cy="260" r="215" stroke="#82683A" strokeWidth="1" />
            <circle cx="260" cy="260" r="180" stroke="#C6A45C" strokeWidth="0.8" strokeDasharray="6 4" />
            <circle cx="260" cy="260" r="130" stroke="#C6A45C" strokeWidth="1" strokeOpacity="0.5" />

            {/* 36 Calibration Dial Ticks */}
            <g stroke="#C6A45C" strokeWidth="1" opacity="0.5">
              {Array.from({ length: 36 }).map((_, i) => {
                const angle = (i * 10) * (Math.PI / 180);
                const isMajor = i % 3 === 0;
                const r1 = isMajor ? 205 : 210;
                const r2 = 215;
                const x1 = 260 + Math.cos(angle) * r1;
                const y1 = 260 + Math.sin(angle) * r1;
                const x2 = 260 + Math.cos(angle) * r2;
                const y2 = 260 + Math.sin(angle) * r2;
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={isMajor ? 1.5 : 0.8} />;
              })}
            </g>

            {/* Geometric Balance Scale Cross Axis */}
            <line x1="80" y1="260" x2="440" y2="260" stroke="#C6A45C" strokeWidth="1.8" />
            <line x1="260" y1="100" x2="260" y2="420" stroke="#82683A" strokeWidth="1.2" strokeDasharray="4 4" />

            {/* Left & Right Scale Basins / Rhombuses */}
            <polygon points="120,260 150,300 90,300" stroke="#C6A45C" strokeWidth="1.5" fill="rgba(198,164,92,0.06)" />
            <polygon points="400,260 430,300 370,300" stroke="#C6A45C" strokeWidth="1.5" fill="rgba(198,164,92,0.06)" />

            {/* Square of Inscribed Logic */}
            <rect x="190" y="190" width="140" height="140" stroke="#C6A45C" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
            <polygon points="260,205 315,260 260,315 205,260" stroke="#82683A" strokeWidth="1.2" fill="none" />
            <circle cx="260" cy="260" r="28" stroke="#C6A45C" strokeWidth="1" />
            <circle cx="260" cy="260" r="4" fill="#C6A45C" />
          </svg>
        </div>
      )}

      {/* E. PERSONAL LIMITS EMBLEM: Octagonal Boundary Shield & Restraint Rings */}
      {isLimits && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[520px] h-[520px] opacity-24">
          <svg
            viewBox="0 0 520 520"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Outer Protective Octagon Shield */}
            <polygon
              points="180,60 340,60 460,180 460,340 340,460 180,460 60,340 60,180"
              stroke="#9CA3AF"
              strokeWidth="1.5"
              strokeDasharray="6 4"
              opacity="0.4"
            />
            <polygon
              points="190,85 330,85 435,190 435,330 330,435 190,435 85,330 85,190"
              stroke="#C6A45C"
              strokeWidth="1.2"
              opacity="0.5"
            />

            {/* Inner Guard Rings */}
            <circle cx="260" cy="260" r="180" stroke="#C6A45C" strokeWidth="1" opacity="0.5" />
            <circle cx="260" cy="260" r="145" stroke="#9CA3AF" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.4" />
            <circle cx="260" cy="260" r="105" stroke="#C6A45C" strokeWidth="1.5" opacity="0.6" />

            {/* 4 Cardinal Barrier Gates */}
            <g stroke="#C6A45C" strokeWidth="2">
              <line x1="260" y1="50" x2="260" y2="90" />
              <line x1="260" y1="430" x2="260" y2="470" />
              <line x1="50" y1="260" x2="90" y2="260" />
              <line x1="430" y1="260" x2="470" y2="260" />
            </g>

            {/* Central Restraint Core */}
            <polygon points="260,215 305,260 260,305 215,260" fill="rgba(110,120,150,0.12)" stroke="#C6A45C" strokeWidth="1.5" />
            <circle cx="260" cy="260" r="18" stroke="#9CA3AF" strokeWidth="1" />
            <circle cx="260" cy="260" r="5" fill="#C6A45C" />
          </svg>
        </div>
      )}

      {/* F. DATA & BACKUP EMBLEM: Connected-Node Grid & Cyber-Gold Circuit Board */}
      {isData && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[540px] h-[540px] opacity-25">
          <svg
            viewBox="0 0 540 540"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Circuit Board Traces with 45-degree Angled Jogs */}
            <g stroke="#C6A45C" strokeWidth="1" opacity="0.65" strokeLinecap="round" strokeLinejoin="round">
              {/* Horizontal / Vertical Data Bus Lines */}
              <path d="M 60 140 H 200 L 240 180 V 230" />
              <path d="M 480 140 H 340 L 300 180 V 230" />
              <path d="M 60 400 H 200 L 240 360 V 310" />
              <path d="M 480 400 H 340 L 300 360 V 310" />

              <path d="M 120 70 V 160 L 160 200 H 220" />
              <path d="M 420 70 V 160 L 380 200 H 320" />
              <path d="M 120 470 V 380 L 160 340 H 220" />
              <path d="M 420 470 V 380 L 380 340 H 320" />

              <line x1="270" y1="40" x2="270" y2="180" strokeDasharray="4 3" />
              <line x1="270" y1="360" x2="270" y2="500" strokeDasharray="4 3" />
              <line x1="40" y1="270" x2="180" y2="270" strokeDasharray="4 3" />
              <line x1="360" y1="270" x2="500" y2="270" strokeDasharray="4 3" />
            </g>

            {/* Solder Sockets & Storage Nodes */}
            <g fill="#C6A45C" stroke="#FFF8EE" strokeWidth="0.8">
              <circle cx="60" cy="140" r="3.5" />
              <circle cx="480" cy="140" r="3.5" />
              <circle cx="60" cy="400" r="3.5" />
              <circle cx="480" cy="400" r="3.5" />

              <circle cx="120" cy="70" r="3" />
              <circle cx="420" cy="70" r="3" />
              <circle cx="120" cy="470" r="3" />
              <circle cx="420" cy="470" r="3" />

              <circle cx="200" cy="140" r="2.5" />
              <circle cx="340" cy="140" r="2.5" />
              <circle cx="200" cy="400" r="2.5" />
              <circle cx="340" cy="400" r="2.5" />

              <circle cx="270" cy="40" r="4" fill="#FFF8EE" />
              <circle cx="270" cy="500" r="4" fill="#FFF8EE" />
              <circle cx="40" cy="270" r="4" fill="#FFF8EE" />
              <circle cx="500" cy="270" r="4" fill="#FFF8EE" />
            </g>

            {/* Central Secure Vault Node Geometry */}
            <circle cx="270" cy="270" r="70" stroke="#C6A45C" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.7" />
            <rect x="225" y="225" width="90" height="90" stroke="#C6A45C" strokeWidth="1.5" fill="rgba(198,164,92,0.06)" />
            <polygon points="270,235 305,270 270,305 235,270" stroke="#FFF8EE" strokeWidth="1.2" fill="rgba(198,164,92,0.15)" />
            <circle cx="270" cy="270" r="8" fill="#C6A45C" />
            <circle cx="270" cy="270" r="3" fill="#FFF8EE" />
          </svg>
        </div>
      )}

      {/* G. LEDGER / ANALYTICS EMBLEM: Subtle Harmonic Geometry */}
      {isLedgerOrAnalytics && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[520px] h-[520px] opacity-20">
          <svg
            viewBox="0 0 520 520"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <circle cx="260" cy="260" r="240" stroke="#C6A45C" strokeWidth="1" strokeDasharray="5 7" />
            <circle cx="260" cy="260" r="210" stroke="#82683A" strokeWidth="1" />
            <circle cx="260" cy="260" r="170" stroke="#C6A45C" strokeWidth="0.8" strokeDasharray="3 3" />
            <polygon points="260,110 390,335 130,335" stroke="#C6A45C" strokeWidth="1.5" fill="none" opacity="0.5" />
            <polygon points="260,410 390,185 130,185" stroke="#82683A" strokeWidth="1.5" fill="none" opacity="0.5" />
            <circle cx="260" cy="260" r="50" stroke="#C6A45C" strokeWidth="1" />
            <polygon points="260,235 285,260 260,285 235,260" fill="#C6A45C" opacity="0.4" />
          </svg>
        </div>
      )}

      {/* =================================================================== */}
      {/* 3. TACTILE ORGANIC GRAIN / NOISE TEXTURE OVERLAY                     */}
      {/* =================================================================== */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* =================================================================== */}
      {/* 4. VIGNETTE PERIMETER FRAME                                         */}
      {/* =================================================================== */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 60%, rgba(7, 6, 8, 0.6) 100%)',
        }}
      />
    </div>
  );
};
