#!/usr/bin/env python3
"""
Erzeugt die Korn-Kachel fuer body::after — v3 «Sprenkel statt Schleier».

Dusans Befund (06.08.): Flaechiges Rauschen (jedes Pixel traegt Grau)
legt einen Schleier ueber Text und Kanten -> wirkt UNSCHARF. ESEs Korn
wirkt schaerfend, weil es SPAERLICH ist: wenige harte helle/dunkle
Sprenkel auf transparenter Flaeche fuegen nur Hochfrequenz-Puenktchen
hinzu, ohne Mikrokontrast zu schlucken. Darum: RGBA-Kachel, ~92%
komplett transparent, Rest halb weisse / halb schwarze Einzelpixel.
"""
import random
from PIL import Image

SIZE = 512
DICHTE = 0.08          # Anteil Pixel mit Sprenkel (Rest voll transparent)
SEED = 20260806

random.seed(SEED)


def build():
    img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    px = img.load()
    for y in range(SIZE):
        for x in range(SIZE):
            if random.random() < DICHTE:
                hell = random.random() < 0.5
                wert = 255 if hell else 0
                alpha = random.randint(160, 255)
                px[x, y] = (wert, wert, wert, alpha)
    img.save('public/grain-fein.png', optimize=True)
    print('public/grain-fein.png geschrieben (512, Sprenkel, Dichte %.0f%%)' % (DICHTE * 100))


if __name__ == '__main__':
    build()
