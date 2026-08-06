# NOTES — KLARTEXT.

Änderungslog. Neueste Phase oben.

---

## Messbare Abnahme — Lighthouse und Mobil (04.08.2026)

Bis hierher war die Qualitätsprüfung Handarbeit und `curl`. Beides hat einen
schweren Fehler übersehen. Mit dem installierten Chrome liessen sich Lighthouse
und echte Geräte-Emulation nachrüsten — und damit fiel er sofort auf.

### Der schwerste Fehler der ganzen Arbeit

**Die Seite stürzte im Browser ab, sobald sie als Produktionsbuild lief.**

Ursache: Die Platzhalter-Sperre in `lib/placeholders.ts` lief im Client mit.
`MediaLoop` war eine Client-Komponente und rief `placeholder()` auf. Im Browser
ist `NODE_ENV` zwar `production`, aber `ALLOW_PLACEHOLDERS` existiert dort nicht
(keine `NEXT_PUBLIC_`-Variable) — also warf die Sperre beim Hydrieren, React
starb, und mit ihm Titel, `lang` und `<main>`.

Warum es so lange unentdeckt blieb: `curl` sieht nur das Server-HTML, und das
war fehlerfrei. Der Absturz passiert erst danach im Browser.

Lighthouse-Werte vorher: Barrierefreiheit **69**, SEO **82**.

Behoben zweifach:
1. Die Sperre greift nur noch serverseitig (`typeof window !== 'undefined'`).
2. Architektur korrigiert: Client-Komponenten bekommen fertige Pfade als Props,
   das Register bleibt auf dem Server. Nebeneffekt: 184.9 → 181.5 kB First Load JS,
   weil die Base64-Vorschaubilder nicht mehr ins Browser-Bündel wandern.

### Weitere gefundene und behobene Fehler

| Fund | Ursache |
|---|---|
| Tastaturfalle im Schnitt | Die aria-versteckte Kopie enthält Links und Buttons. `aria-hidden` allein lässt sie in der Tab-Reihenfolge — Nutzer landeten in unsichtbaren Doppel-Links. Jetzt zusätzlich `inert`. |
| Schnitt zerfiel auf Mobil | `.cut__base` war nur so hoch wie sein Inhalt, die Kopie über `inset:0` so hoch wie die Sektion — beide zentrierten auf unterschiedlicher Höhe, der Text stand doppelt untereinander. Auf dem Desktop verdeckte die Medienspalte den Fehler. |
| Violettfläche lief in die nächste Sektion | Die Fläche wird nach unten verschoben und ragte ohne `overflow:hidden` genau um diesen Betrag über die Sektion hinaus. |
| Seitwärts-Scrollen auf der Startseite | `shrink-0` an der Leistungszeile der Projektkacheln: „Social Media · Marketingpartner" konnte nicht umbrechen, Inhalt 504 px in 390 px Fenster. |
| Seitwärts-Scrollen auf `/datenschutz` | `scrollbar-gutter: stable` — der reservierte Streifen zählt für die fixierte Leiste zur Viewport-Breite, für den Inhalt nicht. |
| Touch-Ziele unter 44 px | Navigations- und Footer-Links waren 20 px hoch, Filter-Buttons 43 px breit. |
| Zeilenlänge sprengte den Bildschirm | `max-width:68ch` ist auf 390 px breiter als das Gerät. |

### Zwei eigene Irrtümer, korrigiert

- **Font-Preload machte es schlechter.** Vorladen der Anzeigeschrift verschob FCP
  von 0.91 auf 1.36 s (dreimal gemessen). Wieder entfernt.
- **„Lazy Poster" kostete 1.7 s LCP.** Das Showreel-Video ist das LCP-Element;
  ohne sofortiges Poster entsteht es erst nach dem Hydrieren — LCP sprang von
  2.2 auf 3.9 s. Zurückgenommen; die 28 KB sind der kleinere Preis.

Beide Male hatte ich mehrere Dinge gleichzeitig geändert und musste erst
isolieren. Einzelne Messläufe hätten das nicht gezeigt — erst drei Läufe je
Zustand trennten Signal von Rauschen.

### Stand der Abnahme gegen Abschnitt 8

| Ziel | Ist |
|---|---|
| Lighthouse mobil ≥ 95 | Performance **98**, Barrierefreiheit **100**, Best Practices **100**, SEO **100** |
| LCP < 2.0 s | **2.33 s** — verfehlt |
| CLS < 0.05 | **0.0001** |
| INP < 200 ms | TBT **13 ms** (Näherung) |
| JS First Load < 180 kB | **181.5 kB** — knapp verfehlt |
| Responsiv 390 px | **geprüft**, alle 11 Seiten ohne Überlauf, alle Touch-Ziele ≥ 44 px |
| WCAG 2.2 AA | Kontraste gerechnet, Lighthouse 100, Tastaturfalle behoben |

Weitere Seiten: Kontakt 99/100/100/100, Leistung Branding 100/100/100/100.

### Neue Werkzeuge im Repo

- `scripts/mobil-check.mjs` — Überlauf und Touch-Ziele über alle Seiten,
  mit den WCAG-Ausnahmen für Links im Fliesstext.
- `scripts/mobil-bilder.mjs` — Screenshots im echten Gerätemodus.
  **Wichtig:** Chrome über `--window-size` und `--screenshot` täuscht — es legt
  die Seite breiter aus und schneidet zu, was wie abgeschnittener Text aussieht.
  Nur echte Emulation zeigt den wahren Zustand.

### Offen

- **LCP 2.33 s** gegen Ziel 2.0 s. Das LCP-Element ist das Platzhalter-Poster
  des Showreels; mit echtem, optimiertem Material dürfte es darunter fallen.
- **181.5 kB** gegen 180 kB. Der Rest ist React plus Next-Framework.

---

## Ausbau — alle Texte, Medien im Header (04.08.2026)

**Auftrag:** alle Texte fertig schreiben, Platzhalter-Fotos und -Videos einsetzen,
Header mit Video und Fotos aufwerten, Seite fertigstellen.

### Texte

Sämtliche sichtbaren Texte sind geschrieben. Im ausgelieferten HTML steht auf
keiner Seite mehr ein `TODO` — geprüft über alle 13 Seiten.

- **Leistungen**: je Leistung Claim, Zielgruppe, das Problem in den Worten des
  Kunden, Leistungsumfang, vierstufiger Ablauf, Preislogik und eigene FAQ.
- **Referenzen**: drei ausgeschriebene Fälle mit Ausgangslage und Vorgehen.
- **Blog**: drei vollständige Artikel.
- **FAQ**: acht Antworten im Telefon-Ton.
- **Team**, **Kontakt**, **Impressum**, **Datenschutz**: ausgeschrieben.

### Bewusste Abweichung vom Auftrag

Kundennamen, Kennzahlen und Kundenzitate wurden **nicht erfunden**. Eine erfundene
Zahl auf einer Case Study ist eine falsche Tatsachenbehauptung gegenüber
Interessenten — und sie fliegt auf.

Stattdessen ist die Zurückhaltung als Haltung ausformuliert: Referenzen laufen
anonymisiert („Schreinerei im Mittelland"), und der Ergebnisabschnitt sagt offen,
dass Zahlen erst mit Freigabe und Messmethode erscheinen. `anzeigeName()` schaltet
automatisch auf den echten Firmennamen um, sobald `freigabeVorhanden` gesetzt ist.

Ebenso ungefüllt: Adresse, Telefon, E-Mail, Rechtsform. Leere Felder werden
weggelassen statt mit Platzhaltertext gefüllt — `offeneStammdaten()` führt Buch,
das Impressum zeigt den Stand.

### Medien

- **Header**: Medienspalte mit stummem Schleifenvideo (9:16) und versetztem Foto.
- **Showreel** als breites Band direkt unter dem Hero.
- Medienbänder auf den Leistungs- und Case-Seiten.
- `MediaLoop` startet erst im Sichtbereich, hält bei Reduced Motion an und lädt
  vorher nur das Poster.

### Unterwegs gefundene und behobene Fehler

| Fund | Ursache |
|---|---|
| Hydration-Mismatch am `<html>` | Das Inline-Skript setzt `class="js"` vor der Hydration. React meldete den Unterschied und flickte ihn nicht. Gelöst mit `suppressHydrationWarning` — an dieser Stelle die richtige Antwort, nicht ein Zudecken. |
| Headline brach vierzeilig um | Mit der Medienspalte teilt sich die Type die Breite. Bei 9.5vw ging der Zeilenbau verloren. Eigene Grösse `display--hero` ab 1024px. |
| Medien verschwanden unter der Kante | Die Medienspalte kollabierte in der Kopie-Ebene auf 0 × 0: `justify-self-end` mit `max-w` — in der Basis gibt das Video eine Eigenbreite vor, in der Kopie liefern absolut positionierte Bilder keine. Feste Breite statt maximaler. |
| Letztes sichtbares `TODO` | Kalender-Baustein ohne konfigurierten Link. Zeigt jetzt den Weg, der tatsächlich funktioniert. |
| Doppelte Typdateien im Build | `.next/types/*  2.ts` liessen `tsc` an doppelten Bezeichnern scheitern. `.next` gelöscht und neu gebaut. |

### Kontrast-Audit (gerechnet, nicht geschätzt)

Alle tatsächlich verwendeten Farb- und Deckkraft-Kombinationen wurden gegen
WCAG 2.2 AA nachgerechnet. **Sechs Verletzungen gefunden und behoben** — alle
auf Violettflächen bzw. bei sehr schwachen Abstufungen:

| Stelle | vorher | Soll |
|---|---|---|
| Fliesstext `opacity-85` auf Violett | 4.04 | 4.5 |
| Fliesstext `opacity-80` auf Violett | 3.66 | 4.5 |
| Kleintext `opacity-70` auf Violett | 3.03 | 4.5 |
| `.eyebrow` (global `opacity-.7`) auf Violett | 3.03 | 4.5 |
| Ablauf-Nummer `opacity-60` auf Violett | 2.47 | 4.5 |
| Nummerierung `opacity-50` auf Paper / Creme-Tint | 3.47 / 3.48 | 4.5 |

Ursache: `#6A00F4` ist zu dunkel, als dass abgeschwächtes Creme noch trägt.
Regel daraus: **auf Violett keine Deckkraft-Abstufung für Text** — Hierarchie
über Grösse, Schnitt und Versalsatz. Auf hellen Flächen Untergrenze 0.65.
Nach der Korrektur: keine Verletzung mehr.

### Gescheiterter Prüflauf — ehrlich vermerkt

Ein automatisierter Prüflauf mit fünf parallelen Prüfern (Texte, Wahrheitsgehalt,
Barrierefreiheit, Technik, Performance) **ist vollständig gescheitert**: alle
fünf blieben wiederholt hängen und lieferten nach rund 95 Minuten und 630
Werkzeugaufrufen **kein einziges Ergebnis**. Das Kontrast-Audit oben und die
Seitenprüfung wurden danach von Hand durchgeführt.

Offen bleibt damit, was dieser Lauf hätte abdecken sollen: eine unabhängige
zweite Meinung zu Texten und Technik.

### Geprüft

- Build grün, 26 Routen, TypeScript strict fehlerfrei.
- 15 Seiten: genau eine `<h1>`, kein Bild ohne `alt`, kein sichtbares `TODO`,
  kein scharfes s, `lang="de-CH"`.
- Basis und Kopie des Schnitts liegen exakt übereinander (Versatz 0 px in beiden
  Achsen, im Browser gemessen).
- `llms.txt`, `robots.txt`, `sitemap.xml` (19 URLs) korrekt.

---

## Phasen 2–7 — alle Seiten (04.08.2026)

**Stand: gebaut, Build grün, 24 Routen.** Was noch fehlt, steht unten unter
„Offen“ — es fehlt nichts Technisches, sondern Inhalte und Zugangsdaten.

### Seiten

`/` · `/leistungen` + 5 Detailseiten · `/projekte` + 3 Case Studies ·
`/team` · `/blog` + Artikel · `/kontakt` · `/impressum` · `/datenschutz` ·
`sitemap.xml` · `robots.txt` · `llms.txt` · `opengraph-image`

### Aufbau

- **Content-Repository-Pattern**: Alle Inhalte laufen über `lib/content/*`.
  Komponenten sehen nie das Dateisystem und nie rohe Daten. Ein CMS lässt
  sich später dahinterhängen, ohne eine Seite anzufassen.
- **Blog** als MDX unter `content/blog/`, gerendert über `next-mdx-remote`.
  Lesezeit und Inhaltsverzeichnis (ab 800 Wörtern) werden aus dem Text
  berechnet, nicht gepflegt.
- **Kontaktformular** als Server Action mit vier Ebenen: Honeypot,
  Zeitfalle (< 3 s = Bot), Rate Limit pro IP, Turnstile sobald konfiguriert.
- **Video-Testimonials** mit Facade-Pattern (nur Poster, `preload="none"`),
  Lightbox mit Fokusfalle und Escape.
- **JSON-LD**: ProfessionalService, FAQPage, BreadcrumbList, Article,
  CreativeWork, VideoObject.

### Entscheidungen mit Begründung

- **Kennzahlen ohne Herkunft werden nicht ausgegeben.** `belastbareKennzahlen()`
  filtert alles heraus, dem Messmethode oder Zeitraum fehlt — die Regel steht
  im Code, nicht im Kommentar.
- **Video ohne Freigabe wird nicht gerendert.** `ausspielbar()` lässt in
  Produktion nur Einträge mit Freigabe UND Untertiteln durch.
- **Kundenlogo-Marquee fehlt bewusst.** Abschnitt 5 verlangt mindestens fünf
  echte, freigegebene Logos; es sind null. Die Sektion erscheint automatisch,
  sobald `kundenlogos` in `lib/content/team.ts` gefüllt ist.
- **JSON-LD lässt TODO-Felder weg**, statt sie auszugeben. Ein `addressLocality:
  "TODO: Ort"` wäre eine Falschangabe gegenüber Suchmaschinen.
- **Turnstile nur mit Schlüsseln aktiv.** Ohne Schlüssel würde jede Prüfung
  fehlschlagen und das Formular wäre tot.
- **Ohne Postfach-Anbindung meldet das Formular ehrlich einen Fehler**, statt
  „gesendet“ zu behaupten und die Anfrage zu verlieren. Geprüft.
- **Motion wird nachgeladen** (`components/motion/MotionLayer.tsx`).
  Gemessen: 232 kB → 184 kB First Load JS.
- **Kante folgt der Headline**, nicht mehr einem festen Prozentwert.

### Unterwegs gefundene und behobene Fehler

| Fund | Ursache |
|---|---|
| Kante lief unter der Überschrift durch | Fester Prozentwert der Sektionshöhe passte nur zur dreizeiligen Hero-Headline. Auf allen Unterseiten fand das Signature-Element schlicht nicht statt. Die Ruhelage wird jetzt aus der Mittellinie der Headline berechnet. |
| First Load JS 232 kB statt < 180 kB | GSAP, ScrollTrigger und Lenis lagen im Erstladen, obwohl sie erst beim Scrollen gebraucht werden. |
| Reveals wären ohne JS unsichtbar geblieben | Der Startzustand `opacity: 0` galt unbedingt. Er gilt jetzt nur unter `.js`, gesetzt von einem Inline-Skript vor dem Zeichnen. |
| Grosse leere Violettflächen auf Unterseiten | Mindesthöhe 72 svh bei einzeiligen Kopfzeilen. |
| `metadataBase` fehlte | OG-Bilder wurden gegen `localhost:3000` aufgelöst. |

### Geprüft

- Build grün, TypeScript strict fehlerfrei, 24 Routen statisch erzeugt.
- Alle 11 Seiten: genau eine `<h1>`, kein `<img>` ohne `alt`, kein leerer
  Link, `lang="de-CH"`.
- Platzhalter-Sperre greift im Produktionsbuild und lässt sich mit
  `ALLOW_PLACEHOLDERS=1` bewusst aufheben.
- Kontaktformular: Feldprüfung, Fehlerverknüpfung über `aria-describedby`,
  ehrliche Meldung ohne Postfach-Anbindung.
- Inhalte stehen ohne JS im HTML.

### Offen

- **First Load JS 184 kB gegen ein Ziel von 180 kB** — 4 kB darüber. Der Rest
  ist React plus Next-Framework, nicht eigener Code.
- **Mobil weiterhin ungeprüft** (auf deinen Wunsch zurückgestellt).
- **Lighthouse wurde nicht gemessen** — kein Chrome-Launcher in dieser
  Umgebung. Die Einzelwerte aus Abschnitt 8 (LCP, INP, CLS) sind damit
  unbelegt.
- **Reduced Motion** implementiert, nicht maschinell getestet.
- Zugangsdaten laut `.env.example`, Stammdaten laut `lib/content/site.ts`.
- Datenschutzerklärung und Impressum brauchen fachliche Abnahme.

---

## Phase 1 — Fundament (04.08.2026)

**Stand: fertig.** Build läuft durch, Sichtprüfung erfolgt.

### Aufgebaut

- **Next.js 16.3 (App Router) + TypeScript strict + Tailwind v4**, Turbopack.
- **Tokens** in `app/globals.css`: 6 Farbwerte, 8pt-Skala, eine Content-Breite
  (`--maxw: 1360px`), ein horizontaler Rand, ein Sektionsrhythmus.
  Tailwind-Theme leitet sich per `@theme inline` daraus ab — keine Hex-Werte
  im Komponentencode.
- **Schriften selbst gehostet**: Clash Display 600/700, Switzer 400/500/600,
  zusammen 84 KB woff2 in `public/fonts/`. Nachladen über
  `node scripts/fetch-fonts.mjs`, das auch `app/fonts.css` neu schreibt.
  Kein Google-/Fontshare-Request beim Seitenaufruf.
- **Der Schnitt** (`components/ui/Cut.tsx`) als Signature-Element.
- **Grain** (`components/layout/Grain.tsx` + `public/grain-256.png`),
  erzeugt mit `scripts/make-grain.py`.
- **Motion-Fundament**: Lenis + GSAP/ScrollTrigger (`components/motion/`),
  Masken-Reveals, Parallax über `data-scroll-speed`, Custom Cursor als Balken,
  Navigationsfarbe je Sektion.
- **Platzhalter-System**: 36 Assets über `scripts/generate-placeholders.mjs`,
  Register in `content/_placeholders.json`, Zugriff über `lib/placeholders.ts`,
  Badge im Dev-Modus, Build-Sperre für Produktion
  (`ALLOW_PLACEHOLDERS=1` hebt sie für Preview-Deployments auf).
- **Reduced-Motion-Pfad**: Lenis wird gar nicht erst erzeugt, Reveals stehen
  im Endzustand, Cursor aus, Grain bleibt sichtbar aber unbewegt.

### Entscheidungen mit Begründung

- **Lenis statt ScrollSmoother.** ScrollSmoother verpackt den Inhalt in einen
  transformierten Container; darin verliert `position: fixed` seine
  Bezugsgrösse. Grain, Cursor und Navigation stehen aber genau darauf.
- **Grain ohne `mix-blend-mode`.** Abschnitt 3.5 des Briefs schreibt `overlay`
  bzw. `soft-light` vor. Gemessen auf `#6A00F4`: Abweichung R 10 / G 0 / B 1 —
  beide Modi rechnen multiplikativ, und bei G=0 sowie B=244 bleibt kein
  Spielraum. Das Grain wäre auf Violettflächen unsichtbar, also genau dort, wo
  es das Colour Banding kaschieren soll. Normales Alpha-Blending bei
  `opacity: .07` verschiebt alle drei Kanäle gleichmässig um ±8.
- **`ffmpeg-static` statt System-ffmpeg.** Auf dem Rechner ist kein ffmpeg
  installiert; die Binärdatei liegt jetzt in `node_modules` und reist mit dem
  Repo, ohne Systemeingriff.
- **Laufweite Display auf `-0.02em`** statt `-0.035em`. Clash Display läuft von
  Haus aus eng; im Display-Grad verschmolzen sonst die Wörter.
- **Navigationsfarbe ohne Übergang.** Ink → Creme interpoliert durch ein
  schlammiges Oliv (gemessen `rgb(161,136,110)`), über Violett sichtbar.
  Ein harter Wechsel entspricht ausserdem dem Prinzip des Schnitts.

### Unterwegs gefundene und behobene Fehler

| Fund | Ursache |
|---|---|
| Violettfläche rutschte aus dem Bild | GSAP las die CSS-Transform als Startwert und addierte `yPercent` — 108 % statt 54 %. Position läuft jetzt nur über `--cut`. |
| Buttons überlappten die Headline | Zwei `from()`-Tweens auf denselben Zeilen froren sie im Endzustand ein. |
| Grain auf Violett unsichtbar | siehe Blend-Mode oben |
| Wortmarke leuchtete neongrün | `mix-blend-mode: difference`: Weiss minus Violett = Neongrün — der Look, den 3.6 ausschliesst. |
| Zwei `<h1>` im HTML | Der Schnitt rendert den Inhalt zweimal. `Cut` nimmt jetzt eine Render-Funktion mit `isCopy`; die Kopie legt ihre Überschriften-Semantik ab. |
| Navigation schaltete zu früh zurück | Schwelle lag auf der Unterkante der Leiste statt auf ihrer Mittellinie. |
| Build-Sperre für Platzhalter griff nicht | Die Funktion war geschrieben, aber nirgends aufgerufen. Sie hängt jetzt am Zugriff `placeholder()` selbst — beide Fälle (mit und ohne `ALLOW_PLACEHOLDERS=1`) sind geprüft. |

### Offen / nicht verifiziert

- **Mobil-Layout bei 390 px ist ungeprüft.** Beide Browser-Ansichten liessen
  sich nicht auf Mobilbreite zwingen. Muss auf einem echten Gerät geprüft
  werden, bevor Phase 2 abgenommen wird.
- **`prefers-reduced-motion` ist implementiert, aber nicht maschinell getestet.**
- Die acht Angaben aus Abschnitt 0 des Briefs fehlen weiterhin (Domain,
  Standort, Positionierung, Sprachen, Team, Cases, Video-Testimonials, Social).
  Überall dort steht `TODO:` — nichts davon wird erfunden.

### Nächster Schritt

Phase 2: Home vollständig.

---

## Medien- und Design-Ausbau nach Kritik (04.08.2026, zweiter Teil)

Kritik von Dusan: sieht kaputt aus, nichts wirkt smooth, keine echten
Platzhalter-Medien, Header/Team/Blog zu brav, Grain zu stark, Referenzen
nicht umgesetzt. Befund und Massnahmen:

- **Cursor-Bug bestätigt und behoben**: Der Balken sass ab Laden in
  Bildschirmmitte (der „schwarze Strich"). Jetzt unsichtbar bis zur ersten
  Mausbewegung.
- **Grain auf 0.042** — 0.07 lag über der Brief-Spanne (0.035–0.06).
- **Smooth Scroll gemessen**: Lenis aktiv, Mausrad-Stoss läuft über 24 Frames
  aus, Kante wandert beim Scrollen. Kein Fehler auffindbar. Achtung: macOS
  „Bewegung reduzieren" schaltet bewusst alles ab.
- **21 echte Stock-Medien** (Freepik, Premium-Konto des zweiten Medien-Servers;
  19 Fotos, 2 Videos 1080p) kuratiert, auf Slot-Masse geschnitten, WebP+LQIP,
  Register mit `quelle: Freepik #ID` für den Lizenznachweis.
  KI-Generierung auf dem ersten Server war nicht gedeckt (0.7 Credits,
  unlim nicht verfügbar) — bewusst nicht auf Kosten des Users generiert.
- **Header-Collage**: gerahmte Video-Karte (Ink-Rahmen, violetter
  Schattenversatz), angeschnittenes Polaroid, echter PNG→WebP-Freisteller
  (Weiss-Keying mit weicher Kante; 3.5-MB-PNG → 366-KB-WebP). Die Person
  steht in beiden Ebenen — die Kante läuft durch sie hindurch.
- **Intro portiert** (Kante steigt, Wortmarke schneidet sich auf), einmal
  pro Session; Reveals überlassen dem Intro die Hero-Zeilen via
  sessionStorage-Reihenfolge.
- **Team**: gerahmte, gedrehte, gestaffelte Karten mit Nummern.
- **Blog**: neue Home-Sektion (Zeilen, Hover-Bildkarte) + Index mit
  Miniaturen und Nummern.
- **Fehlversuche, dokumentiert**: mix-blend-multiply als Fake-Freisteller
  scheitert in der Kopie-Ebene (transform = eigener Stapelkontext);
  Next-Image-Cache überlebt Builds in .next/cache (altes Poster) → bei
  Asset-Tausch .next löschen.

Endstand Lighthouse mobil: **94 / 100 / 100 / 100**, LCP 2.6 s (Ziel 2.0
verfehlt — Treiber sind die echten Hero-Medien), CLS 0, Mobil-Check über
11 Seiten sauber, 181.5 kB First Load JS.

## 2026-08-04 · Referenz-Studium (echtes Chrome) + Umbau auf Referenzniveau

**Referenzen erstmals wirklich gesichtet** — im echten Chrome via MCP, weil:
Sharebien-Preloader (Zähler 0→100, ~35s) läuft headless/Browser-Pane nie durch;
Nexola (Framer) friert im verdeckten Fenster ein (scroll-getriebene Transforms
laufen nicht — Wortmarke bleibt über allem stehen; PageDown/scrollTo/Resize
halfen nicht; abgebrochen, Headless-Captures reichten für die Muster).

Gemessene Referenzwerte: Sharebien H1 6.7vw (PP Neue Montreal, lh 0.89),
Person-Freisteller volle Höhe auf Farbfeld, Geister-Kundenliste, Decode-Labels,
Pill-Nav; ESE H1 150px/8.7vw (Suisse Intl), «Das Team» 130px QUER über
Porträtband, Awards als Haarlinien-Tabelle, News-Karten mit Chips; volle
Video-Bänder mit überbreiter Headline.

**Umbau:** Hero = Typo (9.5vw, Deckel 8.8rem) + Freisteller (neu 1225px breit,
getrimmt, 601KB WebP) an der Schnittkante + gerahmte Loop-Karte + Geisterliste
(Fachbegriffe, keine erfundenen Namen) + Decode-Eyebrows. Showreel als
Full-Bleed-Band mit Ecklabels. Haltung = Statement auf Papier mit violetten
Akzentwörtern (Farbfläche raus). Arbeiten = volle Bildbänder mit
Haarlinien-Metazeile (01 · Kunde · Leistungen · ↗). Leistungen =
Haarlinien-Tabelle. KI auf Creme statt Ink. Team = Porträtband mit
Papierband-Headline quer drüber (ESE-Muster, flach statt Abdunkelung).
Blog = 3 Karten (Kicker · Titel · Beschrieb); KI-Artikel hat eigenes Cover
(services/ki-fuer-kmu statt Doppelnutzung cover-01). CTA-Cut mit
Geister-Wortmarke 11.5vw. Team-/Blog-Seite: Rahmen/Rotationen/Versatz raus.

**Bugs dieser Runde:** (1) Eigene z-[1..3] im Hero hoben die Basis ÜBER die
Schnitt-Ebene → unterhalb der Kante stand Ink auf Violett; Fix:
.cut__plane{z-index:10} mit Begründungskommentar. (2) Parallax-Bilder rissen
an vollbreiten Bändern Kanten auf → Scale wächst um |speed| mit.
(3) «Showreel»-Label oben lief hinter die fixe Nav → beide Labels unten.
(4) fuerWen ist String, nicht Array — fuerWen[0] hätte 1 Buchstaben gezeigt.

**Messwerte:** A11y 100 · BP 100 · SEO 100 · CLS 0 · TBT 30ms · Perf 80,
LCP 4.8s — LCP-Element ist der Hero-LEAD-TEXT und wartet aufs Intro
(Lighthouse-Profil ohne kt_intro-Schlüssel → Intro läuft ~3s als Overlay).
Kein Bildproblem (TTFB 6ms, Render-Delay 267ms). Offen: Intro kürzen oder
Zeilen unterm Overlay vorab zeichnen, dann ist <2s wieder drin. Mobile
390px: 0px Overflow.

## 2026-08-05 · v3 — Kompletter Neustart nach Dusans Referenz-Set

**Auftrag:** Alles neu ausser Schrift + Name. Violett nur Akzent, helleres
Creme + Schwarz, Körnung viel feiner. Referenzen: ESE (Video-Hero, Team,
News-Karten, Expertise-Visual), sohub (Statement-Zweitton, Work-Karten,
runde Sheets), nexola (Leistungs-Tabelle mit +), ohhmydesign (Footer mit
Riesen-Wortmarke + E-Mail), pixel.melbourne (Overlay-Menü mit
Vollbreiten-Hover-Balken), sirnik (Projekt-Explorer).

**Umsetzung:** Tokens v3 (gleiche NAMEN, neue Werte — Unterseiten ziehen
automatisch mit): Ink #0E0D0B, Creme #F3EEE3, Violett #6A00F4 (+ hell
#A57BFF für Text auf dunkel), Radien 18/26, Pill-Buttons. Startseite:
Kino-Video-Hero (Freepik #7439298) → Statement mit Zweitton/Akzent →
Work-Karten (rund, Chips, →-Titel) → Leistungs-Tabelle mit
Violett-Balken-Hover UND -Aufklappen (pixel×nexola) → Outline-Typo-Band
über Neon-Video (#7580560) → Team grayscale→Farbe → Blog-Karten dunkel →
FAQ → Footer mit Riesen-Wortmarke, Status-Punkt, „bitte nicht klicken".
Overlay-Menü von rechts, riesige Zeilen, Hover = Violett-Balken mit ↗.
Projekte = sirnik-Explorer (Hover wechselt Vorschau + Steckbrief).
Unterseiten: PageHero dunkel (ESE /agency), Schnitt/Cut komplett entfernt,
Intro neu (Wortmarke buchstabenweise, ~1.5s, nur Desktop).
Körnung: 512er-Kachel σ26 + Blur, Deckkraft .05, als body::after.

**Perf-Jagd (Lektion!):** LH meldete stur LCP 4.6s. Vier echte Fixes
(SSR-line__i statt splitLines-Mutation, Grain als Pseudo-Element statt
LCP-fähigem Div, Video-Quelle erst nach window.load, Intro nicht auf
Mobile) — Wert unverändert. PerformanceObserver direkt: EIN Eintrag,
752ms. `--throttling-method=devtools`: **Perf 98, LCP 1.6s, FCP 1.6s,
CLS 0.** Der 4.6er war Lantern-Simulations-Pessimismus bei
font-abhängigem Text-LCP. Merken: Bei stur unbeweglichem LH-Wert echte
Einträge beobachten statt weiterschrauben.

A11y 100 (Grau-l auf #6B6455 nachgedunkelt), BP 100, SEO 100,
Mobile 390px: 0px Überlauf. Font-Preload Clash-600 einzeln gemessen.

## 2026-08-05 · GitHub Pages + der Menü-Bug

**Live:** https://dusankozlica.github.io/klartext-agentur/ (Repo
github.com/dusankozlica/klartext-agentur, main = Code, gh-pages = Export).
Statischer Export: STATISCH=1 (basePath, trailingSlash, unoptimized),
force-static auf sitemap/robots, OG-Route + Server-Action-Formular werden
fürs Deploy temporär getauscht (Skriptteil im Verlauf), /fonts + Grain per
sed präfixiert, .nojekyll. placeholder() präfixt src/poster via
NEXT_PUBLIC_BASE_PATH.

**Der gemeldete „Menü geht nicht / alles langsam / kein Smooth Scroll"-Bug
war EIN CSS-Fehler:** `html.menue-offen .nav{opacity:0}` blendete die
ganze Leiste aus — das Overlay-Panel WOHNT aber in der Leiste und
verschwand mit. Gleichzeitig stoppte das kt:menue-Ereignis Lenis ⇒ nach
einem Menü-Klick war die Seite scrolltot und wirkte kaputt. Fix: nur
Wortmarke/Links/Knopf ausblenden, nicht .nav selbst. Live per Klick durchs
Panel auf /projekte/ verifiziert, lenis-stopped räumt sich wieder ab.

**Renderlast gesenkt** (Cursor-Nachlauf = niedrige FPS): Videos 1080p→720p
(504K/252K), Körnung statisch (kein animierter Vollbild-Layer mehr),
will-change auf .line__i raus. rAF-Falle bestätigt: FPS-Messungen in
verdeckten Chrome-Fenstern hängen — Screenshots ja, rAF-Promises nein.

## 05.08.2026 — ESE-Abgleich: Bewegungssystem
Dusans Rückmeldung: «nicht so premium und flüssig wie ESE». eseagency.ch
live vermessen (Stylesheets + DOM): Hovers dort 0.6s auf weichen
Expo-Kurven, Listen 1s Quint-Out, grosse Wege bis 1.5s Quart-Out, Cursor
mit Überschwingen (Bezier-Endwert 1.278), Dropdown mit Geschwister-Dimmen
und Vorschaubild. Übernommen:
- Vier neue Easing-Tokens (--ease-fluss/-quint/-quart/-pop), Tempi auf
  .3/.6/1.05s angehoben; Buttons, Nav, Karten, Zooms umgestellt.
- Cursor neu: 12px-Punkt mit mix-blend-difference, poppt auf 38px über
  Links, 96px-Creme-Blase mit Label über Medien; Follow-Lerp .16→.22.
- Nav: Doppeltext-Slide auf Direktlinks; NEU Leistungs-Dropdown nach dem
  ESE-Expertise-Muster (Glas-Panel, 01–05, Dimmen, Bild poppt rechts).
- Overlay-Menü: Panel .8s Quart rein / .45s raus, Zeilen gestaffelt,
  Geschwister dimmen.
- Leistungs-Zeilen: Dimmen der Nachbarzeilen ([data-zeilen]).
- Lenis lerp .085, wheelMultiplier 1; Headline-Reveals 1.2s power4.
Offen: Wirkung auf Dusans Rechner prüfen (Gefühl != Screenshot).

## 05.08.2026 (2) — Feel-Paket + Klartext-Filter
Nach Freigabe («fang an mit der umsetzung deiner definierten punkte»):
- Seitenwechsel: Ink-Überzug mit Wortmarke fängt interne Klicks ab
  (Capture-Listener, Menü ausgenommen), Route wechselt unterm Überzug.
- Magnetische Pillen (Magnete.tsx): quickTo-Anziehung, back.out-Feder.
  transform aus der .btn-Transition entfernt (Doppelglättung).
- Geschwindigkeits-Neigung: main kippt bis ±1.1° nach Lenis-velocity.
- Scroll-Momente: Hero-Zoom (scrub), Statement-Wortstrom (sohub),
  Vorhang-Reveal (clip-path) für die vier Arbeiten-Bänder.
- NEU Sektion «Der Klartext-Filter» (Home 5b): Floskel durchgestrichen
  (Violett-Strich skaliert ein), Übersetzung steigt aus Maske.
  Texte = Vorschläge, Freigabe durch Dusan offen.
- Korn: 0.04→0.06 nach Retina-Test auf Violett-Flächen.
Referenz-Forensik ergänzt: pixel.melbourne (Swoosh-Kurve .65,.05,0,1),
sirnik (Lenis+GSAP, JS-Tweens), sohub (Expo-Out .4s, 5000s-Drifts),
nexola (Framer-Springs, nicht auslesbar), ohhmydesign (Domain weg).

## 06.08.2026 — Referenzen thematisch auf Unterseiten
Alle 21 Referenz-Screenshots aus dem Sitzungsprotokoll extrahiert
(scratchpad/referenzen) und je Thema eingebaut:
- ref-05 ESE /expertise/branding + ref-14 sohub «Brand Identities»
  → /leistungen/branding: BrandingBuehne (Violett-Bühne, schwebende
  Karten mit EIGENEM Markensystem statt fremder Logos, Umriss-Wortband)
  + sohub-Block (Zweitton-Titel, Chip-Reihe, ✳-Absatz).
- ref-10/11 nexola-Tabelle (Web-Design-Zeile offen)
  → /leistungen/webdesign: NexolaTabelle ersetzt Ablauf-Raster;
  «Results»-Prozente bewusst weggelassen (keine erfundenen Zahlen).
- ref-09 ESE-Team → /team: «Die Leute» dunkel, grosse Farbporträts,
  Haarlinien-Infozeile; E-Mail/Telefon erst mit echten Daten.
- ref-12 ohhmydesign-Work-Karten → Case-Seiten: «Weitere Arbeiten»
  als runde Karten mit Punkt+Name und Leistungs-Chips.
Bereits vorher abgedeckt: ref-03/04 (Hero, Dropdown), 06-08
(Testimonials, News), 13 (Footer), 15/16 (sohub Work → Explorer/Home),
17 (Leistungs-Zeilen), 10 (nexola war v1 der Zeilen).

## 06.08.2026 (3) — Prozess-Sektion (bymonolog-Referenz)
bymonolog.com vermessen: GSAP+Lenis+Webflow; Prozess-Videos 601×338,
loop/muted/playsinline mit Lazy-Play (= unser MediaLoop), 10–18s;
Labels in «Suisse Mono» — bewusst NICHT übernommen (Dusans Mono-Verbot),
stattdessen Switzer-Versalien. Neue Home-Sektion 5c «So arbeiten wir»:
4 Schritte, Label am Rand, Titel+Text auf Mass, rechts randabfallende
10s-Loops (video/prozess-01..04, Freepik #2755226/#8958458/#3441794/
#2901462, 720p crf26). Texte = Vorschlag, Freigabe offen.
