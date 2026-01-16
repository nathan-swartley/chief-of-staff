import { CalendarEvent } from "./google-calendar"
import { SlackMessage, SlackWebhookResponse, ProductJamData, SlackPostResult } from "@/types/slack"

/**
 * Format event time for Slack message
 */
export function formatEventTime(event: CalendarEvent): string {
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

/**
 * Format Product Jams data into a Slack message
 */
export function formatProductJamsForSlack(
  data: Array<{ week: string; events: CalendarEvent[] }>
): string {
  const header = ":calendar: *Product Jams - Next 6 Weeks*\n\n"

  const body = data
    .map(({ week, events }) => {
      if (events.length === 0) return null

      const weekHeader = `*${week}*`
      const eventLines = events
        .map((event) => `• ${event.summary} - ${formatEventTime(event)}`)
        .join("\n")

      return `${weekHeader}\n${eventLines}`
    })
    .filter(Boolean)
    .join("\n\n")

  const footer = "\n\n---\n_Posted by Chief of Staff_"

  return header + body + footer
}

/**
 * Validate Slack webhook URL format
 */
export function validateWebhookUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return (
      parsed.protocol === "https:" &&
      parsed.hostname === "hooks.slack.com" &&
      parsed.pathname.startsWith("/services/")
    )
  } catch {
    return false
  }
}

/**
 * Mask webhook URL for display
 */
export function maskWebhookUrl(url: string): string {
  try {
    const parsed = new URL(url)
    const pathParts = parsed.pathname.split("/")
    if (pathParts.length >= 4) {
      return `https://hooks.slack.com/services/T****/B****/****`
    }
  } catch {
    // Invalid URL
  }
  return "Invalid URL"
}

/**
 * Post message to Slack webhook
 */
export async function postToSlack(
  webhookUrl: string,
  message: string,
  channel?: string
): Promise<SlackPostResult> {
  if (!validateWebhookUrl(webhookUrl)) {
    return {
      success: false,
      error: "Invalid webhook URL format",
    }
  }

  // Check message length (Slack limit is 40,000 characters)
  if (message.length > 40000) {
    return {
      success: false,
      error: "Message exceeds Slack's 40,000 character limit",
    }
  }

  const payload: SlackMessage = {
    text: message,
  }

  if (channel) {
    payload.channel = channel
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: `Slack API error: ${response.status} - ${errorText}`,
      }
    }

    return {
      success: true,
      message: "Successfully posted to Slack",
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Test Slack webhook connection
 */
export async function testSlackConnection(
  webhookUrl: string
): Promise<SlackPostResult> {
  const testMessage = ":white_check_mark: *Test Connection Successful*\n\nYour Chief of Staff app is connected to Slack!"
  return postToSlack(webhookUrl, testMessage)
}
