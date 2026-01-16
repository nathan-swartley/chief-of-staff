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
  const [copied, setCopied] = useState(false)

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

  const copyAllToClipboard = async () => {
    const text = data
      .map(({ week, events }) => {
        if (events.length === 0) return null
        const weekHeader = `${week}`
        const eventLines = events
          .map((event) => `• ${event.summary} - ${formatEventTime(event)}`)
          .join("\n")
        return `${weekHeader}\n${eventLines}`
      })
      .filter(Boolean)
      .join("\n\n")

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div
      className="rounded-xl p-6"
      style={{
        background: 'var(--surface)',
        border: '2px solid var(--border)'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
          Product Jams in the next 6 weeks
        </h3>
        <button
          onClick={copyAllToClipboard}
          className="p-2 rounded-lg transition-all hover:scale-105"
          style={{
            background: copied ? 'var(--accent-purple)' : 'var(--interactive-bg)',
            color: copied ? 'var(--background)' : 'var(--interactive-text)'
          }}
          title={copied ? "Copied!" : "Copy all to clipboard"}
        >
          {copied ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>

      <div className="space-y-3">
        {data.map(({ week, events }) => (
          <div key={week}>
            <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              {week}
            </h4>
            {events.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                No Product Jams this week
              </p>
            ) : (
              <div className="space-y-0.5">
                {events.map((event) => (
                  <div key={event.id} className="flex items-start gap-2">
                    <span style={{ color: 'var(--text-primary)' }}>•</span>
                    <a
                      href={event.htmlLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline"
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
    </div>
  )
}
