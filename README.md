# Supabase Forgot Password Page

A simple password-reset page built with Vite and Supabase.

## What this does

- Sends a password reset email to the user
- Uses Supabase `resetPasswordForEmail`
- Shows a password creation form when user clicks the reset link
- Updates the password using Supabase `updateUser`
- Shows success message after password is updated

## Setup

1. Deploy this to Vercel (connect GitHub repo)
2. Get the Vercel URL (e.g., https://your-app.vercel.app)
3. In Supabase Dashboard > Auth > Settings:
   - Set "Site URL" to your Vercel URL
   - Add your Vercel URL to "Redirect URLs"
4. Add environment variables in Vercel:
   - `VITE_SUPABASE_URL=https://zvzhoqlokdnalqdmoqmj.supabase.co`
   - `VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2emhvcWxva2RuYWxxZG1vcW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MDM5NDAsImV4cCI6MjA5MTI3OTk0MH0._OVqZOsTkyhxD6NlpmaNf0H6j9eIUzZi7PNCaa2vAl4`

## How it works

- User clicks "Forgot Password" in your main app
- Supabase sends email with reset link pointing to your Vercel URL
- User clicks link → redirected to this page with password creation form
- User sets new password → success message

## Local development

Install dependencies:

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Vercel deployment

- Build command: `npm run build`
- Output directory: `dist`

## Notes

- Replace `<your Supabase anon public key>` with your actual Supabase anon key.
- In Supabase Auth settings, make sure the password reset redirect URL includes the site URL if you want custom redirect handling.
