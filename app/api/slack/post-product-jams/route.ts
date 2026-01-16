import { auth } from "@/auth"
import { getCalendarEvents, groupEventsByWeek } from "@/lib/google-calendar"
import { formatProductJamsForSlack, postToSlack } from "@/lib/slack"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if webhook URL is configured
    const webhookUrl = process.env.SLACK_WEBHOOK_URL
    if (!webhookUrl) {
      return NextResponse.json(
        { error: "Slack webhook URL not configured" },
        { status: 500 }
      )
    }

    // Parse request body for optional channel override
    const body = await request.json().catch(() => ({}))
    const channel = body.channel || process.env.SLACK_DEFAULT_CHANNEL

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

    // Convert Map to array for formatting
    const data = Array.from(eventsByWeek.entries()).map(([week, events]) => ({
      week,
      events,
    }))

    // Format message for Slack
    const message = formatProductJamsForSlack(data)

    // Post to Slack
    const result = await postToSlack(webhookUrl, message, channel)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    })
  } catch (error) {
    console.error("Error posting to Slack:", error)
    return NextResponse.json(
      { error: "Failed to post to Slack" },
      { status: 500 }
    )
  }
}
