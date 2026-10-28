import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// SANKALPA Dual-Force Yantra Emblem SVG
// Obsidian base #0d0f12, Virtuous Gold #C6A45C / #F2EBDD, Shadow Crimson #C94750 / #E77A56
const baseSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1f1c24" stop-opacity="0.8"/>
      <stop offset="60%" stop-color="#121318" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#0a0b0e"/>
    </radialGradient>

    <!-- Virtuous Gold Gradient -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F2EBDD"/>
      <stop offset="50%" stop-color="#C6A45C"/>
      <stop offset="100%" stop-color="#82683A"/>
    </linearGradient>

    <!-- Shadow Crimson/Ember Gradient -->
    <linearGradient id="crimsonGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#35181F"/>
      <stop offset="50%" stop-color="#C94750"/>
      <stop offset="100%" stop-color="#E77A56"/>
    </linearGradient>

    <!-- Central Bindu Glow -->
    <radialGradient id="binduGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFF8EE"/>
      <stop offset="40%" stop-color="#C6A45C"/>
      <stop offset="100%" stop-color="#C6A45C" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Container Base -->
  <rect width="512" height="512" rx="112" fill="#0d0f12"/>
  <rect x="8" y="8" width="496" height="496" rx="104" fill="url(#bgGlow)"/>
  <rect x="16" y="16" width="480" height="480" rx="96" stroke="#2a2530" stroke-width="3" stroke-opacity="0.8"/>

  <g transform="translate(256, 256)">
    <!-- Outer Sacred Yantra Ring -->
    <circle cx="0" cy="0" r="195" stroke="#C6A45C" stroke-width="2.5" stroke-opacity="0.35" stroke-dasharray="6 6"/>
    <circle cx="0" cy="0" r="180" stroke="#82683A" stroke-width="1.5" stroke-opacity="0.6"/>
    <circle cx="0" cy="0" r="162" stroke="#2d222b" stroke-width="1"/>

    <!-- 8 Cardinal & Ordinal Points -->
    <g stroke="#C6A45C" stroke-width="2" stroke-opacity="0.7">
      <line x1="0" y1="-188" x2="0" y2="-172"/>
      <line x1="0" y1="188" x2="0" y2="172"/>
      <line x1="-188" y1="0" x2="-172" y2="0"/>
      <line x1="188" y1="0" x2="172" y2="0"/>
      <line x1="-132" y1="-132" x2="-122" y2="-122"/>
      <line x1="132" y1="-132" x2="122" y2="-122"/>
      <line x1="-132" y1="132" x2="-122" y2="122"/>
      <line x1="132" y1="132" x2="122" y2="122"/>
    </g>

    <!-- Upward Triangle: VIRTUOUS (Discipline, Ascension, Gold) -->
    <polygon points="0,-140 120,68 -120,68" 
      fill="#C6A45C" fill-opacity="0.12" 
      stroke="url(#goldGrad)" stroke-width="6" stroke-linejoin="round"/>

    <!-- Inverted Triangle: SHADOW (Desire, Gravity, Crimson) -->
    <polygon points="0,140 120,-68 -120,-68" 
      fill="#C94750" fill-opacity="0.14" 
      stroke="url(#crimsonGrad)" stroke-width="6" stroke-linejoin="round"/>

    <!-- Intersecting Sacred Geometry Hexagram Core Lines -->
    <polygon points="0,-140 120,68 -120,68" fill="none" stroke="#F2EBDD" stroke-width="1.5" stroke-opacity="0.4"/>
    <polygon points="0,140 120,-68 -120,-68" fill="none" stroke="#E77A56" stroke-width="1.5" stroke-opacity="0.4"/>

    <!-- Concentric Inner Yantra Circle -->
    <circle cx="0" cy="0" r="70" stroke="#C6A45C" stroke-width="2" stroke-opacity="0.7"/>
    <circle cx="0" cy="0" r="50" stroke="#C94750" stroke-width="1.5" stroke-opacity="0.5"/>

    <!-- Central Equilibrium Rhombus (Bindu Diamond) -->
    <polygon points="0,-32 32,0 0,32 -32,0" 
      fill="url(#goldGrad)" stroke="#FFF8EE" stroke-width="2.5" stroke-linejoin="round"/>

    <!-- Luminous Central Bindu Core -->
    <circle cx="0" cy="0" r="28" fill="url(#binduGlow)"/>
    <circle cx="0" cy="0" r="7" fill="#FFF8EE"/>
    <circle cx="0" cy="0" r="2.5" fill="#101012"/>
  </g>
</svg>
`;

// Maskable Icon with 15% safe padding
const maskableSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="mBgGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1f1c24"/>
      <stop offset="70%" stop-color="#121318"/>
      <stop offset="100%" stop-color="#0d0f12"/>
    </radialGradient>

    <linearGradient id="mGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F2EBDD"/>
      <stop offset="50%" stop-color="#C6A45C"/>
      <stop offset="100%" stop-color="#82683A"/>
    </linearGradient>

    <linearGradient id="mCrimsonGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#35181F"/>
      <stop offset="50%" stop-color="#C94750"/>
      <stop offset="100%" stop-color="#E77A56"/>
    </linearGradient>

    <radialGradient id="mBinduGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFF8EE"/>
      <stop offset="40%" stop-color="#C6A45C"/>
      <stop offset="100%" stop-color="#C6A45C" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Full Bleed Square for Maskable Safe Zone -->
  <rect width="512" height="512" fill="url(#mBgGlow)"/>

  <!-- Scaled Emblem for 80% Safe Zone Margin -->
  <g transform="translate(256, 256) scale(0.74)">
    <circle cx="0" cy="0" r="195" stroke="#C6A45C" stroke-width="3" stroke-opacity="0.35" stroke-dasharray="6 6"/>
    <circle cx="0" cy="0" r="180" stroke="#82683A" stroke-width="2" stroke-opacity="0.6"/>

    <!-- Upward Triangle: Gold / Virtuous -->
    <polygon points="0,-140 120,68 -120,68" 
      fill="#C6A45C" fill-opacity="0.16" 
      stroke="url(#mGoldGrad)" stroke-width="7" stroke-linejoin="round"/>

    <!-- Inverted Triangle: Crimson / Shadow -->
    <polygon points="0,140 120,-68 -120,-68" 
      fill="#C94750" fill-opacity="0.18" 
      stroke="url(#mCrimsonGrad)" stroke-width="7" stroke-linejoin="round"/>

    <!-- Center Rings -->
    <circle cx="0" cy="0" r="70" stroke="#C6A45C" stroke-width="2.5" stroke-opacity="0.7"/>
    <circle cx="0" cy="0" r="50" stroke="#C94750" stroke-width="2" stroke-opacity="0.5"/>

    <!-- Central Equilibrium Rhombus -->
    <polygon points="0,-34 34,0 0,34 -34,0" 
      fill="url(#mGoldGrad)" stroke="#FFF8EE" stroke-width="3" stroke-linejoin="round"/>

    <circle cx="0" cy="0" r="30" fill="url(#mBinduGlow)"/>
    <circle cx="0" cy="0" r="8" fill="#FFF8EE"/>
  </g>
</svg>
`;

async function generate() {
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), baseSvg.trim());

  const baseBuffer = Buffer.from(baseSvg);
  const maskableBuffer = Buffer.from(maskableSvg);

  await sharp(baseBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Created SANKALPA pwa-192x192.png');

  await sharp(baseBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Created SANKALPA pwa-512x512.png');

  await sharp(maskableBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Created SANKALPA pwa-maskable-512x512.png');

  await sharp(baseBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created SANKALPA apple-touch-icon.png');

  await sharp(baseBuffer).resize(32, 32).png().toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Created SANKALPA favicon.ico');
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
