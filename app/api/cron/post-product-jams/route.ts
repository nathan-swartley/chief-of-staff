import { getCalendarEvents, groupEventsByWeek } from "@/lib/google-calendar"
import { formatProductJamsForSlack, postToSlack } from "@/lib/slack"
import { NextResponse } from "next/server"
import { google } from "googleapis"

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret) {
      console.error("CRON_SECRET not configured")
      return NextResponse.json(
        { error: "Cron secret not configured" },
        { status: 500 }
      )
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      console.error("Unauthorized cron request")
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if webhook URL is configured
    const webhookUrl = process.env.SLACK_WEBHOOK_URL
    if (!webhookUrl) {
      console.error("SLACK_WEBHOOK_URL not configured")
      return NextResponse.json(
        { error: "Slack webhook URL not configured" },
        { status: 500 }
      )
    }

    // Get refresh token
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN
    if (!refreshToken) {
      console.error("GOOGLE_REFRESH_TOKEN not configured")
      return NextResponse.json(
        { error: "Google refresh token not configured" },
        { status: 500 }
      )
    }

    // Get access token using refresh token
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    )

    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    })

    const { credentials } = await oauth2Client.refreshAccessToken()
    const accessToken = credentials.access_token

    if (!accessToken) {
      console.error("Failed to get access token")
      return NextResponse.json(
        { error: "Failed to get access token" },
        { status: 500 }
      )
    }

    // Get events for the next 6 weeks
    const now = new Date()
    const sixWeeksFromNow = new Date()
    sixWeeksFromNow.setDate(now.getDate() + 42)

    const events = await getCalendarEvents(
      accessToken,
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

    // Get default channel
    const channel = process.env.SLACK_DEFAULT_CHANNEL

    // Post to Slack
    const result = await postToSlack(webhookUrl, message, channel)

    if (!result.success) {
      console.error("Failed to post to Slack:", result.error)
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    console.log("Successfully posted Product Jams to Slack")
    return NextResponse.json({
      success: true,
      message: "Successfully posted Product Jams to Slack",
      eventsCount: filteredEvents.length,
    })
  } catch (error) {
    console.error("Error in cron job:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to run cron job" },
      { status: 500 }
    )
  }
}
