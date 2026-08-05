'use client';

import { useState } from 'react';

/**
 * Terminbuchung über Cal.com.
 *
 * Der iframe wird erst nach einem Klick geladen. Zwei Gründe: er zieht sonst
 * bei jedem Seitenaufruf fremde Skripte und Cookies nach (revDSG/DSGVO), und
 * er kostet Ladezeit für etwas, das die meisten Besucher gar nicht öffnen.
 */
export default function CalEmbed() {
  const [geladen, setGeladen] = useState(false);
  const link = process.env.NEXT_PUBLIC_CAL_LINK;

  // Ohne konfigurierten Kalender wird kein leerer Kasten gezeigt, sondern
  // der Weg genannt, der tatsächlich funktioniert. Ein „hier kommt später
  // etwas“ ist für den Besucher wertlos.
  if (!link) {
    return (
      <p className="body-measure opacity-80">
        Die Online-Terminbuchung richten wir gerade ein. Bis dahin genügt eine
        kurze Nachricht über das Formular — wir schlagen Ihnen zwei Termine vor.
      </p>
    );
  }

  if (!geladen) {
    return (
      <div className="border border-current p-[var(--s-6)]">
        <p className="body-measure">
          Termin direkt im Kalender wählen. Beim Öffnen wird Cal.com geladen und
          setzt eigene Cookies.
        </p>
        <button type="button" className="btn btn--primary mt-[var(--s-5)]" onClick={() => setGeladen(true)}>
          Kalender öffnen
        </button>
      </div>
    );
  }

  return (
    <iframe
      src={`https://cal.com/${link}`}
      title="Terminbuchung"
      className="h-[640px] w-full border border-current"
      loading="lazy"
    />
  );
}
