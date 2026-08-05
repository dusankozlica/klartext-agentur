/**
 * Leistungen — Repository-Modul.
 *
 * Alle Texte sind fertige Copy. Preisangaben fehlen bewusst als Zahl: Ein
 * erfundener Betrag wäre eine Zusage, die Dusan nicht gemacht hat. Statt
 * einer Zahl steht dort, wie der Preis zustande kommt — das beantwortet die
 * eigentliche Frage („werde ich über den Tisch gezogen?“) ehrlicher als ein
 * ausgedachtes „ab CHF X“.
 */

export type Service = {
  slug: string;
  name: string;
  claim: string;
  /** Kurzzeile für Navigation und Übersichten */
  kurz: string;
  fuerWen: string;
  /** Das Problem, das der Kunde selbst spürt — in seinen Worten */
  problem: string;
  leistungen: string[];
  ablauf: { titel: string; text: string }[];
  /** Wie der Preis zustande kommt, nicht wie hoch er ist */
  preisLogik: string;
  faq: { frage: string; antwort: string }[];
  bildSlot: string;
  /** Zusätzliche Platzhalter-Medien für die Detailseite */
  medienSlots: string[];
};

export const services: Service[] = [
  {
    slug: 'social-media',
    name: 'Social Media',
    claim: 'Regelmässig sichtbar, ohne dass es intern jemanden auffrisst.',
    kurz: 'Redaktion, Produktion und Betreuung aus einer Hand.',
    fuerWen:
      'KMU, die wissen, dass sie präsent sein müssten, aber niemanden haben, der es verlässlich macht.',
    problem:
      'Der Kanal wurde vor zwei Jahren angelegt. Dann kam das Tagesgeschäft. Jetzt steht dort ein Beitrag vom letzten Sommer, und das sieht schlimmer aus als gar kein Profil.',
    leistungen: [
      'Redaktionsplan pro Monat, abgestimmt auf Ihre Verkaufszyklen und Saisonspitzen',
      'Produktion von Bild und Video — ein Drehtag vor Ort deckt in der Regel mehrere Wochen ab',
      'Veröffentlichung und Community-Betreuung in vereinbarten Reaktionszeiten',
      'Monatliche Auswertung, die in einer Entscheidung endet und nicht in einer Zahlenkolonne',
    ],
    ablauf: [
      {
        titel: 'Bestandsaufnahme',
        text: 'Was läuft heute, was liegt brach, wer im Betrieb hat etwas zu erzählen. Meistens mehr, als die Geschäftsleitung denkt.',
      },
      {
        titel: 'Plan',
        text: 'Themen, Formate und Frequenz für die nächsten drei Monate. Nicht für die nächsten drei Beiträge.',
      },
      {
        titel: 'Produktion',
        text: 'Wir kommen zu Ihnen und drehen an einem Tag, was sonst über Wochen verteilt liegen bliebe.',
      },
      {
        titel: 'Betrieb',
        text: 'Veröffentlichen, auf Kommentare reagieren, monatlich nachschärfen. Sie geben frei, wir machen den Rest.',
      },
    ],
    preisLogik:
      'Der Preis richtet sich nach Frequenz und Produktionsaufwand — wie viele Beiträge pro Monat, wie viele Drehtage, welche Reaktionszeit. Sie bekommen nach dem Erstgespräch eine schriftliche Offerte mit einem festen Monatsbetrag. Keine Stundenabrechnung, keine Überraschungen.',
    faq: [
      {
        frage: 'Wie viel Aufwand bleibt bei uns?',
        antwort:
          'Freigaben und ein Drehtag pro Quartal. Für Freigaben rechnen Sie mit einer halben Stunde pro Monat — wir schicken den Plan gebündelt, nicht jeden Beitrag einzeln.',
      },
      {
        frage: 'Wir haben niemanden, der gerne vor die Kamera geht.',
        antwort:
          'Das ist der Normalfall, nicht die Ausnahme. Es funktioniert auch über die Arbeit selbst: Hände, Material, Maschinen, das fertige Ergebnis. Wer nicht will, muss nicht.',
      },
      {
        frage: 'Welche Kanäle empfehlen Sie?',
        antwort:
          'Die, auf denen Ihre Kunden sind — nicht die, die gerade besprochen werden. Für die meisten KMU sind das Instagram und LinkedIn. TikTok nur, wenn Sie jung rekrutieren wollen.',
      },
    ],
    bildSlot: 'services/social-media',
    medienSlots: ['projects/case-detail-wide', 'team/group'],
  },
  {
    slug: 'branding',
    name: 'Branding',
    claim: 'Ein Auftritt, der auch dann trägt, wenn niemand das Logo sieht.',
    kurz: 'Positionierung, Marke und alles, was daraus folgt.',
    fuerWen:
      'Unternehmen, die gewachsen sind und deren Auftritt dem Wachstum nicht gefolgt ist.',
    problem:
      'Fragen Sie drei Mitarbeitende unabhängig voneinander, wofür die Firma steht. Wenn drei verschiedene Antworten kommen, liegt die Arbeit nicht beim Logo.',
    leistungen: [
      'Positionierung: für wen Sie da sind, welches Problem Sie lösen, woran der Kunde merkt, dass es gelöst ist',
      'Wortmarke, Farbsystem, Typografie und Bildsprache — als System, nicht als Datei',
      'Anwendungen: Drucksachen, Fahrzeugbeschriftung, Beschilderung, Vorlagen für Ihr Team',
      'Brandboard als verbindliche Grundlage für alles, was danach kommt',
    ],
    ablauf: [
      {
        titel: 'Zuhören',
        text: 'Gespräche mit Ihnen, Ihrem Team und zwei bis drei Kunden. Die ehrlichsten Sätze kommen fast immer von den Kunden.',
      },
      {
        titel: 'Schärfen',
        text: 'Die Positionierung auf einen Satz eindampfen, der auch in der Beiz funktioniert.',
      },
      {
        titel: 'Gestalten',
        text: 'Zwei Richtungen zur Auswahl. Eine wird konsequent zu Ende gebaut — nicht beide halb.',
      },
      {
        titel: 'Übergeben',
        text: 'Brandboard, offene Dateien, Vorlagen. Bedienbar auch ohne uns.',
      },
    ],
    preisLogik:
      'Branding wird als Projekt zum Festpreis offeriert, aufgeteilt in Positionierung und Gestaltung. Sie können nach der Positionierung aussteigen, wenn Sie mit dem Ergebnis nicht weiterarbeiten wollen — dann zahlen Sie nur diesen Teil.',
    faq: [
      {
        frage: 'Müssen wir alles auf einmal ersetzen?',
        antwort:
          'Nein. Wir übergeben so, dass Sie in Etappen einführen können: zuerst Digitales, dann Drucksachen, Fahrzeuge und Beschilderung, wenn ohnehin ersetzt wird.',
      },
      {
        frage: 'Unser Logo ist eingeführt. Muss das weg?',
        antwort:
          'Meistens nicht. Oft trägt das Logo, und es fehlt alles drumherum — Farben, Schrift, Bildsprache, Tonfall. Wenn es tatsächlich weg muss, sagen wir Ihnen warum.',
      },
    ],
    bildSlot: 'services/branding',
    medienSlots: ['projects/case-detail-tall', 'projects/case-01-cover'],
  },
  {
    slug: 'webdesign',
    name: 'Webdesign',
    claim: 'Eine Seite, die Anfragen bringt — nicht eine, die gut aussieht.',
    kurz: 'Struktur, Texte und Umsetzung. Kein Baukasten.',
    fuerWen: 'KMU, deren Website älter ist als ihre aktuelle Positionierung.',
    problem:
      'Die Seite ist nicht hässlich. Sie sagt nur nicht, was Sie tun, für wen, und was der nächste Schritt wäre. Deshalb ruft niemand an.',
    leistungen: [
      'Struktur und Texte — die Arbeit, die vor dem Layout kommt und über die Wirkung entscheidet',
      'Umsetzung als eigenständige Seite, gebaut auf Ihre Marke statt auf eine Vorlage',
      'Ein messbares Ziel pro Seite: Anfrage, Termin, Download. Nicht fünf gleichzeitig',
      'Übergabe mit Einweisung — Sie pflegen selbst, was sich ändert',
    ],
    ablauf: [
      {
        titel: 'Ziel festlegen',
        text: 'Was soll die Seite auslösen. Eine Sache. Alles andere ordnet sich unter.',
      },
      {
        titel: 'Struktur und Text',
        text: 'Seitenaufbau und Texte stehen, bevor irgendetwas gestaltet wird. Wer umgekehrt vorgeht, gestaltet Blindtext.',
      },
      {
        titel: 'Gestaltung',
        text: 'Auf Basis Ihrer Marke. Wenn es noch keine gibt, klären wir das vorher — sonst wird die Seite zum Ersatz für eine Entscheidung, die nie gefallen ist.',
      },
      {
        titel: 'Aufschalten',
        text: 'Technik, Messung, Rechtstexte, Einweisung. Danach gehört die Seite Ihnen, samt Zugängen.',
      },
    ],
    preisLogik:
      'Websites werden zum Festpreis offeriert, gestaffelt nach Seitenumfang und Funktionsumfang. Was während des Projekts dazukommt, wird vorher als Nachtrag offeriert — nicht am Schluss auf die Rechnung gesetzt.',
    faq: [
      {
        frage: 'Können wir die Seite selbst pflegen?',
        antwort:
          'Ja. Was sich regelmässig ändert — Referenzen, Beiträge, Team — wird pflegbar gebaut. Der Rest bleibt bewusst fest, damit das Layout nicht mit der Zeit auseinanderfällt.',
      },
      {
        frage: 'Was ist mit Suchmaschinen?',
        antwort:
          'Technisch sauber ist die Grundlage, nicht das Ziel: Ladezeit, Struktur, Beschriftungen, verständliche Adressen. Sichtbarkeit entsteht danach über Inhalte, nicht über einen Schalter.',
      },
      {
        frage: 'Wir haben schon eine Seite. Kann man die retten?',
        antwort:
          'Manchmal ja. Wir sagen es Ihnen im Erstgespräch ehrlich — auch wenn die Antwort für uns das kleinere Projekt bedeutet.',
      },
    ],
    bildSlot: 'services/webdesign',
    medienSlots: ['projects/case-02-cover', 'projects/case-detail-wide'],
  },
  {
    slug: 'marketingpartner',
    name: 'Marketingpartner',
    claim: 'Ihre Marketingabteilung, ohne sie aufzubauen.',
    kurz: 'Feste Kapazität pro Monat, ein Ansprechpartner.',
    fuerWen:
      'Unternehmen, die laufend etwas brauchen, aber keine Stelle dafür schaffen wollen.',
    problem:
      'Marketing macht bei Ihnen die Person, die gerade Zeit hat. Das Ergebnis ist nicht schlecht — es ist nur nie fertig, weil immer etwas Dringenderes dazwischenkommt.',
    leistungen: [
      'Ein fester Ansprechpartner und eine feste Kapazität pro Monat',
      'Jahresplanung mit Quartalszielen, damit nicht jedes Vorhaben einzeln verhandelt wird',
      'Alle Leistungen aus einer Hand, ohne für jedes Vorhaben eine neue Offerte',
      'Monatlicher Rapport, der mit einer Empfehlung endet und nicht mit einer Zahlenreihe',
    ],
    ablauf: [
      {
        titel: 'Standortbestimmung',
        text: 'Was ist vorhanden, was fehlt, was ist dringend. Meist unterscheidet sich das von der ursprünglichen Anfrage.',
      },
      {
        titel: 'Jahresplan',
        text: 'Was wann passiert — und was bewusst nicht. Das Weglassen ist der schwierigere Teil.',
      },
      {
        titel: 'Betrieb',
        text: 'Feste Kapazität pro Monat, planbar abgerufen. Nicht verbrauchte Zeit verfällt nicht sofort.',
      },
      {
        titel: 'Nachsteuern',
        text: 'Jedes Quartal eine ehrliche Standortbestimmung, inklusive dem, was nicht funktioniert hat.',
      },
    ],
    preisLogik:
      'Ein fester Monatsbetrag für eine vereinbarte Kapazität. Laufzeit, Kündigungsfrist und der Umgang mit nicht genutzten Stunden stehen vollständig in der Offerte — bevor Sie unterschreiben, nicht im Kleingedruckten danach.',
    faq: [
      {
        frage: 'Was passiert mit Stunden, die wir nicht nutzen?',
        antwort:
          'Der Umgang damit wird in der Offerte geregelt und vorher besprochen. Uns ist lieber, Sie fragen einmal zu viel als dass Kapazität ungenutzt verfällt.',
      },
      {
        frage: 'Können wir kombinieren mit einem Projekt?',
        antwort:
          'Ja, das ist der Normalfall: Erst ein Projekt — Marke oder Website — danach die laufende Betreuung, damit das Aufgebaute nicht wieder einschläft.',
      },
    ],
    bildSlot: 'services/marketingpartner',
    medienSlots: ['team/group', 'projects/case-03-cover'],
  },
  {
    slug: 'ki-fuer-kmu',
    name: 'KI für KMU',
    claim: 'Ein Arbeitsschritt weniger. Nicht ein Werkzeug mehr.',
    kurz: 'Ein wiederkehrender Handgriff, automatisiert und eingeführt.',
    fuerWen:
      'Betriebe, in denen jede Woche dieselbe Handarbeit anfällt — Offerten, Rapporte, Anfragen, Ausschreibungen.',
    problem:
      'Sie haben von KI gehört, ein paar Leute im Betrieb probieren etwas aus, und niemand weiss, ob dabei Kundendaten irgendwohin abfliessen. Gleichzeitig tippt jemand jeden Freitag denselben Rapport ab.',
    leistungen: [
      'Ein Prozess wird ausgewählt, gemessen und automatisiert — nicht zehn gleichzeitig',
      'Umsetzung mit vorhandenen Werkzeugen; Eigenentwicklung nur, wenn es anders nicht geht',
      'Schulung der Leute, die damit arbeiten, inklusive Rückfallebene für den Ausfall',
      'Datenschutz vorab geklärt: welche Daten wohin gehen und wo sie verarbeitet werden',
    ],
    ablauf: [
      {
        titel: 'Prozess wählen',
        text: 'Der eine Schritt, der am meisten Zeit frisst und am wenigsten Kopf braucht.',
      },
      {
        titel: 'Messen',
        text: 'Wie lange dauert er heute wirklich. Ohne diese Zahl lässt sich hinterher nichts belegen.',
      },
      {
        titel: 'Umsetzen',
        text: 'Klein anfangen, im echten Betrieb testen, mit den Leuten, die es nachher benutzen.',
      },
      {
        titel: 'Einführen',
        text: 'Schulung, klare Zuständigkeit, und ein dokumentierter Weg zurück, falls es klemmt.',
      },
    ],
    preisLogik:
      'Der erste Prozess wird als abgegrenztes Projekt zum Festpreis offeriert. Vorher steht eine kurze Analyse, damit wir beide wissen, ob sich der Aufwand überhaupt lohnt — wenn nicht, sagen wir das.',
    faq: [
      {
        frage: 'Wo liegen unsere Daten?',
        antwort:
          'Das klären wir vor der Umsetzung und halten es schriftlich fest — abhängig davon, welcher Anbieter zum Einsatz kommt. Eine pauschale Zusage vor dieser Prüfung wäre unseriös.',
      },
      {
        frage: 'Ersetzt das Stellen?',
        antwort:
          'Bei den Betrieben, mit denen wir arbeiten, ersetzt es keine Stellen, sondern Überstunden. Wenn ein Vorhaben auf Stellenabbau hinausläuft, ist das eine Entscheidung, die Sie treffen — nicht wir.',
      },
      {
        frage: 'Was, wenn es nicht funktioniert?',
        antwort:
          'Deshalb messen wir vorher. Wenn die Zeitersparnis ausbleibt, schalten wir zurück auf den alten Weg — der bleibt dokumentiert und einsatzbereit.',
      },
    ],
    bildSlot: 'services/ki-fuer-kmu',
    medienSlots: ['projects/case-detail-tall', 'blog/cover-02'],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const serviceSlugs = () => services.map((s) => s.slug);
