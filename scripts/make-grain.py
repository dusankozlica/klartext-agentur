#!/usr/bin/env python3
"""
Erzeugt die Korn-Kachel (512x512 PNG, Graustufen) fuer body::after.

v2 nach der ESE-Vermessung vom 05.08.2026: Deren Overlay liegt bei nur
4% Deckkraft und ist trotzdem deutlich sichtbar, weil die Kachel KNACKIGES
Pixel-Rauschen ist (TV-Static als GIF). Unsere v1 war weichgezeichnet und
verschwand dadurch praktisch. v2 = reines Pixelrauschen mit angehobenem
Kontrast, ohne Weichzeichner. Pro-Pixel-Zufall kachelt per Definition
nahtlos - es gibt keine Struktur, die an der Kante brechen koennte.
"""
import random
from PIL import Image

SIZE = 512
KONTRAST = 2.2          # hart Richtung Speckle - noetig bei 4% Deckkraft
SEED = 20260805

random.seed(SEED)


def build():
    img = Image.new('L', (SIZE, SIZE))
    px = img.load()
    for y in range(SIZE):
        for x in range(SIZE):
            v = random.random()
            v = 0.5 + (v - 0.5) * KONTRAST
            px[x, y] = max(0, min(255, int(v * 255)))
    img.save('public/grain-fein.png', optimize=True)
    print('public/grain-fein.png geschrieben (512x512, Pixelrauschen)')


if __name__ == '__main__':
    build()
