#!/usr/bin/env node

/**
 * Convert SVG logo to PNG icons for PWA
 * Requires: npm install sharp
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');
const svgFile = path.join(publicDir, 'icon.svg');

if (!fs.existsSync(svgFile)) {
  console.error(`❌ Error: ${svgFile} not found`);
  process.exit(1);
}

console.log('🎨 Converting your logo to PNG icons...\n');

const sizes = [
  { size: 192, file: 'icon-192.png' },
  { size: 512, file: 'icon-512.png' },
  { size: 192, file: 'icon-maskable-192.png' },
  { size: 512, file: 'icon-maskable-512.png' },
];

(async () => {
  try {
    for (const {size, file} of sizes) {
      const outputPath = path.join(publicDir, file);
      await sharp(svgFile)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Created ${file} (${size}x${size})`);
    }
    
    console.log('\n🎉 All icons created successfully!');
    console.log('\nNext steps:');
    console.log('  git add public/icon-*.png');
    console.log('  git commit -m "Add custom GritDocs logo as PWA icons"');
    console.log('  git push');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
