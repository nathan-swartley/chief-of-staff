"use client"

import { CalendarEvent } from "@/lib/google-calendar"

interface WeeklyCalendarViewProps {
  data: Array<{
    week: string
    events: CalendarEvent[]
  }>
}

export default function WeeklyCalendarView({ data }: WeeklyCalendarViewProps) {
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

  return (
    <div className="space-y-6">
      {data.map(({ week, events }) => (
        <div
          key={week}
          className="rounded-xl p-6"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            {week}
          </h3>
          {events.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              No Product Jams this week
            </p>
          ) : (
            <div className="space-y-2">
              {events.map((event) => (
                <a
                  key={event.id}
                  href={event.htmlLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-lg p-4 transition-all hover:scale-[1.01]"
                  style={{
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium mb-1 truncate" style={{ color: 'var(--text-primary)' }}>
                        {event.summary}
                      </h4>
                      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formatEventTime(event)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 mt-1 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                          <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                    </div>
                    <svg
                      className="h-5 w-5 flex-shrink-0 opacity-50 transition-all group-hover:opacity-100 group-hover:translate-x-0.5"
                      style={{ color: 'var(--text-tertiary)' }}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
