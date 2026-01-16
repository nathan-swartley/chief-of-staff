"use client"

import { CalendarEvent } from "@/lib/google-calendar"
import { useState } from "react"

interface WeeklyCalendarViewProps {
  data: Array<{
    week: string
    events: CalendarEvent[]
  }>
}

export default function WeeklyCalendarView({ data }: WeeklyCalendarViewProps) {
  const [copiedWeek, setCopiedWeek] = useState<string | null>(null)

  const formatEventTime = (event: CalendarEvent) => {
    if (event.start.dateTime) {
      const date = new Date(event.start.dateTime)
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        weekday: "short",
      })
    }
    return event.start.date || ""
  }

  const copyWeekToClipboard = async (week: string, events: CalendarEvent[]) => {
    const text = events
      .map((event) => `• ${event.summary} - ${formatEventTime(event)}`)
      .join("\n")

    try {
      await navigator.clipboard.writeText(text)
      setCopiedWeek(week)
      setTimeout(() => setCopiedWeek(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="space-y-6">
      {data.map(({ week, events }) => (
        <div
          key={week}
          className="rounded-xl p-6"
          style={{
            background: 'var(--surface)',
            border: '2px solid var(--border)'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              {week}
            </h3>
            {events.length > 0 && (
              <button
                onClick={() => copyWeekToClipboard(week, events)}
                className="p-2 rounded-lg transition-all hover:scale-105"
                style={{
                  background: copiedWeek === week ? 'var(--accent-purple)' : 'var(--interactive-bg)',
                  color: copiedWeek === week ? 'var(--background)' : 'var(--interactive-text)'
                }}
                title={copiedWeek === week ? "Copied!" : "Copy to clipboard"}
              >
                {copiedWeek === week ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            )}
          </div>
          {events.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              No Product Jams this week
            </p>
          ) : (
            <div className="space-y-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between gap-3 py-1.5"
                >
                  <a
                    href={event.htmlLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-sm hover:underline"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {event.summary} - {formatEventTime(event)}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
