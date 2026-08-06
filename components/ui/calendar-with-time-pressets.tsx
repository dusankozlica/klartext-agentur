"use client";

/**
 * Registry-Referenz «calendar-with-time-pressets» (shadcn Calendar20):
 * Kalender links, Zeitslot-Leiste rechts, Zusammenfassung im Fuss.
 *
 * Die produktive, eingedeutschte Fassung mit Gesprächsart, Kontaktfeldern
 * und ehrlichem Versand-Status ist components/sections/TerminKalender.tsx —
 * diese Datei bleibt als unverbaute Referenz nah am Original. Die im
 * Original enthaltenen «bookedDates» (durchgestrichene Beispieltage) sind
 * hier bewusst entfernt: erfundene Belegung gibt es bei uns nicht.
 */
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function Calendar20() {
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null)
  const timeSlots = Array.from({ length: 37 }, (_, i) => {
    const totalMinutes = i * 15
    const hour = Math.floor(totalMinutes / 60) + 9
    const minute = totalMinutes % 60
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
  })

  return (
    <Card className="gap-0 p-0">
      <CardContent className="relative p-0 md:pr-48">
        <div className="p-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            defaultMonth={date}
            showOutsideDays={false}
            className="bg-transparent p-0"
            formatters={{
              formatWeekdayName: (date) => {
                return date.toLocaleString("de-CH", { weekday: "short" })
              },
            }}
          />
        </div>
        <div className="no-scrollbar inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-48 md:border-t-0 md:border-l">
          <div className="grid gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                onClick={() => setSelectedTime(time)}
                className="w-full shadow-none"
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t px-6 !py-5 md:flex-row">
        <div className="text-sm">
          {date && selectedTime ? (
            <>
              Ihr Termin:{" "}
              <span className="font-medium">
                {date?.toLocaleDateString("de-CH", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>{" "}
              um <span className="font-medium">{selectedTime}</span>.
            </>
          ) : (
            <>Wählen Sie Datum und Uhrzeit.</>
          )}
        </div>
        <Button
          disabled={!date || !selectedTime}
          className="w-full md:ml-auto md:w-auto"
          variant="outline"
        >
          Weiter
        </Button>
      </CardFooter>
    </Card>
  )
}
