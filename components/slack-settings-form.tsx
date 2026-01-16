"use client"

import { useState, useEffect } from "react"

interface SlackSettings {
  configured: boolean
  webhookUrl: string | null
  defaultChannel: string | null
}

export default function SlackSettingsForm() {
  const [settings, setSettings] = useState<SlackSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState("")
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/slack/settings")
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error("Error fetching settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTestConnection = async () => {
    if (!webhookUrl) {
      setTestResult({
        success: false,
        message: "Please enter a webhook URL",
      })
      return
    }

    setTesting(true)
    setTestResult(null)

    try {
      const response = await fetch("/api/slack/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ webhookUrl }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to test connection")
      }

      setTestResult({
        success: true,
        message: result.message,
      })

      // Refresh settings
      await fetchSettings()
    } catch (err) {
      setTestResult({
        success: false,
        message: err instanceof Error ? err.message : "Failed to test connection",
      })
    } finally {
      setTesting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg className="animate-spin h-8 w-8" fill="none" viewBox="0 0 24 24" style={{ color: 'var(--text-secondary)' }}>
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <div
        className="rounded-xl p-6"
        style={{
          background: 'var(--surface)',
          border: '2px solid var(--border)',
        }}
      >
        <h3 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Current Configuration
        </h3>
        <div className="space-y-3">
          <div>
            <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Status:{" "}
            </span>
            <span
              className="text-sm font-bold"
              style={{
                color: settings?.configured ? 'var(--accent-green)' : 'var(--accent-red)',
              }}
            >
              {settings?.configured ? "Configured" : "Not Configured"}
            </span>
          </div>
          {settings?.configured && (
            <>
              <div>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Webhook URL:{" "}
                </span>
                <code className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  {settings.webhookUrl}
                </code>
              </div>
              <div>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Default Channel:{" "}
                </span>
                <code className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  {settings.defaultChannel || "Not set"}
                </code>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Setup Instructions */}
      <div
        className="rounded-xl p-6"
        style={{
          background: 'var(--surface)',
          border: '2px solid var(--border)',
        }}
      >
        <h3 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Setup Instructions
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              1. Create a Slack Incoming Webhook
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>Go to <a href="https://api.slack.com/apps" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--interactive-text)' }}>api.slack.com/apps</a></li>
              <li>Create a new app or select an existing one</li>
              <li>Go to "Incoming Webhooks" and activate them</li>
              <li>Click "Add New Webhook to Workspace"</li>
              <li>Select the channel where you want to post</li>
              <li>Copy the webhook URL</li>
            </ol>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              2. Test Your Webhook
            </h4>
            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
              Paste your webhook URL below to test the connection:
            </p>
            <div className="space-y-3">
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://hooks.slack.com/services/..."
                className="w-full px-4 py-2 text-sm rounded-lg border transition-colors"
                style={{
                  background: 'var(--background)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                onClick={handleTestConnection}
                disabled={testing || !webhookUrl}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'var(--interactive-bg)',
                  color: 'var(--interactive-text)',
                }}
              >
                {testing ? "Testing..." : "Test Connection"}
              </button>
            </div>
            {testResult && (
              <div
                className="mt-3 p-3 rounded-lg text-sm"
                style={{
                  background: testResult.success ? 'var(--accent-green)' : 'var(--accent-red)',
                  color: 'var(--background)',
                }}
              >
                {testResult.message}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              3. Update Environment Variables
            </h4>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              Add these variables to your <code>.env.local</code> file:
            </p>
            <pre
              className="p-3 rounded-lg text-xs overflow-x-auto"
              style={{
                background: 'var(--background)',
                color: 'var(--text-primary)',
              }}
            >
{`SLACK_WEBHOOK_URL=your_webhook_url_here
SLACK_DEFAULT_CHANNEL=#general`}
            </pre>
            <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
              Note: You'll need to restart your development server after updating environment variables.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
