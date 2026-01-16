import { google } from "googleapis"

export interface CalendarEvent {
  id: string
  summary: string
  start: {
    dateTime?: string
    date?: string
  }
  end: {
    dateTime?: string
    date?: string
  }
  location?: string
  htmlLink: string
}

export async function getCalendarEvents(
  accessToken: string,
  calendarId: string = "primary",
  searchQuery?: string,
  timeMin?: string,
  timeMax?: string
): Promise<CalendarEvent[]> {
  const oauth2Client = new google.auth.OAuth2()
  oauth2Client.setCredentials({ access_token: accessToken })

  const calendar = google.calendar({ version: "v3", auth: oauth2Client })

  const response = await calendar.events.list({
    calendarId,
    timeMin,
    timeMax,
    q: searchQuery,
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 100,
  })

  return (response.data.items || []) as CalendarEvent[]
}

export function getWeekBoundaries(weeksFromNow: number = 0): {
  start: Date
  end: Date
} {
  const now = new Date()
  const currentDay = now.getDay()
  const daysUntilSunday = currentDay === 0 ? 0 : -currentDay

  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() + daysUntilSunday + (weeksFromNow * 7))
  weekStart.setHours(0, 0, 0, 0)

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  weekEnd.setHours(23, 59, 59, 999)

  return { start: weekStart, end: weekEnd }
}

export function groupEventsByWeek(
  events: CalendarEvent[],
  numberOfWeeks: number = 6
): Map<string, CalendarEvent[]> {
  const weekMap = new Map<string, CalendarEvent[]>()

  for (let i = 0; i < numberOfWeeks; i++) {
    const { start, end } = getWeekBoundaries(i)
    const weekLabel = `Week of ${start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}-${end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })}`

    const weekEvents = events.filter((event) => {
      const eventDate = new Date(event.start.dateTime || event.start.date || "")
      return eventDate >= start && eventDate <= end
    })

    weekMap.set(weekLabel, weekEvents)
  }

  return weekMap
}
