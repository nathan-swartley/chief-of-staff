# Chief of Staff

A personal Chief of Staff web application to help manage your work life.

## Features

### Current
- **Product Jam Calendar View**: View upcoming Product Jam meetings segmented by calendar week for the next 6 weeks

### Planned
- Slack integration
- Email summaries
- Task management
- More calendar views and filters

## Tech Stack

- **Next.js** - React framework with server-side rendering
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Google Calendar API** - Calendar integration
- **Slack API** - (Coming soon) Slack integration

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

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

## Project Structure

```
chief-of-staff/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── calendar/      # Calendar-related endpoints
│   ├── calendar/          # Calendar views
│   └── page.tsx           # Home page
├── components/            # React components
├── lib/                   # Utility functions and API clients
└── types/                 # TypeScript type definitions
```

## Development Roadmap

- [x] Initialize project
- [ ] Set up Google Calendar authentication
- [ ] Implement Product Jam weekly view
- [ ] Add filtering capabilities
- [ ] Integrate Slack API
- [ ] Add more Chief of Staff features
