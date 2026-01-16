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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                ← Back
              </Link>
              <h1 className="text-xl font-bold text-gray-900">
                Product Jams
              </h1>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700">
                {session.user?.name}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Next 6 Weeks
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Your upcoming Product Jam meetings (excluding Enrollment)
          </p>
        </div>

        <WeeklyCalendarView data={data} />
      </main>
    </div>
  )
}
