"use client"

import { useState } from "react"

interface SlackPostButtonProps {
  data: Array<{
    week: string
    events: Array<{
      id: string
      summary: string
      start: {
        dateTime?: string
        date?: string
      }
    }>
  }>
  webhookConfigured: boolean
}

export default function SlackPostButton({ data, webhookConfigured }: SlackPostButtonProps) {
  const [posting, setPosting] = useState(false)
  const [posted, setPosted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showChannelInput, setShowChannelInput] = useState(false)
  const [customChannel, setCustomChannel] = useState("")
  const [lastPostTime, setLastPostTime] = useState<number>(0)

  if (!webhookConfigured) {
    return null
  }

  const handlePost = async () => {
    // Rate limiting: 5-second cooldown
    const now = Date.now()
    if (now - lastPostTime < 5000) {
      setError("Please wait a few seconds before posting again")
      setTimeout(() => setError(null), 3000)
      return
    }

    setPosting(true)
    setError(null)

    try {
      const response = await fetch("/api/slack/post-product-jams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel: customChannel || undefined,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to post to Slack")
      }

      setPosted(true)
      setLastPostTime(now)
      setShowChannelInput(false)
      setCustomChannel("")
      setTimeout(() => setPosted(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post to Slack")
      setTimeout(() => setError(null), 5000)
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {showChannelInput && (
        <input
          type="text"
          value={customChannel}
          onChange={(e) => setCustomChannel(e.target.value)}
          placeholder="#channel or @user"
          className="px-3 py-2 text-sm rounded-lg border transition-colors"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
          }}
        />
      )}

      <button
        onClick={() => setShowChannelInput(!showChannelInput)}
        className="p-2 rounded-lg text-xs transition-colors"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border)',
        }}
        title="Override channel"
        disabled={posting}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      <button
        onClick={handlePost}
        disabled={posting}
        className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: posted ? 'var(--accent-green)' : error ? 'var(--accent-red)' : 'var(--interactive-bg)',
          color: posted || error ? 'var(--background)' : 'var(--interactive-text)',
        }}
        title={posted ? "Posted to Slack!" : error ? error : "Post to Slack"}
      >
        {posting ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm">Posting...</span>
          </>
        ) : posted ? (
          <>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm">Posted!</span>
          </>
        ) : error ? (
          <>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-sm">Error</span>
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm">Post to Slack</span>
          </>
        )}
      </button>

      {error && !posting && (
        <span className="text-xs" style={{ color: 'var(--accent-red)' }}>
          {error}
        </span>
      )}
    </div>
  )
}
