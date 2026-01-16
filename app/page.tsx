import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function Home() {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Chief of Staff
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

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
          <p className="mt-1 text-sm text-gray-600">
            Your personal Chief of Staff is ready to help
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/calendar/product-jams"
            className="block rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              Product Jams
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              View your Product Jam meetings for the next 6 weeks
            </p>
          </Link>

          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 opacity-50">
            <h3 className="text-lg font-semibold text-gray-900">
              Slack Integration
            </h3>
            <p className="mt-2 text-sm text-gray-600">Coming soon</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 opacity-50">
            <h3 className="text-lg font-semibold text-gray-900">
              Task Management
            </h3>
            <p className="mt-2 text-sm text-gray-600">Coming soon</p>
          </div>
        </div>
      </main>
    </div>
  )
}
