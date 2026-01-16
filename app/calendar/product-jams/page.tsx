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
            <div className="flex items-center gap-3">
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
        <WeeklyCalendarView data={data} />
      </main>
    </div>
  )
}
