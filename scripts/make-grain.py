#!/usr/bin/env python3
"""
Korn-Kachel fuer body::after — v4, nach Messung an Dusans Referenzvideo
(07.08.2026, hf_20260405_171521…mp4).

Gemessen im Video (Standardabweichung nach Tiefpass, Skala 0-255):
  * Amplitude      ~1.4  (also ~0.55 % — sehr zurueckhaltend)
  * R-G-Korrelation 0.87 (also MONOCHROMES Korn, kein Farbrauschen)
  * Autokorrelation 1px 0.62 / 2px 0.28

Der letzte Punkt war mein Fehler in v3: Dort lag hartes EINZELPIXEL-
Rauschen (Autokorrelation ~0) — das liest sich als Schmutz auf dem
Schirm. Echtes Filmkorn ist leicht verklumpt, weiche Bloebchen von
zwei bis drei Pixeln. Darum: weisses Rauschen, leicht weichgezeichnet,
danach neu normiert; hell und dunkel je zur Haelfte, Staerke ueber den
Alphakanal. Die Deckkraft steht im CSS.
"""
import random
from PIL import Image, ImageFilter

SIZE = 512
SIGMA = 0.7          # Verklumpung: ergibt Bloebchen von ~2 px
ZIEL_MITTEL = 62     # mittlere Alpha-Staerke; Feinabstimmung via CSS-Deckkraft
SEED = 20260807

random.seed(SEED)


def build():
    # 1) weisses Rauschen
    roh = Image.new('L', (SIZE, SIZE))
    roh.putdata([random.randint(0, 255) for _ in range(SIZE * SIZE)])
    # 2) leicht verklumpen (Filmkorn statt Einzelpixel)
    weich = roh.filter(ImageFilter.GaussianBlur(SIGMA))
    werte = list(weich.getdata())
    mitte = sum(werte) / len(werte)
    abw = (sum((v - mitte) ** 2 for v in werte) / len(werte)) ** 0.5
    # 3) auf Ziel-Staerke normieren, Vorzeichen bestimmt hell/dunkel
    faktor = ZIEL_MITTEL / (abw * 0.8)
    px = []
    for v in werte:
        d = (v - mitte) * faktor
        hell = d >= 0
        a = min(255, int(abs(d)))
        px.append((255, 255, 255, a) if hell else (0, 0, 0, a))
    img = Image.new('RGBA', (SIZE, SIZE))
    img.putdata(px)
    img.save('public/grain-fein.png', optimize=True)
    mittel_a = sum(p[3] for p in px) / len(px)
    print(f'public/grain-fein.png geschrieben — mittleres Alpha {mittel_a:.1f}, Sigma {SIGMA}')


if __name__ == '__main__':
    build()
