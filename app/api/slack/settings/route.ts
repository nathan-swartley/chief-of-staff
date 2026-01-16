import { auth } from "@/auth"
import { maskWebhookUrl, testSlackConnection, validateWebhookUrl } from "@/lib/slack"
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

    const webhookUrl = process.env.SLACK_WEBHOOK_URL
    const defaultChannel = process.env.SLACK_DEFAULT_CHANNEL

    return NextResponse.json({
      configured: !!webhookUrl,
      webhookUrl: webhookUrl ? maskWebhookUrl(webhookUrl) : null,
      defaultChannel: defaultChannel || null,
    })
  } catch (error) {
    console.error("Error fetching Slack settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { webhookUrl } = body

    if (!webhookUrl) {
      return NextResponse.json(
        { error: "Webhook URL is required" },
        { status: 400 }
      )
    }

    // Validate webhook URL format
    if (!validateWebhookUrl(webhookUrl)) {
      return NextResponse.json(
        { error: "Invalid Slack webhook URL format. Must be https://hooks.slack.com/services/..." },
        { status: 400 }
      )
    }

    // Test the webhook connection
    const result = await testSlackConnection(webhookUrl)

    if (!result.success) {
      return NextResponse.json(
        { error: `Connection test failed: ${result.error}` },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Connection test successful! Update your .env.local file with this webhook URL.",
    })
  } catch (error) {
    console.error("Error testing Slack connection:", error)
    return NextResponse.json(
      { error: "Failed to test connection" },
      { status: 500 }
    )
  }
}
