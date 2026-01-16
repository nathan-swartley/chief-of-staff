# Slack Integration Guide

This guide will help you set up the Slack integration for Chief of Staff.

## Overview

The Slack integration allows you to:
- Manually post Product Jams to Slack from the Product Jams page
- Automatically post Product Jams every Monday at 9 AM UTC via scheduled cron job
- Configure custom channels for posting
- Test your Slack connection

## Prerequisites

- A Slack workspace where you have permission to add apps
- Your Chief of Staff app deployed on Vercel (for cron jobs)

## Setup Instructions

### Step 1: Create a Slack Incoming Webhook

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click "Create New App"
3. Choose "From scratch"
4. Enter an app name (e.g., "Chief of Staff") and select your workspace
5. Click "Create App"
6. In the left sidebar, click "Incoming Webhooks"
7. Toggle "Activate Incoming Webhooks" to **On**
8. Scroll down and click "Add New Webhook to Workspace"
9. Select the channel where you want posts to appear (e.g., #general)
10. Click "Allow"
11. Copy the webhook URL (it should look like: `https://hooks.slack.com/services/T.../B.../...`)

### Step 2: Configure Environment Variables

Add these variables to your `.env.local` file:

```bash
# Slack Integration
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
SLACK_DEFAULT_CHANNEL=#general

# Cron Jobs (required for automatic posting)
CRON_SECRET=your_random_secret_here

# Google Refresh Token (required for automatic posting)
GOOGLE_REFRESH_TOKEN=your_refresh_token_here
```

**Important:**
- Replace `SLACK_WEBHOOK_URL` with your actual webhook URL
- Change `SLACK_DEFAULT_CHANNEL` to your preferred channel
- Generate a random string for `CRON_SECRET` (you can use: `openssl rand -base64 32`)
- See below for how to get your `GOOGLE_REFRESH_TOKEN`

### Step 3: Get Google Refresh Token

The cron job needs a refresh token to access your Google Calendar without an active session.

**Option 1: Extract from NextAuth Session (Easiest)**

1. Sign in to your Chief of Staff app
2. Open browser developer tools (F12)
3. Go to the Network tab
4. Refresh the page
5. Look for the `session` request
6. In the response, find the `refreshToken` field
7. Copy this value to `GOOGLE_REFRESH_TOKEN` in your `.env.local`

**Option 2: Use Google OAuth Playground**

1. Go to [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Click the gear icon (Settings)
3. Check "Use your own OAuth credentials"
4. Enter your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
5. In the left panel, select "Calendar API v3"
6. Check `https://www.googleapis.com/auth/calendar.readonly`
7. Click "Authorize APIs"
8. Sign in and grant permissions
9. Click "Exchange authorization code for tokens"
10. Copy the `refresh_token` value
11. Add it to your `.env.local` as `GOOGLE_REFRESH_TOKEN`

### Step 4: Test the Connection

1. Restart your development server: `npm run dev`
2. Navigate to Settings in your app
3. Paste your webhook URL in the test field
4. Click "Test Connection"
5. Check your Slack channel for a test message

### Step 5: Deploy to Vercel (For Automatic Posting)

1. Commit your `vercel.json` file (already created)
2. Add environment variables in Vercel:
   - Go to your project settings in Vercel
   - Navigate to "Environment Variables"
   - Add all the environment variables from your `.env.local`
3. Deploy your app
4. The cron job will run every Monday at 9 AM UTC

## Usage

### Manual Posting

1. Go to the Product Jams page
2. Click the "Post to Slack" button
3. Optionally, click the settings icon to override the channel
4. The message will be posted to your configured Slack channel

### Automatic Posting

Once deployed to Vercel with proper environment variables:
- A cron job runs every Monday at 9 AM UTC
- It automatically posts the next 6 weeks of Product Jams to Slack
- Check Vercel logs for cron execution status

### Testing the Cron Endpoint Manually

You can test the cron endpoint manually using curl:

```bash
curl -X GET https://your-app.vercel.app/api/cron/post-product-jams \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Message Format

The Slack message will look like this:

```
📅 *Product Jams - Next 6 Weeks*

*Week of Jan 14-Jan 20, 2026*
• Product Jam: Feature X - Mon, Jan 15
• Product Jam: Feature Y - Wed, Jan 17

*Week of Jan 21-Jan 27, 2026*
• Product Jam: Feature Z - Tue, Jan 22

---
_Posted by Chief of Staff_
```

## Customization

### Change the Schedule

Edit `vercel.json` to change when the cron job runs:

```json
{
  "crons": [
    {
      "path": "/api/cron/post-product-jams",
      "schedule": "0 9 * * 1"
    }
  ]
}
```

Schedule format is cron syntax: `minute hour day-of-month month day-of-week`

Examples:
- `0 9 * * 1` - Every Monday at 9:00 AM UTC
- `0 9 * * 1,3,5` - Monday, Wednesday, Friday at 9:00 AM UTC
- `0 14 * * 1` - Every Monday at 2:00 PM UTC

### Change the Message Format

Edit `/lib/slack.ts` and modify the `formatProductJamsForSlack` function.

## Troubleshooting

### "Slack webhook URL not configured" Error

- Make sure `SLACK_WEBHOOK_URL` is set in your environment variables
- Restart your development server after adding the variable
- For production, ensure the variable is set in Vercel

### "Unauthorized" Error on Cron Job

- Make sure `CRON_SECRET` is set in Vercel environment variables
- The cron job is authenticated via the `Authorization` header
- Vercel automatically adds the correct authorization when calling cron endpoints

### "Failed to get access token" Error

- Your `GOOGLE_REFRESH_TOKEN` may be expired or invalid
- Follow Step 3 again to get a new refresh token
- Make sure your Google OAuth credentials are correct

### Slack Button Not Appearing

- Check that `SLACK_WEBHOOK_URL` is set in your `.env.local`
- The button only appears when the webhook is configured
- Restart your development server

### Rate Limiting

- Manual posts have a 5-second cooldown to prevent spam
- Slack webhooks are limited to 1 message per second
- The app enforces this limit automatically

## Security Notes

- **Never expose your webhook URL publicly** - it's stored server-side only
- The webhook URL is masked in the settings page for security
- The cron secret prevents unauthorized cron executions
- Refresh tokens are stored securely in environment variables

## Support

If you encounter issues:
1. Check Vercel logs for error messages
2. Verify all environment variables are set correctly
3. Test the connection from the Settings page
4. Check your Slack app permissions

## Features Summary

✅ Manual posting from Product Jams page
✅ Automatic scheduled posting (Monday 9 AM UTC)
✅ Custom channel override
✅ Connection testing
✅ Rate limiting
✅ Error handling
✅ Status feedback
✅ Secure webhook storage
