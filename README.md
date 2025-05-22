
# ScrubAI

ScrubAI is a secure data processing application that helps users scrub sensitive information from their documents and images.

## Features

- **Content Processing**: Clean text, documents, and images
- **Security-First**: RAM-only processing option with auto-delete
- **Multiple Integrations**: Cloud storage connections for seamless workflows
- **Subscription Plans**: Free trial and multiple paid tiers

## Environment Variables

This project uses environment variables for configuration. For local development, create a `.env` file based on `.env.example` and add your values.

### Required Variables

| Variable | Description | Location |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Client-side |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Client-side |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Client-side |
| `VITE_ENABLE_CLOUDINARY` | Feature flag for Cloudinary integration | Client-side |
| `VITE_ENABLE_WASM_PROCESSING` | Feature flag for WASM processing | Client-side |
| `VITE_ENABLE_ANALYTICS` | Feature flag for analytics | Client-side |
| `VITE_POSTHOG_API_KEY` | PostHog API key | Client-side |

### Server-Side Only Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret |
| `SUPABASE_URL` | Supabase URL (for edge functions) |
| `SUPABASE_ANON_KEY` | Supabase anon key (for edge functions) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |

## Local Development

Follow these steps to set up your local development environment:

1. Clone the repository
   ```sh
   git clone <YOUR_GIT_URL>
   cd scrubai
   ```

2. Install dependencies
   ```sh
   npm i
   ```

3. Create a `.env` file based on `.env.example` and add your environment variables
   ```sh
   cp .env.example .env
   ```

4. Start the development server
   ```sh
   npm run dev
   ```

## Supabase Edge Functions

This project uses Supabase Edge Functions for secure operations like:
- Generating signed Cloudinary upload URLs
- Processing payments via Stripe
- Purging old files automatically

To test edge functions locally, install Supabase CLI and run:
```sh
supabase start
supabase functions serve
```

## Cloudinary Setup

1. Create a Cloudinary account if you don't have one
2. Create an unsigned upload preset named `scrubai_secure` with:
   - Signing Mode: Signed
   - Folder: `scrubai`
   - Access Mode: Authenticated
   - Allowed Formats: pdf,docx,txt,png,jpg,webp
3. Set up your environment variables as described above

## Stripe Setup

1. Create a Stripe account if you don't have one
2. Set up products and prices in the Stripe dashboard
3. Configure the webhook endpoint in Stripe to point to your application's webhook endpoint
4. Set the required Stripe environment variables

## Analytics Setup

1. Create a PostHog account if enabled
2. Set the PostHog API key in your environment variables
3. Create a Sentry project if error tracking is needed

## Security Best Practices

- No API keys in source code
- Service role key never exposed to the client
- Edge functions for secure API integrations
- RLS policies on all Supabase tables
