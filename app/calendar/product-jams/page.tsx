import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import WeeklyCalendarView from "@/components/weekly-calendar-view"
import { getCalendarEvents, groupEventsByWeek } from "@/lib/google-calendar"

export default async function ProductJamsPage() {
  const session = await auth()

  if (!session?.accessToken) {
    redirect("/auth/signin")
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

  // Convert Map to array for component
  const data = Array.from(eventsByWeek.entries()).map(([week, events]) => ({
    week,
    events,
  }))

  // Check if Slack webhook is configured
  const webhookConfigured = !!process.env.SLACK_WEBHOOK_URL

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Navigation */}
      <nav style={{
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--background)'
      }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </Link>
              <div className="h-6" style={{ borderLeft: '1px solid var(--border-subtle)' }}></div>
              <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Product Jams
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/settings"
                className="flex items-center gap-2 text-sm transition-colors hover:opacity-70"
                style={{ color: 'var(--text-secondary)' }}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </Link>
              <div className="h-6" style={{ borderLeft: '1px solid var(--border-subtle)' }}></div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {session.user?.name}
              </span>
              <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{
                background: 'var(--interactive-bg)',
                color: 'var(--interactive-text)'
              }}>
                <span className="text-sm font-semibold">
                  {session.user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <WeeklyCalendarView data={data} webhookConfigured={webhookConfigured} />
      </main>
    </div>
  )
}
