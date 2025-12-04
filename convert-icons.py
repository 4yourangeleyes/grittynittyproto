#!/usr/bin/env python3
"""
Convert SVG logo to PNG icons for PWA
"""
import os
import subprocess
from pathlib import Path

# Check if we can use Python's Pillow library
try:
    from PIL import Image
    import io
    HAS_PILLOW = True
except ImportError:
    HAS_PILLOW = False

public_dir = Path('public')
svg_file = public_dir / 'icon.svg'

if not svg_file.exists():
    print(f"❌ Error: {svg_file} not found")
    exit(1)

print(f"📦 Converting {svg_file} to PNG icons...")

# Sizes needed: 192x192 and 512x512 (regular and maskable)
sizes = [
    (192, 'icon-192.png'),
    (512, 'icon-512.png'),
    (192, 'icon-maskable-192.png'),
    (512, 'icon-maskable-512.png'),
]

if HAS_PILLOW:
    print("✅ Using Pillow to convert SVG → PNG")
    from cairosvg import svg2png
    
    try:
        for size, filename in sizes:
            output_path = public_dir / filename
            svg2png(
                url=str(svg_file),
                write_to=str(output_path),
                output_width=size,
                output_height=size
            )
            print(f"  ✓ Created {filename}")
        print("\n✅ All icons created successfully!")
    except Exception as e:
        print(f"⚠️  Pillow method failed: {e}")
        print("Try installing: pip install cairosvg pillow")
else:
    print("⚠️  Python Pillow not installed.")
    print("\n📝 Fallback: Use an online converter")
    print("   1. Go to: https://cloudconvert.com/svg-to-png")
    print("   2. Upload: public/icon.svg")
    print("   3. Download 4 versions:")
    print("      - 192x192 → icon-192.png")
    print("      - 512x512 → icon-512.png")
    print("      - 192x192 (maskable) → icon-maskable-192.png")
    print("      - 512x512 (maskable) → icon-maskable-512.png")
    print("   4. Place all in public/ folder")
