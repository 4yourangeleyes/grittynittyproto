#!/bin/bash
# Quick PWA Icon Generator for GritDocs
# Creates placeholder icons with "GD" text

cd "$(dirname "$0")/public"

echo "🎨 Creating PWA icons..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not installed."
    echo ""
    echo "Option 1: Install ImageMagick"
    echo "  macOS: brew install imagemagick"
    echo "  Ubuntu: sudo apt-get install imagemagick"
    echo ""
    echo "Option 2: Use online generator"
    echo "  1. Go to: https://www.favicon-generator.org/"
    echo "  2. Create icon with text 'GD'"
    echo "  3. Download and save as:"
    echo "     - icon-192.png"
    echo "     - icon-512.png"
    echo "     - icon-maskable-192.png"
    echo "     - icon-maskable-512.png"
    echo "  4. Place in public/ folder"
    exit 1
fi

# Create 192x192 icon with "GD" text
convert -size 192x192 -background "#48CFCB" \
  -fill white -font Arial-Bold -pointsize 120 \
  -gravity center label:"GD" icon-192.png

# Create 512x512 icon with "GD" text
convert -size 512x512 -background "#48CFCB" \
  -fill white -font Arial-Bold -pointsize 320 \
  -gravity center label:"GD" icon-512.png

# Create maskable versions (with 20% padding for safe area)
convert -size 192x192 -background "#48CFCB" \
  -fill white -font Arial-Bold -pointsize 96 \
  -gravity center label:"GD" icon-maskable-192.png

convert -size 512x512 -background "#48CFCB" \
  -fill white -font Arial-Bold -pointsize 256 \
  -gravity center label:"GD" icon-maskable-512.png

echo "✅ Icons created successfully!"
echo ""
echo "Created files:"
ls -lh icon-*.png

echo ""
echo "Next steps:"
echo "  git add public/icon-*.png"
echo "  git commit -m 'Add PWA icons'"
echo "  git push"
