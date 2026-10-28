import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const resolutions = [
  { folder: 'mipmap-mdpi', size: 48, fgSize: 108 },
  { folder: 'mipmap-hdpi', size: 72, fgSize: 162 },
  { folder: 'mipmap-xhdpi', size: 96, fgSize: 216 },
  { folder: 'mipmap-xxhdpi', size: 144, fgSize: 324 },
  { folder: 'mipmap-xxxhdpi', size: 192, fgSize: 432 },
];

async function generate() {
  const srcIcon = path.resolve('public/pwa-512x512.png');
  const resDir = path.resolve('android/app/src/main/res');

  if (!fs.existsSync(srcIcon)) {
    console.error('Source icon not found:', srcIcon);
    return;
  }

  for (const { folder, size, fgSize } of resolutions) {
    const targetDir = path.join(resDir, folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Standard square launcher
    await sharp(srcIcon)
      .resize(size, size)
      .png()
      .toFile(path.join(targetDir, 'ic_launcher.png'));

    // Round launcher
    await sharp(srcIcon)
      .resize(size, size)
      .composite([{
        input: Buffer.from(
          `<svg><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white"/></svg>`
        ),
        blend: 'dest-in'
      }])
      .png()
      .toFile(path.join(targetDir, 'ic_launcher_round.png'));

    // Adaptive icon foreground
    await sharp(srcIcon)
      .resize(Math.round(fgSize * 0.72), Math.round(fgSize * 0.72))
      .extend({
        top: Math.round(fgSize * 0.14),
        bottom: fgSize - Math.round(fgSize * 0.72) - Math.round(fgSize * 0.14),
        left: Math.round(fgSize * 0.14),
        right: fgSize - Math.round(fgSize * 0.72) - Math.round(fgSize * 0.14),
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(path.join(targetDir, 'ic_launcher_foreground.png'));

    console.log(`Generated icons for ${folder}`);
  }
  console.log('All Android icons generated successfully.');
}

generate().catch(console.error);
