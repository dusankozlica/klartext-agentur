/**
 * FAQ — Repository-Modul.
 *
 * Die Antworten sind so geschrieben, wie sie am Telefon gegeben würden.
 * Wo eine verbindliche Zahl oder Frist stehen müsste, beschreibt die
 * Antwort den Mechanismus statt einen Betrag zu erfinden — eine ausgedachte
 * Kündigungsfrist wäre eine Zusage, die niemand gemacht hat.
 */

export type FaqEintrag = { frage: string; antwort: string };

export const faq: FaqEintrag[] = [
  {
    frage: 'Wie läuft die Zusammenarbeit ab?',
    antwort:
      'Erstgespräch, danach eine schriftliche Einschätzung mit Vorschlag und Preisrahmen. Erst wenn beides passt, fangen wir an. Das Erstgespräch kostet nichts und dauert etwa 30 Minuten.',
  },
  {
    frage: 'Was kostet das?',
    antwort:
      'Projekte werden zum Festpreis offeriert, laufende Betreuung als fester Monatsbetrag für eine vereinbarte Kapazität. Sie bekommen den Betrag schriftlich vor dem Start — nicht als Stundenabrechnung im Nachhinein. Einen Richtwert nennen wir Ihnen bereits im Erstgespräch, sobald wir den Umfang kennen.',
  },
  {
    frage: 'Wie lange dauert ein Projekt?',
    antwort:
      'Eine Website mit Struktur und Texten liegt üblicherweise im Bereich von mehreren Monaten, ein Markenprojekt ähnlich. Der grösste Teil davon ist nicht Produktion, sondern Abstimmung — deshalb hängt die Dauer stark davon ab, wie schnell bei Ihnen freigegeben wird. Einen verbindlichen Terminplan bekommen Sie mit der Offerte.',
  },
  {
    frage: 'Wie viel Aufwand entsteht bei uns intern?',
    antwort:
      'Sie brauchen eine Person, die entscheiden darf, und die Bereitschaft, uns einmal richtig zuzuhören — meist ein halber Tag zu Beginn. Danach geht es um Freigaben, die wir gebündelt schicken statt einzeln.',
  },
  {
    frage: 'Kann man die laufende Betreuung kündigen?',
    antwort:
      'Ja. Laufzeit und Kündigungsfrist stehen vollständig in der Offerte, bevor Sie unterschreiben. Wir arbeiten nicht mit automatischen Verlängerungen, die man übersehen kann.',
  },
  {
    frage: 'Arbeiten Sie auch ausserhalb der Region?',
    antwort:
      'Ja, schweizweit. Für Drehtage, Workshops und den ersten Termin sind wir vor Ort — alles andere läuft ortsunabhängig.',
  },
  {
    frage: 'Gehört uns am Ende alles?',
    antwort:
      'Ja. Dateien, Zugänge und die Rechte an den für Sie erstellten Inhalten liegen bei Ihnen. Wo Fremdlizenzen im Spiel sind — Schriften, Stockmaterial, Musik — steht das in der Offerte, inklusive dessen, was die Lizenz erlaubt.',
  },
  {
    frage: 'Was, wenn uns der Entwurf nicht gefällt?',
    antwort:
      'Dann haben wir vorher zu wenig gefragt. In der Offerte sind Korrekturrunden eingerechnet. Wenn eine Richtung grundsätzlich danebenliegt, reden wir darüber, statt sie schönzureden.',
  },
];
