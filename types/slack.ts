export interface SlackMessage {
  text: string
  channel?: string
  username?: string
  icon_emoji?: string
}

export interface SlackWebhookResponse {
  ok: boolean
  error?: string
}

export interface ProductJamData {
  week: string
  events: Array<{
    id: string
    summary: string
    start: {
      dateTime?: string
      date?: string
    }
  }>
}

export interface SlackPostResult {
  success: boolean
  error?: string
  message?: string
}
