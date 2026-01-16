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
    <div className="space-y-8">
      {data.map(({ week, events }) => (
        <div key={week} className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{week}</h3>
          {events.length === 0 ? (
            <p className="text-sm text-gray-500">No Product Jams this week</p>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <a
                  key={event.id}
                  href={event.htmlLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{event.summary}</h4>
                      <p className="mt-1 text-sm text-gray-600">
                        {formatEventTime(event)}
                      </p>
                      {event.location && (
                        <p className="mt-1 text-sm text-gray-500">
                          📍 {event.location}
                        </p>
                      )}
                    </div>
                    <svg
                      className="h-5 w-5 text-gray-400"
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
