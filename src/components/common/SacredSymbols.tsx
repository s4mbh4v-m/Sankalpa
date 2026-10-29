/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SymbolProps {
  size?: number;
  className?: string;
  color?: string;
}

/**
 * Punya Symbol: Sacred 8-spoke Dharma Wheel & Lotus core
 * Represents virtue, righteous action, discipline, and ethical ascension.
 */
export const PunyaSymbol: React.FC<SymbolProps> = ({
  size = 20,
  className = '',
  color,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-hidden="true"
    >
      {/* Outer Concentric Wheel Rim */}
      <circle
        cx="12"
        cy="12"
        r="9.5"
        stroke={color || 'currentColor'}
        strokeWidth="1.5"
      />
      <circle
        cx="12"
        cy="12"
        r="11"
        stroke={color || 'currentColor'}
        strokeWidth="0.75"
        strokeDasharray="1.2 2"
        opacity="0.6"
      />

      {/* 8 Cardinal and Intercardinal Radiating Spokes */}
      <line x1="12" y1="2.5" x2="12" y2="21.5" stroke={color || 'currentColor'} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="2.5" y1="12" x2="21.5" y2="12" stroke={color || 'currentColor'} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="5.28" y1="5.28" x2="18.72" y2="18.72" stroke={color || 'currentColor'} strokeWidth="1.3" strokeLinecap="round" />
      <line x1="18.72" y1="5.28" x2="5.28" y2="18.72" stroke={color || 'currentColor'} strokeWidth="1.3" strokeLinecap="round" />

      {/* Inner Hub Circle with Translucent Aura */}
      <circle
        cx="12"
        cy="12"
        r="3.5"
        stroke={color || 'currentColor'}
        strokeWidth="1.5"
        fill={color || 'currentColor'}
        fillOpacity="0.25"
      />

      {/* Central Bindu Point of Focus */}
      <circle
        cx="12"
        cy="12"
        r="1.2"
        fill="#FFF8EE"
      />
    </svg>
  );
};

/**
 * Papa Symbol: Stylized Trishula (Sacred Trident) & Consequence Crescent
 * Represents desire, temptation, gravity, and consequential accountability.
 */
export const PapaSymbol: React.FC<SymbolProps> = ({
  size = 20,
  className = '',
  color,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-hidden="true"
    >
      {/* Central Spear Prong */}
      <path
        d="M12 2.5V20.5"
        stroke={color || 'currentColor'}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Central Spear Barb / Tip */}
      <path
        d="M9.8 6L12 2.5L14.2 6"
        stroke={color || 'currentColor'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Outer Curved Trident Crescent Prongs */}
      <path
        d="M5.5 7.5C5.5 13.5 9 15.5 12 15.5C15 15.5 18.5 13.5 18.5 7.5"
        stroke={color || 'currentColor'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left Prong Barb */}
      <path
        d="M4.5 9.5L5.5 7.5L7 9"
        stroke={color || 'currentColor'}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right Prong Barb */}
      <path
        d="M17 9L18.5 7.5L19.5 9.5"
        stroke={color || 'currentColor'}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Base Horizontal Crossbar */}
      <line
        x1="8"
        y1="18"
        x2="16"
        y2="18"
        stroke={color || 'currentColor'}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Base Consequence Anchor / Ring */}
      <circle
        cx="12"
        cy="21.2"
        r="1.2"
        fill={color || 'currentColor'}
      />
    </svg>
  );
};

/**
 * AltarShrineIcon: Stylized sacred altar and temple sanctum outline.
 * Standard 24x24 format matching Lucide icons for the bottom navigation bar.
 */
export const AltarShrineIcon: React.FC<SymbolProps> = ({
  size = 20,
  className = '',
  color,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 select-none ${className}`}
      aria-hidden="true"
    >
      {/* Kalash / Pinnacle Spire */}
      <path d="M12 2V4" />
      {/* Stepped Temple Shrine Roof */}
      <path d="M5 8L12 4L19 8" />
      {/* Outer Sacred Columns */}
      <path d="M7 8V19" />
      <path d="M17 8V19" />
      {/* Inner Sanctum Archway Doorway */}
      <path d="M10 19V14C10 12.8954 10.8954 12 12 12C13.1046 12 14 12.8954 14 14V19" />
      {/* Plinth Base Steps */}
      <line x1="4" y1="19" x2="20" y2="19" />
      <line x1="2.5" y1="22" x2="21.5" y2="22" />
    </svg>
  );
};
