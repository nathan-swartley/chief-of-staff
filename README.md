# Chief of Staff

A personal Chief of Staff web application to help manage your work life.

## Features

### Current
- **Product Jam Calendar View**: View upcoming Product Jam meetings segmented by calendar week for the next 6 weeks
- **Slack Integration**:
  - Manual posting to Slack from Product Jams page
  - Automatic scheduled posting every Monday at 9 AM UTC
  - Custom channel override support
  - Connection testing and status monitoring

### Planned
- Email summaries
- Task management
- More calendar views and filters
- Additional Slack features (slash commands, interactive messages)

## Tech Stack

- **Next.js** - React framework with server-side rendering
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Google Calendar API** - Calendar integration
- **Slack Incoming Webhooks** - Slack integration
- **Vercel Cron** - Scheduled tasks

## Getting Started

First, install dependencies:

```bash
npm install
```

Set up your environment variables by copying `.env.local.example` to `.env.local` and filling in your credentials.

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Google Calendar API
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Slack Integration (Optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
SLACK_DEFAULT_CHANNEL=#general

# Cron Jobs (Required for automatic Slack posting)
CRON_SECRET=your_random_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token
```

See [SLACK_INTEGRATION.md](./SLACK_INTEGRATION.md) for detailed setup instructions.

## Project Structure

```
chief-of-staff/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── calendar/      # Calendar-related endpoints
│   │   ├── cron/          # Scheduled job endpoints
│   │   └── slack/         # Slack integration endpoints
│   ├── calendar/          # Calendar views
│   ├── settings/          # Settings page
│   └── page.tsx           # Home page
├── components/            # React components
├── lib/                   # Utility functions and API clients
│   ├── google-calendar.ts # Google Calendar utilities
│   └── slack.ts           # Slack utilities
├── types/                 # TypeScript type definitions
└── vercel.json            # Vercel configuration (cron jobs)
```

## Development Roadmap

- [x] Initialize project
- [x] Set up Google Calendar authentication
- [x] Implement Product Jam weekly view
- [x] Integrate Slack API
  - [x] Manual posting to Slack
  - [x] Automatic scheduled posting
  - [x] Settings page with connection testing
  - [x] Custom channel override
- [ ] Add filtering capabilities
- [ ] Email summaries
- [ ] Task management
- [ ] Add more Chief of Staff features
