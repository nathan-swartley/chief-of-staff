import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import WeeklyCalendarView from "@/components/weekly-calendar-view"

async function getProductJams() {
  const response = await fetch("http://localhost:3000/api/calendar/product-jams", {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch Product Jams")
  }

  return response.json()
}

export default async function ProductJamsPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }

  const data = await getProductJams()

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
