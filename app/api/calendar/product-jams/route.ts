import { auth } from "@/auth"
import { getCalendarEvents, groupEventsByWeek } from "@/lib/google-calendar"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get events for the next 6 weeks
    const now = new Date()
    const sixWeeksFromNow = new Date()
    sixWeeksFromNow.setDate(now.getDate() + 42)

    const events = await getCalendarEvents(
      session.accessToken,
      "primary",
      "Product Jam",
      now.toISOString(),
      sixWeeksFromNow.toISOString()
    )

    // Filter out Enrollment events
    const filteredEvents = events.filter(
      (event) => !event.summary.includes("Enrollment")
    )

    // Group by week
    const eventsByWeek = groupEventsByWeek(filteredEvents, 6)

    // Convert Map to object for JSON serialization
    const result = Array.from(eventsByWeek.entries()).map(([week, events]) => ({
      week,
      events,
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching calendar events:", error)
    return NextResponse.json(
      { error: "Failed to fetch calendar events" },
      { status: 500 }
    )
  }
}
