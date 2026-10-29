/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

/**
 * Punya Symbol: Dharma Chakra / Sacred Wheel of Virtue & Righteous Discipline.
 * Represents ascension, purposeful motion, willpower, and duty.
 */
export const PunyaWheelIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Outer Sacred Rim */}
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="7.25" strokeDasharray="1.5 2" strokeWidth="0.8" opacity="0.6" />
      {/* Central Hub */}
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="12" cy="12" r="0.75" fill="currentColor" />
      {/* 8 Cardinal & Ordinal Spokes */}
      <line x1="12" y1="3" x2="12" y2="9.5" />
      <line x1="12" y1="14.5" x2="12" y2="21" />
      <line x1="3" y1="12" x2="9.5" y2="12" />
      <line x1="14.5" y1="12" x2="21" y2="12" />
      <line x1="5.64" y1="5.64" x2="10.23" y2="10.23" />
      <line x1="13.77" y1="13.77" x2="18.36" y2="18.36" />
      <line x1="5.64" y1="18.36" x2="10.23" y2="13.77" />
      <line x1="13.77" y1="10.23" x2="18.36" y2="5.64" />
    </svg>
  );
};

/**
 * Papa Symbol: Stylized Trishula / Trident & Consequence Arc.
 * Counterpart to Punya, representing gravity, temptation, desire, and karmic cost.
 */
export const PapaTridentIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Central Spine */}
      <line x1="12" y1="21" x2="12" y2="3.5" />
      {/* Central Spearhead Diamond Tip */}
      <polygon points="12,1.8 14.2,5 12,6.2 9.8,5" fill="currentColor" stroke="none" />
      {/* Crescent Consequence Prongs Arc */}
      <path d="M 5 8.5 C 5 14.8, 12 16.5, 12 16.5 C 12 16.5, 19 14.8, 19 8.5" />
      {/* Left and Right Prong Tips */}
      <polygon points="5,8.5 6.5,10.5 5,10 3.5,10.5" fill="currentColor" stroke="none" />
      <polygon points="19,8.5 20.5,10.5 19,10 17.5,10.5" fill="currentColor" stroke="none" />
      {/* Base Restraint Collar & Pommel */}
      <line x1="8.5" y1="18" x2="15.5" y2="18" />
      <circle cx="12" cy="21" r="1" fill="currentColor" />
    </svg>
  );
};

/**
 * Altar Symbol: Sacred Temple / Shrine Outline.
 * Replaces the generic gear icon with a consecrated shrine silhouetted with stepped plinth, pillars, and sanctum arch.
 */
export const AltarShrineIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Stepped Altar Plinth Foundation */}
      <line x1="3" y1="21" x2="21" y2="21" />
      <line x1="5" y1="18" x2="19" y2="18" />
      {/* Sanctuary Pillars */}
      <line x1="6.5" y1="18" x2="6.5" y2="10" />
      <line x1="17.5" y1="18" x2="17.5" y2="10" />
      {/* Inner Sanctum Doorway Arch */}
      <path d="M 9.5 18 V 14.5 C 9.5 13.1, 14.5 13.1, 14.5 14.5 V 18" />
      {/* Temple Roof / Pediment Arch */}
      <path d="M 4 10 L 12 3 L 20 10 Z" />
      {/* Sacred Kalasha Spire Finial */}
      <line x1="12" y1="1" x2="12" y2="3" />
      <circle cx="12" cy="1.2" r="0.6" fill="currentColor" />
    </svg>
  );
};
