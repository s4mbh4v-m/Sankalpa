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
  | 'settings';

interface AtmosphericBackgroundProps {
  theme: BackgroundTheme;
}

export const AtmosphericBackground: React.FC<AtmosphericBackgroundProps> = ({ theme }) => {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* =================================================================== */}
      {/* 1. ATMOSPHERIC BASE COLOR GRADIENTS (SCREEN SPECIFIC)               */}
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

      {/* VIRTUOUS: Warm charcoal, deep olive-brown, bronze & radiant gold */}
      {theme === 'virtuous' && (
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

      {/* SHADOW: Obsidian, charcoal, deep burgundy & ember highlights */}
      {theme === 'shadow' && (
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            background: `
              radial-gradient(circle at 50% 150px, rgba(181, 62, 73, 0.25) 0%, rgba(100, 36, 44, 0.15) 45%, transparent 75%),
              radial-gradient(ellipse at 50% 70%, rgba(53, 24, 32, 0.45) 0%, transparent 65%),
              radial-gradient(circle at 12% 40%, rgba(231, 122, 86, 0.12) 0%, transparent 45%),
              radial-gradient(circle at 88% 75%, rgba(181, 62, 73, 0.15) 0%, transparent 45%),
              linear-gradient(180deg, #110e13 0%, #211319 32%, #2a141d 68%, #100b0e 100%)
            `,
          }}
        />
      )}

      {/* LEDGER & INSIGHTS: Harmonious dual-balance twilight aesthetic */}
      {(theme === 'ledger' || theme === 'analytics') && (
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

      {/* SETTINGS (Altar): Ancient temple deep bronze and gold */}
      {theme === 'settings' && (
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            background: `
              radial-gradient(circle at 50% 100px, rgba(198, 164, 92, 0.22) 0%, rgba(70, 56, 34, 0.14) 40%, transparent 70%),
              radial-gradient(circle at 80% 80%, rgba(130, 104, 58, 0.18) 0%, transparent 50%),
              linear-gradient(180deg, #171512 0%, #221c15 35%, #191612 70%, #0d0c0a 100%)
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
                if (Math.sin(angle) > 0.05) return null; // Upper hemisphere only
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
            {/* Upward Gold Triangle */}
            <polygon
              points="270,120 400,345 140,345"
              fill="rgba(198, 164, 92, 0.06)"
              stroke="url(#dashGoldGrad)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Downward Crimson Triangle */}
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

      {/* B. VIRTUOUS WORLD EMBLEM: Radiant Golden Sun Mandala */}
      {theme === 'virtuous' && (
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

      {/* C. SHADOW WORLD EMBLEM: Fractured Eclipse & Angular Linework */}
      {theme === 'shadow' && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[560px] h-[560px] opacity-28">
          <svg
            viewBox="0 0 560 560"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              <radialGradient id="shadowCrimsonGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#C94750" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#64242C" stopOpacity="0.2" />
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
            <polygon
              points="280,410 397,208 163,208"
              fill="none"
              stroke="#E77A56"
              strokeWidth="1"
              strokeOpacity="0.4"
            />

            {/* Angular Ornamental Diamond Grid */}
            <polygon points="280,240 320,280 280,320 240,280" fill="rgba(33, 20, 25, 0.8)" stroke="#C94750" strokeWidth="1.5" />
            <polygon points="280,255 305,280 280,305 255,280" fill="#E77A56" opacity="0.7" />

            {/* Scattered Corner Ember Star Glyphs */}
            <g fill="#E77A56" opacity="0.6">
              <circle cx="70" cy="180" r="2" />
              <circle cx="490" cy="160" r="2.5" />
              <circle cx="110" cy="420" r="1.8" />
              <circle cx="460" cy="400" r="2.2" />
              <line x1="65" y1="180" x2="75" y2="180" stroke="#E77A56" strokeWidth="0.5" />
              <line x1="70" y1="175" x2="70" y2="185" stroke="#E77A56" strokeWidth="0.5" />
            </g>
          </svg>
        </div>
      )}

      {/* D. LEDGER / ANALYTICS / SETTINGS EMBLEM: Subtle Harmonic Geometry */}
      {(theme === 'ledger' || theme === 'analytics' || theme === 'settings') && (
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
