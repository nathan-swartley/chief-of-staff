# Setup Guide

## Google Calendar API Setup

To enable Google Calendar authentication, you need to set up OAuth credentials in the Google Cloud Console.

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name your project (e.g., "Chief of Staff")
4. Click "Create"

### Step 2: Enable Google Calendar API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Calendar API"
3. Click on it and click "Enable"

### Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" user type
3. Click "Create"
4. Fill in the required fields:
   - App name: "Chief of Staff"
   - User support email: your email
   - Developer contact information: your email
5. Click "Save and Continue"
6. On the "Scopes" page, click "Add or Remove Scopes"
7. Add these scopes:
   - `https://www.googleapis.com/auth/calendar.readonly`
   - `email`
   - `profile`
   - `openid`
8. Click "Save and Continue"
9. Add test users (your email address) if in testing mode
10. Click "Save and Continue"

### Step 4: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Select "Web application"
4. Name it "Chief of Staff Web Client"
5. Add Authorized JavaScript origins:
   - `http://localhost:3000`
6. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
7. Click "Create"
8. Copy the **Client ID** and **Client Secret**

### Step 5: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your credentials:
   ```
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_random_secret_here
   ```

3. Generate a random secret for `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

### Step 6: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with your Google account!

## Production Setup

For production deployment (e.g., Vercel):

1. Update the OAuth consent screen to "Production" (requires verification)
2. Add your production domain to authorized origins and redirect URIs:
   - `https://yourdomain.com`
   - `https://yourdomain.com/api/auth/callback/google`
3. Set environment variables in your hosting platform
4. Update `NEXTAUTH_URL` to your production URL

## Troubleshooting

### "Error 400: redirect_uri_mismatch"
- Make sure the redirect URI in Google Cloud Console exactly matches your app's URL
- Check that you're using the correct domain (localhost:3000 for development)

### "Access blocked: This app's request is invalid"
- Ensure Google Calendar API is enabled
- Check that the OAuth consent screen is properly configured
- Verify that scopes include calendar.readonly

### "Session is null"
- Check that environment variables are set correctly
- Restart the development server after updating `.env.local`
- Clear browser cookies and try signing in again
