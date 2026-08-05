#!/usr/bin/env python3
"""
Erzeugt eine kachelbare Film-Grain-Textur (256x256 PNG, entsaettigt).
Ersatz fuer den Live-SVG-Filter feTurbulence: gleiche Optik, aber als Datei
ausgeliefert - kein Filter-Rechenaufwand im Browser.

Aufbau: fraktales Value-Noise mit periodischen Gittern (3 Oktaven),
dadurch nahtlos kachelbar - keine sichtbaren Kanten im Raster.
"""
import random, math
from PIL import Image

SIZE = 256
OCTAVES = 3
BASE_FREQ = 8          # Gitterpunkte pro Kachel in der ersten Oktave
PERSISTENCE = 0.55
SEED = 20260804

random.seed(SEED)


def smoothstep(t):
    return t * t * (3 - 2 * t)


def value_noise_layer(size, freq):
    """Periodisches Value-Noise -> kachelt nahtlos, weil das Gitter umlaeuft."""
    grid = [[random.random() for _ in range(freq)] for _ in range(freq)]
    out = [[0.0] * size for _ in range(size)]
    scale = freq / size
    for y in range(size):
        gy = y * scale
        y0 = int(gy) % freq
        y1 = (y0 + 1) % freq
        fy = smoothstep(gy - int(gy))
        for x in range(size):
            gx = x * scale
            x0 = int(gx) % freq
            x1 = (x0 + 1) % freq
            fx = smoothstep(gx - int(gx))
            top = grid[y0][x0] * (1 - fx) + grid[y0][x1] * fx
            bot = grid[y1][x0] * (1 - fx) + grid[y1][x1] * fx
            out[y][x] = top * (1 - fy) + bot * fy
    return out


def build():
    acc = [[0.0] * SIZE for _ in range(SIZE)]
    amp, total, freq = 1.0, 0.0, BASE_FREQ
    for _ in range(OCTAVES):
        layer = value_noise_layer(SIZE, freq)
        for y in range(SIZE):
            row_a, row_l = acc[y], layer[y]
            for x in range(SIZE):
                row_a[x] += row_l[x] * amp
        total += amp
        amp *= PERSISTENCE
        freq *= 2

    img = Image.new('L', (SIZE, SIZE))
    px = img.load()
    for y in range(SIZE):
        for x in range(SIZE):
            # Überwiegend feines Korn. Der fraktale Anteil bleibt klein,
            # sonst wirkt die Textur wolkig statt wie Filmkorn.
            v = acc[y][x] / total
            v = 0.22 * v + 0.78 * random.random()
            px[x, y] = max(0, min(255, int(v * 255)))
    img.save('grain-256.png', optimize=True)
    print('grain-256.png geschrieben (256x256, kachelbar)')


if __name__ == '__main__':
    build()
