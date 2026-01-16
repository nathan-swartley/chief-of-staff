import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function Home() {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Navigation */}
      <nav style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--background)'
      }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold" style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Chief of Staff
            </h1>
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
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Welcome back
          </h2>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Your personal Chief of Staff is ready to help
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/calendar/product-jams"
            className="group block rounded-xl p-6 transition-all hover:scale-[1.02]"
            style={{
              background: 'var(--surface)',
              border: '2px solid var(--border)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--interactive-bg)'
              e.currentTarget.style.background = 'var(--surface-elevated)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.background = 'var(--surface)'
            }}
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg" style={{
              background: 'var(--interactive-bg)',
              color: 'var(--accent-purple)'
            }}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Product Jams
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              View your Product Jam meetings for the next 6 weeks
            </p>
            <div className="flex items-center text-sm font-medium" style={{ color: 'var(--accent-purple)' }}>
              Open
              <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <div className="rounded-xl p-6 opacity-40" style={{
            background: 'var(--surface)',
            border: '2px solid var(--border)'
          }}>
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg" style={{
              background: 'var(--surface-elevated)',
              color: 'var(--accent-blue)'
            }}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Slack Integration
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Coming soon
            </p>
          </div>

          <div className="rounded-xl p-6 opacity-40" style={{
            background: 'var(--surface)',
            border: '2px solid var(--border)'
          }}>
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg" style={{
              background: 'var(--surface-elevated)',
              color: 'var(--accent-green)'
            }}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Task Management
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Coming soon
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
