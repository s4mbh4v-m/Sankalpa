/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SankalpaEmblemProps {
  size?: number;
  className?: string;
  variant?: 'dual' | 'virtuous' | 'shadow';
}

export const SankalpaEmblem: React.FC<SankalpaEmblemProps> = ({
  size = 28,
  className = '',
  variant = 'dual',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        {/* Virtuous Gold Gradient */}
        <linearGradient id="emblemGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F2EBDD" />
          <stop offset="50%" stopColor="#C6A45C" />
          <stop offset="100%" stopColor="#82683A" />
        </linearGradient>

        {/* Shadow Crimson Gradient */}
        <linearGradient id="emblemCrimson" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#35181F" />
          <stop offset="50%" stopColor="#C94750" />
          <stop offset="100%" stopColor="#E77A56" />
        </linearGradient>

        {/* Central Bindu Glow */}
        <radialGradient id="emblemBinduGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF8EE" />
          <stop offset="60%" stopColor="#C6A45C" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#C6A45C" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer Sacred Ring */}
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke={variant === 'shadow' ? '#C94750' : '#C6A45C'}
        strokeWidth="1.2"
        strokeOpacity="0.4"
        strokeDasharray="3 3"
      />
      <circle
        cx="50"
        cy="50"
        r="39"
        stroke={variant === 'shadow' ? '#E77A56' : '#82683A'}
        strokeWidth="1"
        strokeOpacity="0.5"
      />

      {/* Upward Triangle: Virtuous (Discipline & Ascension) */}
      {(variant === 'dual' || variant === 'virtuous') && (
        <polygon
          points="50,15 78,65 22,65"
          fill="#C6A45C"
          fillOpacity={variant === 'virtuous' ? '0.22' : '0.12'}
          stroke="url(#emblemGold)"
          strokeWidth={variant === 'virtuous' ? '2.4' : '2'}
          strokeLinejoin="round"
        />
      )}

      {/* Inverted Triangle: Shadow (Desire, Gravity & Indulgence) */}
      {(variant === 'dual' || variant === 'shadow') && (
        <polygon
          points="50,85 78,35 22,35"
          fill="#C94750"
          fillOpacity={variant === 'shadow' ? '0.24' : '0.14'}
          stroke="url(#emblemCrimson)"
          strokeWidth={variant === 'shadow' ? '2.4' : '2'}
          strokeLinejoin="round"
        />
      )}

      {/* Core Sacred Geometric Rings */}
      <circle
        cx="50"
        cy="50"
        r="14"
        stroke="#C6A45C"
        strokeWidth="1.2"
        strokeOpacity="0.6"
      />

      {/* Central Equilibrium Rhombus (Bindu Diamond) */}
      <polygon
        points="50,42 58,50 50,58 42,50"
        fill="url(#emblemGold)"
        stroke="#FFF8EE"
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Central Spark */}
      <circle cx="50" cy="50" r="2.5" fill="#FFF8EE" />
    </svg>
  );
};
